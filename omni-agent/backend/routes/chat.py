import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services import chroma_service

router = APIRouter()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

SYSTEM_PROMPT = (
    "You are OmniAgent, a local AI assistant. "
    "Be direct, practical, and concise. "
    "You have access to memory from past conversations — use it when relevant."
)

# In-memory conversation history (resets on server restart, intentional for local use)
_history: list[dict[str, str]] = []


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    memory_updated: bool


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    memory_chunks = chroma_service.query(req.message, n_results=3)

    system = SYSTEM_PROMPT
    if memory_chunks:
        system += "\n\nRelevant memory:\n" + "\n".join(f"- {c}" for c in memory_chunks)

    messages = [{"role": "system", "content": system}] + _history + [
        {"role": "user", "content": req.message}
    ]

    reply = await _call_ollama(messages)

    _history.append({"role": "user", "content": req.message})
    _history.append({"role": "assistant", "content": reply})
    if len(_history) > 40:
        del _history[:2]

    chroma_service.store(
        text=f"User: {req.message}\nAssistant: {reply}",
        metadata={"type": "conversation"},
    )

    return ChatResponse(reply=reply, memory_updated=True)


@router.delete("/chat/history", status_code=204)
async def reset_history():
    _history.clear()


async def _call_ollama(messages: list[dict[str, str]]) -> str:
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            res = await client.post(
                f"{OLLAMA_URL}/api/chat",
                json={"model": OLLAMA_MODEL, "messages": messages, "stream": False},
            )
            res.raise_for_status()
            return res.json()["message"]["content"]
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot reach Ollama at {OLLAMA_URL}. Is it running? Run: ollama serve",
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Ollama error: {e.response.text}")
