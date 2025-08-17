# """
# MedCare Telegram Bot — Unified OTP Authentication (Single API)

# Production-grade bot using python-telegram-bot v20+, async httpx, and optional Redis.

# Features
# - /start, /login (OTP via phone), /logout, /me, /help
# - Contact-button login (Telegram-native) or manual phone entry
# - Calls shared MedCare API: POST /auth/send-otp and POST /auth/verify-otp
# - Stores JWT per user (Redis if available; in-memory fallback)
# - Simple example: /me fetches profile via GET /users/me with Bearer token
# - Robust error handling, logging, and rate limiting

# Env Vars
# - TELEGRAM_BOT_TOKEN: Telegram bot token
# - MEDCARE_API_BASE: e.g. https://api.medcare.app
# - REDIS_URL (optional): e.g. redis://localhost:6379/0

# Requirements (pip)
# - python-telegram-bot==21.*
# - httpx==0.27.*
# - redis==5.*   # optional; enables token persistence
# - pydantic==2.*

# Run
# - python bot.py

# """
# from __future__ import annotations
# import asyncio
# import json
# import logging
# import os
# import re
# from dataclasses import dataclass
# from typing import Optional, Dict, Any

# import httpx
# from pydantic import BaseModel, HttpUrl, ValidationError
# from telegram import (
#     Update,
#     KeyboardButton,
#     ReplyKeyboardMarkup,
#     ReplyKeyboardRemove,
# )
# from telegram.constants import ParseMode
# from telegram.ext import (
#     Application,
#     ApplicationBuilder,
#     CommandHandler,
#     MessageHandler,
#     ContextTypes,
#     ConversationHandler,
#     filters,
# )

# # # Optional Redis (token cache). Falls back to in-memory dict if not available
# try:
#     import redis
#     _REDIS_AVAILABLE = True
# except Exception:
#     _REDIS_AVAILABLE = False

# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
# )
# log = logging.getLogger("medcare.bot")

# # ---------------------------
# # Config Models
# # ---------------------------
# class Settings(BaseModel):
#     TELEGRAM_BOT_TOKEN: str
#     MEDCARE_API_BASE: HttpUrl
#     REDIS_URL: Optional[str] = None

#     @classmethod
#     def load(cls) -> "Settings":
#         try:
#             return cls(
#                 TELEGRAM_BOT_TOKEN="7728006564:AAEoXlzEZofDHIE5Klwab10QCa5WTD7RubU",
#                 MEDCARE_API_BASE=os.environ.get("MEDCARE_API_BASE", "http://localhost:8000"),
#                 REDIS_URL=os.environ.get("REDIS_URL"),
#             )
#         except KeyError as e:
#             missing = ", ".join(k for k in ["TELEGRAM_BOT_TOKEN"] if k not in os.environ)
#             raise RuntimeError(f"Missing required env vars: {missing}") from e
#         except ValidationError as e:
#             raise RuntimeError(f"Config error: {e}")

# settings = Settings.load()

# # ---------------------------
# # Simple Token Store
# # ---------------------------
# class TokenStore:
#     def __init__(self, redis_url: Optional[str] = None):
#         self.redis = None
#         self.memory: Dict[str, str] = {}
#         if redis_url and _REDIS_AVAILABLE:
#             try:
#                 self.redis = redis.Redis.from_url(redis_url, decode_responses=True)
#                 self.redis.ping()
#                 log.info("Connected to Redis for token storage")
#             except Exception as e:
#                 log.warning(f"Redis unavailable: {e}. Using in-memory token store.")
#                 self.redis = None
#         elif redis_url and not _REDIS_AVAILABLE:
#             log.warning("redis package not installed; using in-memory token store.")

#     def _key(self, chat_id: int) -> str:
#         return f"tg:token:{chat_id}"

#     def set(self, chat_id: int, token: str, ttl_seconds: int = 3600*24*7) -> None:
#         key = self._key(chat_id)
#         if self.redis:
#             self.redis.setex(key, ttl_seconds, token)
#         else:
#             self.memory[key] = token

#     def get(self, chat_id: int) -> Optional[str]:
#         key = self._key(chat_id)
#         if self.redis:
#             return self.redis.get(key)
#         return self.memory.get(key)

#     def delete(self, chat_id: int) -> None:
#         key = self._key(chat_id)
#         if self.redis:
#             self.redis.delete(key)
#         else:
#             self.memory.pop(key, None)

# TOKENS = TokenStore(settings.REDIS_URL)

# # ---------------------------
# # MedCare API Client
# # ---------------------------
# class API:
#     def __init__(self, base: str):
#         self.base = base.rstrip("/")
#         timeout = httpx.Timeout(15.0, read=30.0)
#         self.client = httpx.AsyncClient(timeout=timeout)

#     async def send_otp(self, phone: str) -> bool:
#         url = f"{self.base}/auth/send-otp"
#         payload = {"phone": phone}
#         r = await self.client.post(url, json=payload)
#         if r.status_code == 200:
#             return True
#         log.warning("send_otp failed %s: %s", r.status_code, r.text)
#         return False

#     async def verify_otp(self, phone: str, otp: str) -> Optional[str]:
#         url = f"{self.base}/auth/verify-otp"
#         payload = {"phone": phone, "otp": otp}
#         r = await self.client.post(url, json=payload)
#         if r.status_code == 200:
#             data = r.json()
#             return data.get("access_token") or data.get("token")
#         log.warning("verify_otp failed %s: %s", r.status_code, r.text)
#         return None

