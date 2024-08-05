import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
    role: string;
    content: string;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
    role: {type: String, required: true},
    content: {type: String, required: true},
    timestamp: { type: Date, default: Date.now }
})

export interface IConversation extends Document {
    model_name: string;
    conversation_id: string;
    game_id: string;
    messages: IMessage[];
    timestamp: Date;
}
const conversationSchema = new Schema<IConversation>({
    model_name: { type: String, required: true },
    conversation_id: { type: String, required: true },
    game_id: { type: String, required: true },
    messages: {type: [messageSchema]},
    timestamp: { type: Date, default: Date.now }
});


export const Message = model<IMessage>('Message', messageSchema);
export const Conversation = model<IConversation>('Conversation', conversationSchema);
