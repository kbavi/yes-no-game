import replicate

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

def build_prompt(pre_prompt, messages):
    prompt = pre_prompt + '\n'
    for message in messages:
        if isinstance(message, str):
            prompt += message + '\n'
        elif isinstance(message, dict):
            if message['role'] == 'user':
                prompt += f"Q: {message['content']}\n"
            else:
                prompt += f"{message['content']}\n"
    return prompt