#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate 2>/dev/null || true
uvicorn main:app --host "${HOST:-0.0.0.0}" --port "${PORT:-8000}" --reload
