#!/bin/bash

echo "🐳 Building Docker containers..."

# Build frontend
echo "🏗️  Building frontend..."
sudo docker compose build --no-cache frontend

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
    
    # Build all services
    echo "🚀 Building all services..."
    sudo docker compose build
    
    if [ $? -eq 0 ]; then
        echo "✅ All builds successful!"
        echo ""
        echo "📋 To start services:"
        echo "   sudo docker compose up -d"
        echo ""
        echo "📋 To check logs:"
        echo "   sudo docker compose logs"
        echo ""
        echo "📋 To check status:"
        echo "   sudo docker compose ps"
    else
        echo "❌ Build failed!"
        exit 1
    fi
else
    echo "❌ Frontend build failed!"
    exit 1
fi
