import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Bit-Interview"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    SECRET_KEY: str = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY", "bit-interview-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # MongoDB Database URI
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://bit-interview.vercel.app",
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

    # Normalize origins by stripping trailing slashes
    CORS_ORIGINS = [origin.rstrip("/") for origin in CORS_ORIGINS]
    
    # Ensure production Vercel frontend is ALWAYS allowed
    _prod_origin = "https://bit-interview.vercel.app"
    if _prod_origin not in CORS_ORIGINS:
        CORS_ORIGINS.append(_prod_origin)

settings = Settings()
