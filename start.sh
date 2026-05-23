#!/bin/bash
# ══════════════════════════════════════════
#  WebNotes — Local Dev Launcher
#  Usage: bash start.sh
# ══════════════════════════════════════════

PORT=3000
URL="http://localhost:$PORT"

echo ""
echo "  📝 WebNotes — Local Server"
echo "  ──────────────────────────"

# ── Check Node is available ──
if ! command -v node &>/dev/null; then
  echo "  ❌  Node.js not found."
  echo "  👉  Install it from https://nodejs.org and re-run this script."
  exit 1
fi

echo "  ✅  Node $(node -v) found"
echo "  🚀  Starting server on $URL ..."
echo ""

# ── Try to open browser after a short delay ──
open_browser() {
  sleep 1
  if command -v xdg-open &>/dev/null; then
    xdg-open "$URL"          # Linux
  elif command -v open &>/dev/null; then
    open "$URL"              # macOS
  fi
}
open_browser &

# ── Start serve (downloads automatically via npx if not installed) ──
npx --yes serve . -l $PORT
