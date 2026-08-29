import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Bit-Interview"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bit-interview-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]
    
    # Load CORS origins from environment variable if set
    _env_cors = os.getenv("CORS_ORIGIN") or os.getenv("CORS_ORIGINS")
    if _env_cors:
        import json
        try:
            _origins = json.loads(_env_cors)
            if isinstance(_origins, list):
                CORS_ORIGINS = _origins
            else:
                CORS_ORIGINS = [_env_cors]
        except json.JSONDecodeError:
            CORS_ORIGINS = [o.strip() for o in _env_cors.split(",") if o.strip()]

settings = Settings()
