import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

from routes import chat, voice, automate

app = FastAPI(title="OmniAgent Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Path("static/audio").mkdir(parents=True, exist_ok=True)
Path("static/screenshots").mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(chat.router)
app.include_router(voice.router)
app.include_router(automate.router)


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
