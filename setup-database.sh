#!/bin/bash

echo "🗄️  Setting up Zeta CMS Database..."

# Start containers first
echo "🚀 Starting containers..."
sudo docker compose -f docker-compose.backend-only.yml up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 15

# Check if database is already initialized
echo "🔍 Checking database status..."
TABLE_COUNT=$(sudo docker exec zeta-postgres psql -U user -d builder_orbit_lab -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "✅ Database is already initialized with $TABLE_COUNT tables"
else
    echo "🔧 Database needs initialization..."
    echo "📋 The database will be automatically initialized by PostgreSQL"
    echo "   using the SQL files in data-export/ directory"
fi

echo ""
echo "📊 Database Status:"
echo "=================="
echo "Host: localhost:5432"
echo "Database: builder_orbit_lab"
echo "User: user"
echo "Password: 120301"
echo "Tables: $TABLE_COUNT"

echo ""
echo "✅ Database setup completed!"
echo ""
echo "📋 Next steps:"
echo "  1. Check if backend is running: ./check-status.sh"
echo "  2. Access the application: http://localhost:8080"
echo "  3. Check API health: http://localhost:4000/api/health"
