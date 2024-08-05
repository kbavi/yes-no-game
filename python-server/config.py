import os

class Config:
    REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = int(os.getenv("REDIS_PORT", 6379))
    
    MODELS = {
        "Llama2": os.getenv("LLAMA2_MODEL_PATH"),
        "Mistral": os.getenv("MISTRAL_MODEL_PATH")
    }