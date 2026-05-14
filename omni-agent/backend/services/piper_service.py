import subprocess
import tempfile
import os
import uuid
from pathlib import Path

AUDIO_DIR = Path("static/audio")
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

PIPER_MODEL = os.getenv("PIPER_MODEL", "en_US-lessac-medium")
PIPER_BIN = os.getenv("PIPER_BIN", "piper")


async def synthesize(text: str) -> str:
    out_name = f"{uuid.uuid4().hex}.wav"
    out_path = AUDIO_DIR / out_name

    proc = subprocess.run(
        [PIPER_BIN, "--model", PIPER_MODEL, "--output_file", str(out_path)],
        input=text.encode(),
        capture_output=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Piper failed: {proc.stderr.decode()}")

    return f"/static/audio/{out_name}"