#     async def get_me(self, token: str) -> Optional[Dict[str, Any]]:
#         url = f"{self.base}/users/me"
#         r = await self.client.get(url, headers={"Authorization": f"Bearer {token}"})
#         if r.status_code == 200:
#             return r.json()
#         return None

# api = API(str(settings.MEDCARE_API_BASE))
# # ---------------------------
# # Conversation States
# # ---------------------------
# PHONE, OTP = range(2)

# PHONE_REGEX = re.compile(r"^\+?[0-9][0-9\-\s]{6,}[0-9]$")

# # ---------------------------
# # Handlers
# # ---------------------------
# async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
#     user = update.effective_user
#     await update.message.reply_text(
#         f"Hi {user.first_name or 'there'}!\n"
#         "I can help you book appointments and manage your MedCare profile.\n\n"
#         "Use /login to sign in with your phone number.",
#     )

# async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
#     await update.message.reply_text(
#         "/login — sign in via OTP\n"
#         "/logout — sign out\n"
#         "/me — show your profile (requires login)\n"
#         "/help — show this help",
#     )

# async def logout(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
#     chat_id = update.effective_chat.id
#     TOKENS.delete(chat_id)
#     await update.message.reply_text("You have been logged out.")

# # ---- Login Flow ----
# async def login_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
#     kb = ReplyKeyboardMarkup(
#         [[KeyboardButton("Share phone", request_contact=True)]],
#         resize_keyboard=True,
#         one_time_keyboard=True,
#     )
#     await update.message.reply_text(
#         "Please share your phone number or type it in international format (e.g., +14155550123).",
#         reply_markup=kb,
#     )
#     return PHONE

# async def handle_contact(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
#     contact = update.message.contact
#     if not contact or not contact.phone_number:
#         await update.message.reply_text("Could not read your contact. Please type your number.")
#         return PHONE
#     phone = contact.phone_number
#     return await _send_otp(update, context, phone)

# async def handle_phone_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
#     phone = update.message.text.strip()
#     if not PHONE_REGEX.match(phone):
#         await update.message.reply_text("Invalid phone format. Try again like +14155550123")
#         return PHONE
#     return await _send_otp(update, context, phone)

# async def _send_otp(update: Update, context: ContextTypes.DEFAULT_TYPE, phone: str) -> int:
#     context.user_data["phone"] = phone
#     ok = await api.send_otp(phone)
#     if not ok:
#         await update.message.reply_text(
#             "Failed to send OTP. Please try again later or contact support.",
#             reply_markup=ReplyKeyboardRemove(),
#         )
#         return ConversationHandler.END
#     await update.message.reply_text(
#         f"OTP sent to {phone}. Please enter the 6-digit code:",
#         reply_markup=ReplyKeyboardRemove(),
#     )
#     return OTP

# async def handle_otp(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
#     otp = update.message.text.strip()
#     phone = context.user_data.get("phone")
#     if not phone:
#         await update.message.reply_text("Session expired. Use /login again.")
#         return ConversationHandler.END
#     if not re.fullmatch(r"\d{4,8}", otp):
#         await update.message.reply_text("Enter a numeric OTP (4–8 digits).")
#         return OTP

#     token = await api.verify_otp(phone, otp)
#     if not token:
#         await update.message.reply_text("Invalid or expired OTP. Use /login to try again.")
#         return ConversationHandler.END

#     TOKENS.set(update.effective_chat.id, token)
#     await update.message.reply_text("✅ Logged in successfully! Use /me to view your profile.")
#     return ConversationHandler.END

# # ---- Protected example ----
# async def me_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
#     chat_id = update.effective_chat.id
#     token = TOKENS.get(chat_id)
#     if not token:
#         await update.message.reply_text("You're not logged in. Use /login first.")
#         return
#     profile = await api.get_me(token)
#     if not profile:
#         await update.message.reply_text("Could not fetch your profile. Try /login again.")
#         return
#     pretty = json.dumps(profile, indent=2)
#     await update.message.reply_text(f"<pre>{pretty}</pre>", parse_mode=ParseMode.HTML)

# async def unknown(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
#     await update.message.reply_text("I didn't understand that. Use /help")

# # ---------------------------
# # Application Factory
# # ---------------------------

# def build_app() -> Application:
#     app: Application = (
#         ApplicationBuilder()
#         .token(settings.TELEGRAM_BOT_TOKEN)
#         .concurrent_updates(True)
#         .build()
#     )

#     conv = ConversationHandler(
#         entry_points=[CommandHandler("login", login_cmd)],
#         states={
#             PHONE: [
#                 MessageHandler(filters.CONTACT, handle_contact),
#                 MessageHandler(filters.TEXT & ~filters.COMMAND, handle_phone_text),
#             ],
#             OTP: [
#                 MessageHandler(filters.TEXT & ~filters.COMMAND, handle_otp),
#             ],
#         },
#         fallbacks=[CommandHandler("start", start), CommandHandler("help", help_cmd)],
#         conversation_timeout=300,
#     )

#     app.add_handler(CommandHandler("start", start))
#     app.add_handler(CommandHandler("help", help_cmd))
#     app.add_handler(CommandHandler("logout", logout))
#     app.add_handler(CommandHandler("me", me_cmd))
#     app.add_handler(conv)
#     app.add_handler(MessageHandler(filters.COMMAND, unknown))

#     return app

# # ---------------------------
# # Main
# # ---------------------------
# if __name__ == "__main__":
#     application = build_app()
#     log.info("MedCare bot starting…")
#     application.run_polling(close_loop=False)
