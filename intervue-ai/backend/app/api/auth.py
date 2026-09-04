from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.user import UserRegister, UserLogin, UserResponse, Token, OAuthMockRequest
from app.services.auth_service import AuthService, USERS_DB
from app.core.security import create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = str(payload["sub"])
    user = AuthService.get_by_id(user_id)
    if not user:
        # Check if this token was issued via Supabase OAuth or social login
        try:
            user = AuthService.get_or_create_supabase_user(payload)
        except Exception:
            user = None

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister):
    try:
        user = AuthService.register_user(data)
        access_token = create_access_token(subject=user["id"])
        user_res = AuthService.to_user_response(user)
        return Token(access_token=access_token, user=user_res)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
def login(data: UserLogin):
    user = AuthService.authenticate_user(data.email, data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    access_token = create_access_token(subject=user["id"])
    user_res = AuthService.to_user_response(user)
    return Token(access_token=access_token, user=user_res)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return AuthService.to_user_response(current_user)

@router.post("/oauth/mock", response_model=Token)
def mock_oauth_login(data: OAuthMockRequest):
    """Fallback OAuth authentication for development or when external OAuth provider is offline"""
    provider_title = data.provider.capitalize()
    email = (data.email or f"{data.provider.lower()}.candidate@gmail.com").strip().lower()
    name = data.name or f"{provider_title} Candidate"
    user_id = f"usr_{data.provider.lower()}_{email.split('@')[0]}"

    user = AuthService.get_by_email(email)
    if not user:
        user = {
            "id": user_id,
            "name": name,
            "email": email,
            "password_hash": "oauth_managed",
            "target_role": data.target_role or "Full Stack Engineer",
            "created_at": datetime.now().isoformat()
        }
        USERS_DB[user["id"]] = user

    access_token = create_access_token(subject=user["id"])
    user_res = AuthService.to_user_response(user)
    return Token(access_token=access_token, user=user_res)

