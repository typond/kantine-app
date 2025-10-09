#!/bin/bash

# Restaurant Menu Scraper Startup Script

echo "🚀 Starting Restaurant Menu Scraper Service..."

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  Warning: GEMINI_API_KEY environment variable is not set."
    echo "   Please set it with: export GEMINI_API_KEY=your_api_key_here"
    echo "   Or create a .env file with the API key."
    echo ""
    echo "   The service will still start but LLM analysis will fail."
    echo ""
fi

# Create necessary directories
mkdir -p screenshots
mkdir -p temp

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌐 Starting server on port ${PORT:-3001}..."
echo "📸 Screenshots will be saved to: ./screenshots/"
echo "🤖 Make sure to set GEMINI_API_KEY for LLM analysis"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

node server.js

