import axios from 'axios';

const flaskServiceUrl = process.env.FLASK_BASE_URL;

export const queryFlaskServer = (model_name: string, pre_prompt: string, message: string, conversation_id: string) => {
    return axios.post(`${flaskServiceUrl}/query`, { model_name, pre_prompt, message, conversation_id });
};
