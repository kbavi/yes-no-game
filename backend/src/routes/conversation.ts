import { Router, Request, Response } from 'express';
import { IConversation, Conversation, Message } from '../models/conversation';
import { queryFlaskServer } from '../service/flaskService';
import { generateId, parseConversation } from '../utils';
import { queryValidator, startConversationValidator } from './validators';
import { games } from '../games';

const router = Router();

router.post('/start', startConversationValidator, async (req: Request, res: Response) => {
    let { model_name, game_id } = req.body
    const conversation = new Conversation({
        model_name,
        conversation_id: generateId(9),
        game_id,
        messages: [{
            role: "ai",
            content: games[game_id].question
        }]
    });

    await conversation.save();

    res.status(200).json({ conversation: parseConversation(conversation) });
})

router.post('/query', queryValidator, async (req: Request, res: Response) => {
    const { model_name, message, game_id, conversation_id } = req.body;
    const game = games[game_id];

    try {
        const conversation = await findConversation(conversation_id);
        const generatedText = await generateResponse(model_name, game.prePrompt, message, conversation_id);
        const processedResponse = processResponse(generatedText);
        await updateConversation(conversation, message, processedResponse);

        res.status(201).json({ conversation: parseConversation(conversation) });
    } catch (error: any) {
        console.error(error);
        if (error.message === "Couldn't find conversation") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error processing query' });
        }
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const conversations = await Conversation.find().sort({ timestamp: -1 });
        res.json({conversations: conversations.map(parseConversation)});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching conversations' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const conversationId = req.params.id;
    if (!conversationId) {
        res.status(400).json({ error: 'conversation id is required' });
        return
    }

    try {
        const conversation = await Conversation.findOne({ conversation_id: conversationId });
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json({conversation: parseConversation(conversation)});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching conversation' });
    }
});

async function findConversation(conversation_id: string): Promise<IConversation> {
    const conversation = await Conversation.findOne({conversation_id});
    if (!conversation) throw new Error("Couldn't find conversation");
    return conversation;
}

async function generateResponse(model_name: string, pre_prompt: string, message: string, conversation_id: string): Promise<string> {
    const flaskResponse = await queryFlaskServer(model_name, pre_prompt, message, conversation_id);
    return flaskResponse.data.response;
}

function processResponse(generatedText: string): string {
    if (generatedText.startsWith('Yes')) return 'Yes';
    if (generatedText.startsWith('No')) return 'No';
    return generatedText;
}

async function updateConversation(conversation: IConversation, message: string, aiResponse: string) {
    const userMessage = new Message({ role: "user", content: message });
    const aiMessage = new Message({ role: "ai", content: aiResponse });
    conversation.messages.push(userMessage, aiMessage);
    await conversation.save();
}

function handleQueryError(res: Response, error: any) {
    console.error(error);
    if (error.message === "Couldn't find conversation") {
        res.status(404).json({ error: error.message });
    } else {
        res.status(500).json({ error: 'Error processing query' });
    }
}

export default router;
