#!/bin/bash

echo "🔧 Building Backend with Integrated Frontend..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
sudo docker compose -f docker-compose.backend-only.yml down 2>/dev/null || true

# Remove old backend container and image
echo "🗑️  Removing old backend..."
sudo docker rm zeta-backend 2>/dev/null || true
sudo docker rmi zeta-backend 2>/dev/null || true

# Build backend with integrated frontend
echo "🏗️  Building backend with integrated frontend..."
sudo docker compose -f docker-compose.backend-only.yml build --no-cache backend

echo "✅ Build completed!"
echo ""
echo "📋 To start the services:"
echo "   ./start-backend-only.sh"
echo ""
echo "📋 Or manually:"
echo "   sudo docker compose -f docker-compose.backend-only.yml up -d"
