#!/bin/bash

echo "🛑 Stopping All Services..."

# Stop all services
echo "🛑 Stopping all services..."
sudo docker compose down

echo "✅ All services stopped!"
echo ""
echo "📋 To start again:"
echo "   ./start-all.sh"
echo ""
echo "📋 To start only backend with integrated frontend:"
echo "   ./start-backend-only.sh"
