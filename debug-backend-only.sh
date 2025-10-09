#!/bin/bash

echo "🔍 Debugging Backend with Integrated Frontend..."

# Check container status
echo "📋 Container status:"
sudo docker ps -a | grep zeta

echo ""
echo "📋 Backend container logs:"
sudo docker logs zeta-backend --tail 50

echo ""
echo "📋 Network info:"
sudo docker network ls | grep zeta

echo ""
echo "📋 Volume info:"
sudo docker volume ls | grep zeta

echo ""
echo "📋 Health check:"
sudo docker inspect zeta-backend | grep -A 10 "Health"

echo ""
echo "📋 Environment variables:"
sudo docker exec zeta-backend env 2>/dev/null || echo "Container not running"

echo ""
echo "📋 File system check:"
sudo docker exec zeta-backend ls -la /app 2>/dev/null || echo "Container not running"

echo ""
echo "📋 UI directory check:"
sudo docker exec zeta-backend ls -la /app/ui 2>/dev/null || echo "UI directory not found"

echo ""
echo "📋 Testing API:"
curl -f http://localhost:4000/api/health 2>/dev/null && echo "✅ API is working!" || echo "❌ API not responding"

echo ""
echo "📋 Testing Frontend:"
curl -f http://localhost:8080 2>/dev/null && echo "✅ Frontend is working!" || echo "❌ Frontend not responding"

echo ""
echo "📋 Testing Frontend via Backend:"
curl -f http://localhost:4000 2>/dev/null && echo "✅ Frontend via Backend is working!" || echo "❌ Frontend via Backend not responding"
