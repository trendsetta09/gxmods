#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Installing Playwright browsers..."
playwright install chromium

echo "Copying env file..."
[ -f .env ] || cp .env.example .env

echo "Done. Edit .env then run: ./start.sh"
