#!/bin/bash

echo "🚀 Starting All Services..."

# Copy environment
cp env .env

# Create network
sudo docker network create zeta-network 2>/dev/null || echo "Network already exists"

# Start all services (backend with integrated frontend)
echo "🏗️  Starting all services..."
sudo docker compose up -d

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 15

# Frontend is now integrated in backend
echo "🎨 Frontend is integrated in backend..."

echo "✅ All services started!"
echo ""
echo "📋 Services running:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - Backend API: localhost:4000"
echo "   - Frontend: localhost:8080"
echo ""
echo "📋 URLs:"
echo "   - Frontend: http://localhost:8080"
echo "   - API: http://localhost:4000/api"
echo "   - API Docs: http://localhost:4000/api-docs"
echo ""
echo "📋 To check logs:"
echo "   sudo docker compose logs"
echo ""
echo "📋 To check status:"
echo "   sudo docker compose ps"
echo ""
echo "📋 To stop all:"
echo "   ./stop-all.sh"
