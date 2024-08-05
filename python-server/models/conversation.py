import redis

class Conversation:
    def __init__(self, redis_host, redis_port):
        self.redis = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

    def get_history(self, conversation_id, pre_prompt):
        history = self.redis.lrange(conversation_id, 0, -1)
        return [pre_prompt] if not history else history

    def save_history(self, conversation_id, history):
        self.redis.rpush(conversation_id, *history)