import os
import json
from typing import Optional, Any

try:
    import redis
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_timeout=2)
    redis_client.ping()
    IS_REDIS_CONNECTED = True
    print("Successfully connected to Redis Cache Server!")
except Exception as e:
    IS_REDIS_CONNECTED = False
    redis_client = None
    print(f"Redis not available locally ({e}). Using local memory caching.")

# In-memory cache fallback
MEM_CACHE: dict = {}

class RedisCacheManager:
    @staticmethod
    def set(key: str, value: Any, ttl_seconds: int = 3600):
        val_str = json.dumps(value)
        if IS_REDIS_CONNECTED and redis_client:
            try:
                redis_client.setex(key, ttl_seconds, val_str)
                return
            except Exception as e:
                print(f"Redis set warning: {e}")
        MEM_CACHE[key] = val_str

    @staticmethod
    def get(key: str) -> Optional[Any]:
        if IS_REDIS_CONNECTED and redis_client:
            try:
                val = redis_client.get(key)
                if val:
                    return json.loads(val.decode('utf-8'))
            except Exception as e:
                print(f"Redis get warning: {e}")
        
        val_mem = MEM_CACHE.get(key)
        if val_mem:
            return json.loads(val_mem)
        return None

    @staticmethod
    def delete(key: str):
        if IS_REDIS_CONNECTED and redis_client:
            try:
                redis_client.delete(key)
            except Exception as e:
                pass
        MEM_CACHE.pop(key, None)
