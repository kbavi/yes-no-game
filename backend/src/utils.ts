import { IConversation, IMessage } from "./models/conversation";

export function generateId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function parseMessage(message: IMessage) {
    return {
        role: message.role,
        content: message.content,
        timestamp: message.timestamp
    }
}

export function parseConversation(conversation: IConversation) {
    return {
        game_id: conversation.game_id,
        conversation_id: conversation.conversation_id,
        model_name: conversation.model_name,
        messages: conversation.messages.map(parseMessage),
        timestamp: conversation.timestamp
    }
}