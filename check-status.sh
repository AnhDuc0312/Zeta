#!/bin/bash

echo "🔍 Checking Zeta CMS Status..."

echo ""
echo "📋 Docker containers:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep zeta || echo "No Zeta containers running"

echo ""
echo "📋 Docker images:"
sudo docker images | grep zeta || echo "No Zeta images found"

echo ""
echo "📋 Testing API:"
curl -f http://localhost:4000/api/health 2>/dev/null && echo "✅ API is working!" || echo "❌ API not responding"

echo ""
echo "📋 Testing Frontend:"
curl -f http://localhost:8080 2>/dev/null && echo "✅ Frontend is working!" || echo "❌ Frontend not responding"

echo ""
echo "📋 Testing Frontend via Backend:"
curl -f http://localhost:4000 2>/dev/null && echo "✅ Frontend via Backend is working!" || echo "❌ Frontend via Backend not responding"

echo ""
echo "📋 Network info:"
sudo docker network ls | grep zeta || echo "No Zeta networks found"

echo ""
echo "📋 Volume info:"
sudo docker volume ls | grep zeta || echo "No Zeta volumes found"
