import uuid
from datetime import datetime
from typing import Dict, Optional
from app.schemas.user import UserRegister, UserResponse
from app.core.security import hash_password, verify_password

# In-memory user database store for initial phases
USERS_DB: Dict[str, dict] = {}

# Default demo accounts
DEMO_USER_ID = "usr_khushal_demo_01"
USERS_DB[DEMO_USER_ID] = {
    "id": DEMO_USER_ID,
    "name": "Khushal Kumar",
    "email": "khushal@example.com",
    "password_hash": hash_password("password123"),
    "target_role": "Full Stack Engineer",
    "created_at": datetime.now().isoformat()
}

RECRUITER_USER_ID = "usr_recruiter_demo_02"
USERS_DB[RECRUITER_USER_ID] = {
    "id": RECRUITER_USER_ID,
    "name": "Sarah Jenkins",
    "email": "recruiter@example.com",
    "password_hash": hash_password("password123"),
    "target_role": "Technical Recruiter / HR",
    "created_at": datetime.now().isoformat()
}

class AuthService:
    @staticmethod
    def get_by_email(email: str) -> Optional[dict]:
        email_clean = email.strip().lower()
        for user in USERS_DB.values():
            if user["email"].strip().lower() == email_clean:
                return user
        return None

    @staticmethod
    def get_by_id(user_id: str) -> Optional[dict]:
        return USERS_DB.get(user_id)

    @staticmethod
    def register_user(data: UserRegister) -> dict:
        existing = AuthService.get_by_email(data.email)
        if existing:
            raise ValueError("Email already registered")

        user_id = f"usr_{uuid.uuid4().hex[:12]}"
        user_record = {
            "id": user_id,
            "name": data.name.strip(),
            "email": data.email.strip().lower(),
            "password_hash": hash_password(data.password),
            "target_role": data.target_role or "Full Stack Engineer",
            "created_at": datetime.now().isoformat()
        }
        USERS_DB[user_id] = user_record
        return user_record

    @staticmethod
    def authenticate_user(email: str, password: str) -> Optional[dict]:
        user = AuthService.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user["password_hash"]):
            return None
        return user

    @staticmethod
    def to_user_response(user: dict) -> UserResponse:
        return UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            target_role=user["target_role"],
            created_at=user["created_at"]
        )
