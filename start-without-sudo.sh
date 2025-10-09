#!/bin/bash

echo "🚀 Starting Zeta CMS without sudo..."

# Check if user is in docker group
if groups $USER | grep -q '\bdocker\b'; then
    echo "✅ User is in docker group, proceeding without sudo"
    
    # Copy environment
    cp env .env
    
    # Create network if not exists
    docker network create zeta-network 2>/dev/null || echo "Network already exists"
    
    # Start backend services with integrated frontend
    docker compose -f docker-compose.backend-only.yml up -d
    
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
    echo "   docker compose -f docker-compose.backend-only.yml logs"
    echo ""
    echo "📋 To check status:"
    echo "   docker compose -f docker-compose.backend-only.yml ps"
    echo ""
    echo "📋 To stop:"
    echo "   docker compose -f docker-compose.backend-only.yml down"
    
else
    echo "❌ User is not in docker group"
    echo "Please add user to docker group:"
    echo "sudo usermod -aG docker $USER"
    echo "Then logout and login again"
    echo ""
    echo "Or run with sudo:"
    echo "sudo ./start-backend-only.sh"
fi
