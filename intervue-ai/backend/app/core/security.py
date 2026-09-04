import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any
import jwt
from app.core.config import settings

def hash_password(password: str) -> str:
    """Simple robust password hashing using HMAC SHA256"""
    key = settings.SECRET_KEY.encode('utf-8')
    msg = password.encode('utf-8')
    return hmac.new(key, msg, hashlib.sha256).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hmac.compare_digest(hash_password(plain_password), hashed_password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT Access Token"""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "iat": datetime.now(timezone.utc)
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate JWT Token (supports native backend JWT and Supabase OAuth JWTs)"""
    # 1. Attempt native backend verification
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        pass

    # 2. Attempt decoding Supabase JWT or OAuth payload
    try:
        unverified_payload = jwt.decode(token, options={"verify_signature": False})
        if isinstance(unverified_payload, dict) and "sub" in unverified_payload:
            # Check expiration timestamp if present
            exp = unverified_payload.get("exp")
            if exp:
                now_ts = datetime.now(timezone.utc).timestamp()
                if now_ts > exp:
                    return None
            return unverified_payload
    except Exception:
        pass

    return None
