"""
SafePath AI — Authentication Router
=====================================
Endpoints:
  POST /auth/register  — Verify Firebase token, create user record
  POST /auth/login     — Verify Firebase token, return existing user profile
  GET  /auth/me        — Return current authenticated user's profile
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth_utils import get_current_user, verify_firebase_token
from database import get_db
from models import User, UserRole
from schemas import MessageResponse, UserLoginRequest, UserRegisterRequest, UserResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ---------------------------------------------------------------------------
# POST /auth/register
# ---------------------------------------------------------------------------

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description=(
        "Verifies the Firebase ID token, extracts user info, and creates a "
        "corresponding record in the database. Safe to call multiple times — "
        "if the user already exists, their profile is updated and returned."
    ),
)
async def register(
    body: UserRegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    # Verify token with Firebase
    claims = await verify_firebase_token(body.firebase_token)

    firebase_uid: str = claims["uid"]
    email: str = claims.get("email", "")
    display_name: str = body.display_name or claims.get("name", "") or email.split("@")[0]

    # Upsert: create if not exists, else return existing
    result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
    user = result.scalar_one_or_none()

    if user is None:
        user = User(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name,
            role=UserRole.DRIVER.value,
        )
        db.add(user)
        await db.flush()
        logger.info("New user registered: %s (%s)", email, firebase_uid)
    else:
        # Update display name if provided
        if body.display_name:
            user.display_name = body.display_name
            user.updated_at = datetime.now(timezone.utc)
        logger.info("Existing user re-registered: %s", email)

    return UserResponse.model_validate(user)


# ---------------------------------------------------------------------------
# POST /auth/login
# ---------------------------------------------------------------------------

@router.post(
    "/login",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Login / verify session",
    description=(
        "Verifies the Firebase ID token and returns the user's profile from the "
        "database.  The client should call /auth/register first if the user is new."
    ),
)
async def login(
    body: UserLoginRequest,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    claims = await verify_firebase_token(body.firebase_token)
    firebase_uid: str = claims["uid"]

    result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please register first via POST /auth/register.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact support.",
        )

    logger.info("User logged in: %s", user.email)
    return UserResponse.model_validate(user)


# ---------------------------------------------------------------------------
# GET /auth/me
# ---------------------------------------------------------------------------

@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
)
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)
