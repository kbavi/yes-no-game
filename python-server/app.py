import os
import replicate
import redis
from flask import Flask, request, session, jsonify
from flask_cors import CORS

redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = int(os.getenv("REDIS_PORT", 6379))
r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

os.environ["REPLICATE_API_TOKEN"] = os.getenv("REPLICATE_API_TOKEN")

app = Flask(__name__)
app.secret_key = os.getenv("SESSION_SECRET")
CORS(app)

def generate_text(model_path, prompt, max_length=10):
    output = replicate.run(
        model_path,
        input={
            "prompt": prompt,
            "temperature": 0.1,
            "top_p": 0.9,
            "max_length": max_length,
            "repetition_penalty": 1
        }
    )
    return "".join(output)

MODELS = {
    "Llama2": os.getenv("LLAMA2_MODEL_PATH"),
    "Mistral": os.getenv("MISTRAL_MODEL_PATH")
}



@app.route('/query', methods=['POST'])
def query():
    data = request.json
    model_name = data.get('model_name')
    pre_prompt = data.get('pre_prompt')
    conversation_id = data.get('conversation_id')
    message = data.get('message')

    if not conversation_id:
        return jsonify({"error": "conversation_id is required"}), 400

    if model_name not in MODELS:
        return jsonify({"error": "Invalid model name"}), 400

    model_path = MODELS[model_name]

    conversation_history = r.lrange(conversation_id, 0, -1)
    if len(conversation_history) is 0:
        conversation_history = [pre_prompt]

    conversation_history.append(f"Q: {message}")
    generated_text = generate_text(model_path, f"{pre_prompt}\n{'\n'.join(conversation_history)}")
    conversation_history.append(f"{model_name}: {generated_text}")

    r.rpush(conversation_id, *conversation_history)

    return jsonify({"response": generated_text}), 200


def build_prompt(pre_prompt, messages):
    prompt = pre_prompt + '\n'
    for message in messages:
        if message['role'] is 'user':
            prompt += f"Q: {message['content']}\n"
        else:
            prompt += f"{message['content']}\n"
    return prompt

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5050)
