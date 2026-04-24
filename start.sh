#!/bin/bash

# Iris AI Assistant - Quick Start Script

set -e

echo "🚀 Iris AI Assistant - Full Stack Health App"
echo "================================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update as needed."
    echo ""
fi

# Build services
echo "🔨 Building Docker services..."
docker-compose build

echo ""
echo "✅ Build complete!"
echo ""
echo "🎉 Setup complete! You can now run:"
echo ""
echo "   docker-compose up"
echo ""
echo "This will start all services:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:5000"
echo "   - Database: localhost:5432"
echo ""
echo "To verify the backend is running:"
echo "   curl http://localhost:5000/api/v1/health"
echo ""
