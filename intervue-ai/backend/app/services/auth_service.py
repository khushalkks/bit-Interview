import uuid
from datetime import datetime
from typing import Optional
from app.schemas.user import UserRegister, UserResponse
from app.core.security import hash_password, verify_password
from app.db.mongodb import MongoDBManager

# Default demo accounts
DEMO_USERS = [
    {
        "id": "usr_khushal_demo_01",
        "name": "Khushal Kumar",
        "email": "khushal@example.com",
        "password_hash": hash_password("password123"),
        "target_role": "Full Stack Engineer",
        "created_at": datetime.now().isoformat()
    },
    {
        "id": "usr_recruiter_demo_02",
        "name": "Sarah Jenkins",
        "email": "recruiter@example.com",
        "password_hash": hash_password("password123"),
        "target_role": "Technical Recruiter / HR",
        "created_at": datetime.now().isoformat()
    }
]

class AuthService:
    @classmethod
    def init_demo_users(cls):
        """Seed demo users into MongoDB if not already present"""
        try:
            for demo_user in DEMO_USERS:
                existing = cls.get_by_email(demo_user["email"])
                if not existing:
                    MongoDBManager.insert_document("users", demo_user["id"], demo_user)
        except Exception as e:
            print(f"Demo user initialization note: {e}")

    @staticmethod
    def _normalize_user(user_doc: Optional[dict]) -> Optional[dict]:
        if not user_doc:
            return None
        doc = dict(user_doc)
        if "id" not in doc and "_id" in doc:
            doc["id"] = str(doc["_id"])
        return doc

    @classmethod
    def get_by_email(cls, email: str) -> Optional[dict]:
        if not email:
            return None
        email_clean = email.strip().lower()
        user = MongoDBManager.find_one("users", {"email": email_clean})
        return cls._normalize_user(user)

    @classmethod
    def get_by_id(cls, user_id: str) -> Optional[dict]:
        if not user_id:
            return None
        user = MongoDBManager.find_document("users", user_id)
        if not user:
            user = MongoDBManager.find_one("users", {"id": user_id})
        return cls._normalize_user(user)

    @classmethod
    def register_user(cls, data: UserRegister) -> dict:
        existing = cls.get_by_email(data.email)
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
        MongoDBManager.insert_document("users", user_id, user_record)
        return user_record

    @classmethod
    def authenticate_user(cls, email: str, password: str) -> Optional[dict]:
        user = cls.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.get("password_hash", "")):
            return None
        return user

    @classmethod
    def get_or_create_oauth_user(
        cls, 
        provider: str, 
        email: Optional[str] = None, 
        name: Optional[str] = None, 
        target_role: Optional[str] = None
    ) -> dict:
        provider_title = provider.capitalize()
        clean_email = (email or f"{provider.lower()}.candidate@gmail.com").strip().lower()
        clean_name = name or f"{provider_title} Candidate"
        user_id = f"usr_{provider.lower()}_{clean_email.split('@')[0]}"

        user = cls.get_by_email(clean_email)
        if not user:
            user = {
                "id": user_id,
                "name": clean_name,
                "email": clean_email,
                "password_hash": "oauth_managed",
                "target_role": target_role or "Full Stack Engineer",
                "created_at": datetime.now().isoformat()
            }
            MongoDBManager.insert_document("users", user_id, user)
        return user

    @staticmethod
    def to_user_response(user: dict) -> UserResponse:
        return UserResponse(
            id=str(user.get("id") or user.get("_id", "")),
            name=user.get("name", ""),
            email=user.get("email", ""),
            target_role=user.get("target_role", "Full Stack Engineer"),
            created_at=user.get("created_at", datetime.now().isoformat())
        )

# Initialize demo users on startup
AuthService.init_demo_users()
