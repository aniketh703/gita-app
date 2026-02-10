#!/bin/bash

# Shell script to run the Bhagavad Gita Chapter Generator on Unix/Linux/macOS
# Usage: ./generate-chapters.sh [api|csv|json] [input_file]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

SOURCE="api"
INPUT=""

if [ -n "$1" ]; then
    SOURCE="$1"
fi

if [ -n "$2" ]; then
    INPUT="--input $2"
fi

echo ""
echo "=============================================="
echo " Bhagavad Gita Chapter Generator"
echo "=============================================="
echo ""
echo "Source: $SOURCE"
if [ -n "$INPUT" ]; then
    echo "Input:  $INPUT"
fi
echo ""

node generate-gita-chapters.js --source "$SOURCE" $INPUT

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Chapters generated successfully!"
    echo "Chapter files are in: gita-app/data/chapters/"
    echo ""
else
    echo ""
    echo "❌ Generator failed"
    exit 1
fi
