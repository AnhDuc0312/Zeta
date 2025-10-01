#!/bin/bash

# Zeta CMS Update Script
# This script updates the Zeta CMS application with zero downtime

set -e

# Configuration
BACKUP_BEFORE_UPDATE=true
ROLLBACK_ON_FAILURE=true

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Function to check if services are running
check_services_running() {
    if ! docker-compose ps | grep -q "Up"; then
        error "No services are running. Please start the application first."
        exit 1
    fi
}

# Function to create backup before update
create_backup() {
    if [ "$BACKUP_BEFORE_UPDATE" = true ]; then
        log "Creating backup before update..."
        ./scripts/backup.sh backup
        log "Backup created successfully"
    fi
}

# Function to pull latest changes
pull_changes() {
    log "Pulling latest changes from repository..."
    
    # Check if we're in a git repository
    if [ ! -d ".git" ]; then
        warning "Not a git repository. Skipping git pull."
        return
    fi
    
    # Stash any local changes
    if ! git diff --quiet; then
        warning "Local changes detected. Stashing changes..."
        git stash push -m "Auto-stash before update $(date)"
    fi
    
    # Pull latest changes
    git pull origin main || git pull origin master
    
    log "Repository updated successfully"
}

# Function to update Docker images
update_images() {
    log "Updating Docker images..."
    
    # Pull latest images
    docker-compose pull
    
    # Build new images
    docker-compose build --no-cache
    
    log "Docker images updated successfully"
}

# Function to perform rolling update
rolling_update() {
    log "Performing rolling update..."
    
    # Update backend first
    info "Updating backend service..."
    docker-compose up -d --no-deps backend
    
    # Wait for backend to be healthy
    info "Waiting for backend to be healthy..."
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s http://localhost:4000/api/health > /dev/null 2>&1; then
            log "✅ Backend is healthy"
            break
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    if [ $attempt -eq $max_attempts ]; then
        error "Backend failed to become healthy after update"
        if [ "$ROLLBACK_ON_FAILURE" = true ]; then
            rollback_update
        fi
        exit 1
    fi
    
    # Update frontend
    info "Updating frontend service..."
    docker-compose up -d --no-deps frontend
    
    # Wait for frontend to be healthy
    info "Waiting for frontend to be healthy..."
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s http://localhost:8080 > /dev/null 2>&1; then
            log "✅ Frontend is healthy"
            break
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    if [ $attempt -eq $max_attempts ]; then
        error "Frontend failed to become healthy after update"
        if [ "$ROLLBACK_ON_FAILURE" = true ]; then
            rollback_update
        fi
        exit 1
    fi
    
    # Update nginx (if needed)
    info "Updating nginx service..."
    docker-compose up -d --no-deps nginx
    
    log "Rolling update completed successfully"
}

# Function to rollback update
rollback_update() {
    log "Rolling back update..."
    
    # Stop current services
    docker-compose down
    
    # Restore from backup
    if [ -f "backup/latest_backup.sql" ]; then
        log "Restoring from backup..."
        docker-compose up -d postgres
        
        # Wait for database
        sleep 10
        
        # Restore database
        docker-compose exec -T postgres psql -U zeta_user -d zetadb < backup/latest_backup.sql
        
        # Start all services
        docker-compose up -d
        
        log "Rollback completed"
    else
        error "No backup found for rollback"
        exit 1
    fi
}

# Function to clean up old images
cleanup_images() {
    log "Cleaning up old Docker images..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    log "Cleanup completed"
}

# Function to verify update
verify_update() {
    log "Verifying update..."
    
    # Check all services
    ./scripts/monitor.sh health
    
    # Check application functionality
    info "Testing application functionality..."
    
    # Test backend API
    if curl -f -s http://localhost:4000/api/health | grep -q "ok"; then
        log "✅ Backend API is working"
    else
        error "❌ Backend API is not working"
        return 1
    fi
    
    # Test frontend
    if curl -f -s http://localhost:8080 | grep -q "ZetaScript"; then
        log "✅ Frontend is working"
    else
        error "❌ Frontend is not working"
        return 1
    fi
    
    log "Update verification completed successfully"
}

# Function to show update summary
show_summary() {
    log "Update Summary:"
    echo ""
    
    info "Services Status:"
    docker-compose ps
    echo ""
    
    info "Application URLs:"
    echo "  🌐 Frontend: http://localhost:8080"
    echo "  🔌 Backend API: http://localhost:4000/api"
    echo ""
    
    info "Recent Changes:"
    if [ -d ".git" ]; then
        git log --oneline -5
    fi
    echo ""
    
    log "Update completed successfully! 🎉"
}

# Function to show help
show_help() {
    echo "Zeta CMS Update Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --no-backup           - Skip backup before update"
    echo "  --no-rollback         - Skip rollback on failure"
    echo "  --force               - Force update without checks"
    echo "  --help                - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Normal update with backup and rollback"
    echo "  $0 --no-backup        # Update without backup"
    echo "  $0 --force            # Force update"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-backup)
            BACKUP_BEFORE_UPDATE=false
            shift
            ;;
        --no-rollback)
            ROLLBACK_ON_FAILURE=false
            shift
            ;;
        --force)
            BACKUP_BEFORE_UPDATE=false
            ROLLBACK_ON_FAILURE=false
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main update process
main() {
    log "Starting Zeta CMS update process..."
    
    check_services_running
    create_backup
    pull_changes
    update_images
    rolling_update
    cleanup_images
    verify_update
    show_summary
}

# Run main function
main
