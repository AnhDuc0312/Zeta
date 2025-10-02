#!/bin/bash

echo "🛑 Stopping All Services..."

# Stop frontend
echo "🛑 Stopping frontend..."
sudo docker compose -f docker-compose.frontend.yml down

# Stop backend services
echo "🛑 Stopping backend services..."
sudo docker compose -f docker-compose.services.yml down

echo "✅ All services stopped!"
echo ""
echo "📋 To start again:"
echo "   ./start-all.sh"
echo ""
echo "📋 To start only backend services:"
echo "   ./start-services.sh"
echo ""
echo "📋 To start only frontend:"
echo "   ./start-frontend.sh"
