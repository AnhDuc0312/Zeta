#!/bin/bash

echo "🚀 Starting Backend Services (Database + Redis + API)..."

# Copy environment
cp env .env

# Create network if not exists
sudo docker network create zeta-network 2>/dev/null || echo "Network already exists"

# Start backend services
sudo docker compose -f docker-compose.services.yml up -d

echo "✅ Backend services started!"
echo ""
echo "📋 Services running:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - Backend API: localhost:4000"
echo ""
echo "📋 API endpoints:"
echo "   - Health: http://localhost:4000/api/health"
echo "   - Ping: http://localhost:4000/api/ping"
echo "   - Swagger: http://localhost:4000/api-docs"
echo ""
echo "📋 To check logs:"
echo "   sudo docker compose -f docker-compose.services.yml logs"
echo ""
echo "📋 To check status:"
echo "   sudo docker compose -f docker-compose.services.yml ps"
echo ""
echo "📋 To stop:"
echo "   sudo docker compose -f docker-compose.services.yml down"
