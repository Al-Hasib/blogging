from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError


def get_user_id_from_token(token: str) -> str | None:
    try:
        access = AccessToken(token)
        return access.get("user_id")
    except TokenError:
        return None


def validate_token(token: str) -> dict | None:
    try:
        access = AccessToken(token)
        return {
            "user_id": access.get("user_id"),
            "token_type": access.get("token_type"),
            "exp": access.get("exp"),
        }
    except TokenError:
        return None
