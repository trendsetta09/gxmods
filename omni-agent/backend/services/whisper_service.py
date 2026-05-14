import whisper
import tempfile
import os
from pathlib import Path

_model = None


def _get_model():
    global _model
    if _model is None:
        _model = whisper.load_model("base.en")
    return _model


async def transcribe(audio_bytes: bytes, filename: str = "audio.wav") -> str:
    model = _get_model()
    suffix = Path(filename).suffix or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as f:
        f.write(audio_bytes)
        tmp_path = f.name
    try:
        result = model.transcribe(tmp_path, fp16=False)
        return result["text"].strip()
    finally:
        os.unlink(tmp_path)
