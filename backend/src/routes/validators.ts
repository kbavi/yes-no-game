import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const startConversationSchema = Joi.object({
    model_name: Joi.string()
        .valid('Llama2', 'Mistral').required(),
    game_id: Joi.string().valid('turtleSoup').required()
})

export function startConversationValidator(req: Request, res: Response, next: NextFunction) {
    const {error, value} =  startConversationSchema.validate(req.body)
    if (error) {
        res.status(400).json({ error: error.message });
        return
    }
    next()
}

const querySchema = Joi.object({
    model_name: Joi.string().valid('Llama2', 'Mistral').required(),
    game_id: Joi.string().valid('turtleSoup').required(),
    message: Joi.string().min(1).required(),
    conversation_id: Joi.string().length(9).required()
})

export function queryValidator(req: Request, res: Response, next: NextFunction) {
    const {error, value} =  querySchema.validate(req.body)
    if (error) {
        res.status(400).json({ error: error.message });
        return
    }
    next()
}