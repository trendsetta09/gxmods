from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services import whisper_service, piper_service

router = APIRouter()


@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    transcript = await whisper_service.transcribe(audio_bytes, file.filename or "audio.wav")
    return {"transcript": transcript}


class SpeakRequest(BaseModel):
    text: str


@router.post("/speak")
async def speak(req: SpeakRequest):
    audio_url = await piper_service.synthesize(req.text)
    return {"audio_url": audio_url}
