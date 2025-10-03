#!/bin/bash

echo "🔍 Debugging Backend Container..."

# Check container status
echo "📋 Container status:"
sudo docker ps -a | grep zeta-backend

echo ""
echo "📋 Container logs:"
sudo docker logs zeta-backend --tail 50

echo ""
echo "📋 Network info:"
sudo docker network ls | grep zeta

echo ""
echo "📋 Volume info:"
sudo docker volume ls | grep backend

echo ""
echo "📋 Health check:"
sudo docker inspect zeta-backend | grep -A 10 "Health"

echo ""
echo "📋 Environment variables:"
sudo docker exec zeta-backend env 2>/dev/null || echo "Container not running"

echo ""
echo "📋 File system check:"
sudo docker exec zeta-backend ls -la /app 2>/dev/null || echo "Container not running"
