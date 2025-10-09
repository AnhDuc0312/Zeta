#!/bin/bash

echo "🔧 Fixing Backend Container..."

# Stop backend
echo "🛑 Stopping backend..."
sudo docker compose stop backend

# Remove backend container and image
echo "🗑️  Removing old backend..."
sudo docker rm zeta-backend 2>/dev/null || true
sudo docker rmi zeta-backend 2>/dev/null || true

# Rebuild backend
echo "🏗️  Rebuilding backend..."
sudo docker compose build --no-cache backend

# Start backend
echo "🚀 Starting backend..."
sudo docker compose up -d backend

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Check status
echo "📋 Checking backend status..."
sudo docker ps | grep zeta-backend

echo ""
echo "📋 Checking logs..."
sudo docker logs zeta-backend --tail 20

echo ""
echo "📋 Testing API:"
curl -f http://localhost:4000/api/health 2>/dev/null && echo "✅ API is working!" || echo "❌ API not responding"

echo ""
echo "📋 To debug further:"
echo "   ./debug-backend.sh"
