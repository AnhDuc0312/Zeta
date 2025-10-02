#!/bin/bash

echo "🚀 Starting Frontend..."

# Create network if not exists (should already exist from services)
sudo docker network create zeta-network 2>/dev/null || echo "Network already exists"

# Start frontend
sudo docker compose -f docker-compose.frontend.yml up -d

echo "✅ Frontend started!"
echo ""
echo "📋 Services running:"
echo "   - Frontend: http://localhost:8080"
echo ""
echo "📋 Make sure backend services are running:"
echo "   ./start-services.sh"
echo ""
echo "📋 To check logs:"
echo "   sudo docker compose -f docker-compose.frontend.yml logs"
echo ""
echo "📋 To check status:"
echo "   sudo docker compose -f docker-compose.frontend.yml ps"
echo ""
echo "📋 To stop:"
echo "   sudo docker compose -f docker-compose.frontend.yml down"
