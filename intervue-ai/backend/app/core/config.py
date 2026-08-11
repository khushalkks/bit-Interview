import os
from typing import List

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

settings = Settings()
