#!/bin/bash

echo "🏥 Health Check - All Services"
echo "================================"

# Check containers
echo "📋 Container Status:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep zeta

echo ""
echo "🔍 Service Health Checks:"

# Check PostgreSQL
echo -n "PostgreSQL: "
sudo docker exec zeta-postgres pg_isready -U user -d builder_orbit_lab 2>/dev/null && echo "✅ Healthy" || echo "❌ Unhealthy"

# Check Redis
echo -n "Redis: "
sudo docker exec zeta-redis redis-cli ping 2>/dev/null | grep -q PONG && echo "✅ Healthy" || echo "❌ Unhealthy"

# Check Backend API
echo -n "Backend API: "
curl -f http://localhost:4000/api/health 2>/dev/null >/dev/null && echo "✅ Healthy" || echo "❌ Unhealthy"

# Check Frontend
echo -n "Frontend: "
curl -f http://localhost:8080 2>/dev/null >/dev/null && echo "✅ Healthy" || echo "❌ Unhealthy"

echo ""
echo "🌐 URLs:"
echo "   - Frontend: http://localhost:8080"
echo "   - Backend API: http://localhost:4000/api"
echo "   - API Health: http://localhost:4000/api/health"
echo "   - API Docs: http://localhost:4000/api-docs"

echo ""
echo "📊 Resource Usage:"
sudo docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep zeta

echo ""
echo "📋 Recent Logs (Backend):"
sudo docker logs zeta-backend --tail 5 2>/dev/null || echo "Backend not running"

echo ""
echo "📋 Recent Logs (Frontend):"
sudo docker logs zeta-frontend --tail 5 2>/dev/null || echo "Frontend not running"

