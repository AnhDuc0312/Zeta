#!/bin/bash

echo "🔧 Fixing Docker build issues..."

# Remove version from docker-compose.yml (obsolete)
echo "📝 Removing obsolete version from docker-compose.yml..."
sed -i '1d' docker-compose.yml

# Build frontend with legacy peer deps
echo "🏗️  Building frontend with legacy peer deps..."
sudo docker compose build --no-cache frontend

# If still fails, try with force
if [ $? -ne 0 ]; then
    echo "⚠️  First attempt failed, trying with --force..."
    sudo docker compose build --no-cache --build-arg NPM_FLAGS="--force" frontend
fi

# Build all services
echo "🚀 Building all services..."
sudo docker compose build

echo "✅ Build completed!"
echo "📋 To start the services:"
echo "   sudo docker compose up -d"
echo ""
echo "📋 To check logs:"
echo "   sudo docker compose logs"
