#!/usr/bin/env bash
# Prepara el entorno (una vez por sesión en la nube; tarda ~1 min).
set -e
cd "$(dirname "$0")/.."
command -v ffmpeg >/dev/null || { echo "Falta ffmpeg"; exit 1; }
node -e "require('playwright')" 2>/dev/null || { echo "Falta Playwright (node)"; exit 1; }
if [ ! -x .venv/bin/python ]; then python3 -m venv .venv; fi
.venv/bin/pip -q install --disable-pip-version-check numpy faster-whisper
echo "✅ Entorno listo (.venv con numpy + faster-whisper, ffmpeg, Playwright)"
