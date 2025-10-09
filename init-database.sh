#!/bin/bash

echo "🗄️  Zeta CMS Database Initialization"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if containers are running
check_containers() {
    echo "🔍 Checking if containers are running..."
    
    if sudo docker ps | grep -q "zeta-postgres"; then
        echo "✅ PostgreSQL container is running"
        return 0
    else
        echo "❌ PostgreSQL container is not running"
        return 1
    fi
}

# Function to start containers if not running
start_containers() {
    echo "🚀 Starting containers..."
    sudo docker compose -f docker-compose.backend-only.yml up -d postgres
    
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Wait for PostgreSQL to be ready
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if sudo docker exec zeta-postgres pg_isready -U user -d builder_orbit_lab > /dev/null 2>&1; then
            echo "✅ PostgreSQL is ready"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo "⏳ Waiting for PostgreSQL... (attempt $attempt/$max_attempts)"
        sleep 2
    done
    
    echo "❌ PostgreSQL failed to start within expected time"
    return 1
}

# Function to check if database is initialized
check_database() {
    echo "🔍 Checking if database is initialized..."
    
    # Check if tables exist
    local table_count=$(sudo docker exec zeta-postgres psql -U user -d builder_orbit_lab -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    
    if [ "$table_count" -gt 0 ]; then
        echo "✅ Database is already initialized with $table_count tables"
        return 0
    else
        echo "❌ Database is not initialized"
        return 1
    fi
}

# Function to initialize database manually
init_database_manual() {
    echo "🔧 Initializing database manually..."
    
    # Create database if not exists
    sudo docker exec zeta-postgres psql -U user -c "CREATE DATABASE builder_orbit_lab;" 2>/dev/null || echo "Database already exists"
    
    # Run initialization scripts
    echo "📋 Running initialization scripts..."
    
    # Run schema.sql
    echo "  - Creating schema..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/schema.sql
    
    # Run data files in order
    echo "  - Importing users..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/users.sql
    
    echo "  - Importing categories..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/categories.sql
    
    echo "  - Importing tags..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/tags.sql
    
    echo "  - Importing content..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/content.sql
    
    echo "  - Importing comments..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/comments.sql
    
    echo "  - Importing activity logs..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/activity_logs.sql
    
    echo "  - Importing analytics events..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/analytics_events.sql
    
    echo "  - Importing settings..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/settings.sql
    
    echo "  - Importing user likes..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/user_likes.sql
    
    echo "  - Importing user views..."
    sudo docker exec -i zeta-postgres psql -U user -d builder_orbit_lab < data-export/user_views.sql
    
    echo "✅ Database initialization completed!"
}

# Function to show database status
show_database_status() {
    echo ""
    echo "📊 Database Status:"
    echo "=================="
    
    # Show table count
    local table_count=$(sudo docker exec zeta-postgres psql -U user -d builder_orbit_lab -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    echo "📋 Tables: $table_count"
    
    # Show record counts for main tables
    echo ""
    echo "📈 Record Counts:"
    sudo docker exec zeta-postgres psql -U user -d builder_orbit_lab -c "
        SELECT 
            'users' as table_name, COUNT(*) as records FROM users
        UNION ALL
        SELECT 
            'categories' as table_name, COUNT(*) as records FROM categories
        UNION ALL
        SELECT 
            'content' as table_name, COUNT(*) as records FROM content
        UNION ALL
        SELECT 
            'comments' as table_name, COUNT(*) as records FROM comments
        ORDER BY table_name;
    " 2>/dev/null || echo "❌ Could not retrieve record counts"
    
    echo ""
    echo "🌐 Database Connection:"
    echo "  Host: localhost:5432"
    echo "  Database: builder_orbit_lab"
    echo "  User: user"
    echo "  Password: 120301"
}

# Main function
main() {
    echo "🚀 Starting Zeta CMS Database Initialization..."
    echo ""
    
    # Check if containers are running
    if ! check_containers; then
        echo "🔄 Starting containers..."
        if ! start_containers; then
            echo "❌ Failed to start containers"
            exit 1
        fi
    fi
    
    # Check if database is initialized
    if check_database; then
        echo "✅ Database is already initialized"
        show_database_status
    else
        echo "🔧 Database needs initialization"
        init_database_manual
        show_database_status
    fi
    
    echo ""
    echo "🎉 Database initialization process completed!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Start the backend: ./start-backend-only.sh"
    echo "  2. Access the application: http://localhost:8080"
    echo "  3. Check API: http://localhost:4000/api/health"
}

# Run main function
main
