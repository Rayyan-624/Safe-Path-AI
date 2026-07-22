"""
SafePath AI — Firebase Authentication Utilities
=================================================
Provides:
  - `init_firebase_app()` — called once on startup
  - `verify_firebase_token(token)` — verifies an ID token, returns decoded claims
  - `get_current_user(db, token)` — FastAPI dependency that resolves to a User ORM object
  - `require_admin(user)` — FastAPI dependency that asserts admin role
"""

from __future__ import annotations

import logging
import os
from functools import lru_cache
from typing import Optional

import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database import get_db
from models import User, UserRole

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Firebase app initialisation (idempotent)
# ---------------------------------------------------------------------------

_firebase_app: Optional[firebase_admin.App] = None


def init_firebase_app() -> None:
    """
    Initialise the Firebase Admin SDK.  Safe to call multiple times — subsequent
    calls are no-ops if the app is already initialised.

    If FIREBASE_SERVICE_ACCOUNT_JSON does not exist (e.g., CI/CD environment
    without secrets), the SDK falls back to Application Default Credentials.
    """
    global _firebase_app
    if _firebase_app is not None:
        return

    sa_path = settings.FIREBASE_SERVICE_ACCOUNT_JSON

    try:
        if os.path.isfile(sa_path):
            cred = credentials.Certificate(sa_path)
            logger.info("Firebase: initialised with service-account file: %s", sa_path)
        else:
            # Application Default Credentials (Google Cloud environments)
            cred = credentials.ApplicationDefault()
            logger.info("Firebase: initialised with Application Default Credentials.")

        _firebase_app = firebase_admin.initialize_app(
            cred,
            {"projectId": settings.FIREBASE_PROJECT_ID or None},
        )
    except ValueError:
        # App already initialised (e.g., in tests) — get existing reference
        _firebase_app = firebase_admin.get_app()
        logger.info("Firebase: reusing existing app instance.")


# ---------------------------------------------------------------------------
# Token verification
# ---------------------------------------------------------------------------

async def verify_firebase_token(id_token: str) -> dict:
    """
    Verify a Firebase ID token and return its decoded claims.

    Raises
    ------
    HTTPException 401
        If the token is invalid, expired, or revoked.
    """
    try:
        decoded = firebase_auth.verify_id_token(id_token, check_revoked=True)
        return decoded
    except firebase_auth.RevokedIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase token has been revoked.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase token has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except firebase_auth.InvalidIdTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as exc:
        logger.error("Unexpected token verification error: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ---------------------------------------------------------------------------
# FastAPI security scheme
# ---------------------------------------------------------------------------

_bearer_scheme = HTTPBearer(auto_error=True)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    FastAPI dependency that:
    1. Extracts the Bearer token from the Authorization header.
    2. Verifies it with Firebase.
    3. Looks up (or creates) the corresponding User in the database.

    Returns the User ORM object.
    """
    claims = await verify_firebase_token(credentials.credentials)
    firebase_uid: str = claims["uid"]

    result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "User not found. Please register via POST /auth/register first."
            ),
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    ),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Like get_current_user but returns None instead of raising if no token
    is provided.  Used for endpoints that allow anonymous access.
    """
    if credentials is None:
        return None
    try:
        return await get_current_user(credentials=credentials, db=db)
    except HTTPException:
        return None


async def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    FastAPI dependency that ensures the requesting user has the 'admin' role.
    Chain after get_current_user.
    """
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return current_user
