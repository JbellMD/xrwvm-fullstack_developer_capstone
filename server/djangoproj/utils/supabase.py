from django.conf import settings
from supabase import create_client, Client

def get_supabase_client() -> Client:
    """
    Create and return a Supabase client instance
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def verify_supabase_jwt(token: str) -> dict:
    """
    Verify a Supabase JWT token and return the decoded payload
    """
    from jose import jwt
    try:
        return jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"]
        )
    except jwt.JWTError:
        return None
