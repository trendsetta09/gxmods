from fastapi import APIRouter
from pydantic import BaseModel
from services import chroma_service

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    memory_updated: bool


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    memory_chunks = chroma_service.query(req.message, n_results=3)
    context = "\n".join(memory_chunks) if memory_chunks else ""

    reply = build_reply(req.message, context)

    chroma_service.store(
        text=f"User: {req.message}\nAssistant: {reply}",
        metadata={"type": "conversation"},
    )

    return ChatResponse(reply=reply, memory_updated=True)


def build_reply(message: str, context: str) -> str:
    """
    Placeholder response builder. Replace with local LLM call (e.g. Ollama/llama.cpp)
    when the full Omni-Agent LLM layer is wired in.
    """
    if context:
        return f"[Memory context loaded]\n\nYou said: {message}"
    return f"You said: {message}\n\n(No prior memory found for this query.)"
