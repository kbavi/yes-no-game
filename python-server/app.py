from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from llm import generate_text, build_prompt
from models.conversation import Conversation
from exceptions import InvalidModelError, MissingConversationIdError

app = Flask(__name__)
CORS(app)
config = Config()
conversation = Conversation(config.redis_host, config.redis_port)

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    try:
        model_name = data['model_name']
        pre_prompt = data['pre_prompt']
        conversation_id = data['conversation_id']
        message = data['message']

        if conversation_id is None or conversation_id == "":
            raise MissingConversationIdError("Conversation ID is required")

        if model_name not in config.MODELS:
            raise InvalidModelError("Invalid model name")

        model_path = config.MODELS[model_name]
        conversation_history = conversation.get_history(conversation_id, pre_prompt)
        conversation_history.append(f"Q: {message}")

        prompt = build_prompt(pre_prompt, conversation_history)
        generated_text = generate_text(model_path, prompt)
        
        conversation_history.append(f"{model_name}: {generated_text}")
        conversation.save_history(conversation_id, conversation_history)

        return jsonify({"response": generated_text}), 200

    except KeyError:
        return jsonify({"error": "Missing required fields"}), 400
    except MissingConversationIdError:
        return jsonify({"error": "Missing conversation id"}), 400
    except InvalidModelError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5050)