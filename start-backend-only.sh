#!/bin/bash

echo "🚀 Starting Backend with Integrated Frontend..."

# Copy environment
cp env .env

# Create network if not exists
sudo docker network create zeta-network 2>/dev/null || echo "Network already exists"

# Start backend services with integrated frontend
sudo docker compose -f docker-compose.backend-only.yml up -d

echo "✅ Backend with integrated frontend started!"
echo ""
echo "📋 Services running:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - Backend API: localhost:4000"
echo "   - Frontend (integrated): localhost:8080"
echo ""
echo "📋 URLs:"
echo "   - Frontend: http://localhost:8080"
echo "   - API: http://localhost:4000/api"
echo "   - API Health: http://localhost:4000/api/health"
echo "   - API Docs: http://localhost:4000/api-docs"
echo ""
echo "📋 To check logs:"
echo "   sudo docker compose -f docker-compose.backend-only.yml logs"
echo ""
echo "📋 To check status:"
echo "   sudo docker compose -f docker-compose.backend-only.yml ps"
echo ""
echo "📋 To stop:"
echo "   sudo docker compose -f docker-compose.backend-only.yml down"
