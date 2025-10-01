#!/bin/bash

# Zeta CMS Deployment Script for VPS
# This script deploys the Zeta CMS application using Docker

set -e

# Configuration
PROJECT_NAME="zeta-cms"
COMPOSE_FILE="docker-compose.yml"
BACKUP_BEFORE_DEPLOY=true

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

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        warning ".env file not found. Creating from example..."
        if [ -f "env.example" ]; then
            cp env.example .env
            warning "Please edit .env file with your configuration before running again."
            exit 1
        else
            error ".env file not found and no example available."
            exit 1
        fi
    fi
    
    log "Prerequisites check passed"
}

# Function to create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p backup
    mkdir -p logs
    mkdir -p nginx/ssl
    mkdir -p data-export
    
    # Set proper permissions
    chmod 755 backup logs nginx/ssl data-export
    
    log "Directories created successfully"
}

# Function to generate SSL certificates (self-signed for development)
generate_ssl_certificates() {
    log "Generating SSL certificates..."
    
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        info "Creating self-signed SSL certificates..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/key.pem \
            -out nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        
        chmod 600 nginx/ssl/key.pem
        chmod 644 nginx/ssl/cert.pem
        
        warning "Self-signed certificates created. For production, use proper SSL certificates."
    else
        log "SSL certificates already exist"
    fi
}

# Function to backup before deployment
backup_before_deploy() {
    if [ "$BACKUP_BEFORE_DEPLOY" = true ]; then
        log "Creating backup before deployment..."
        
        # Check if containers are running
        if docker-compose ps | grep -q "Up"; then
            info "Creating database backup..."
            docker-compose exec -T postgres pg_dump -U zeta_user zetadb > "backup/pre_deploy_$(date +%Y%m%d_%H%M%S).sql"
            log "Backup created successfully"
        else
            warning "No running containers found, skipping backup"
        fi
    fi
}

# Function to pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    docker-compose pull
    log "Images pulled successfully"
}

# Function to build images
build_images() {
    log "Building Docker images..."
    docker-compose build --no-cache
    log "Images built successfully"
}

# Function to start services
start_services() {
    log "Starting services..."
    
    # Stop existing containers
    docker-compose down
    
    # Start services
    docker-compose up -d
    
    log "Services started successfully"
}

# Function to wait for services to be ready
wait_for_services() {
    log "Waiting for services to be ready..."
    
    # Wait for database
    info "Waiting for database..."
    until docker-compose exec -T postgres pg_isready -U zeta_user -d zetadb; do
        sleep 2
    done
    log "Database is ready"
    
    # Wait for backend
    info "Waiting for backend API..."
    until curl -f http://localhost:4000/api/health > /dev/null 2>&1; do
        sleep 2
    done
    log "Backend API is ready"
    
    # Wait for frontend
    info "Waiting for frontend..."
    until curl -f http://localhost:8080 > /dev/null 2>&1; do
        sleep 2
    done
    log "Frontend is ready"
}

# Function to show service status
show_status() {
    log "Service status:"
    docker-compose ps
    
    echo ""
    log "Application URLs:"
    echo "  Frontend: https://localhost (or your domain)"
    echo "  Backend API: http://localhost:4000/api"
    echo "  Database: localhost:5432"
    echo "  Redis: localhost:6379"
    
    echo ""
    log "Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart services: docker-compose restart"
    echo "  Backup database: ./scripts/backup.sh"
    echo "  View backup list: ./scripts/backup.sh list"
}

# Function to setup cron job for backups
setup_backup_cron() {
    log "Setting up automated backup cron job..."
    
    # Create backup script in system path
    sudo cp scripts/backup.sh /usr/local/bin/zeta-backup
    sudo chmod +x /usr/local/bin/zeta-backup
    
    # Add cron job for daily backups at 2 AM
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/zeta-backup backup >> /var/log/zeta-backup.log 2>&1") | crontab -
    
    log "Backup cron job setup completed"
}

# Function to show logs
show_logs() {
    log "Showing recent logs..."
    docker-compose logs --tail=50
}

# Main deployment function
deploy() {
    log "Starting Zeta CMS deployment..."
    
    check_prerequisites
    create_directories
    generate_ssl_certificates
    backup_before_deploy
    pull_images
    build_images
    start_services
    wait_for_services
    show_status
    
    log "Deployment completed successfully! 🎉"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "start")
        start_services
        wait_for_services
        show_status
        ;;
    "stop")
        log "Stopping services..."
        docker-compose down
        log "Services stopped"
        ;;
    "restart")
        log "Restarting services..."
        docker-compose restart
        wait_for_services
        show_status
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "backup")
        ./scripts/backup.sh backup
        ;;
    "setup-cron")
        setup_backup_cron
        ;;
    "update")
        log "Updating application..."
        git pull
        deploy
        ;;
    *)
        echo "Usage: $0 {deploy|start|stop|restart|status|logs|backup|setup-cron|update}"
        echo ""
        echo "Commands:"
        echo "  deploy      - Full deployment (default)"
        echo "  start       - Start existing services"
        echo "  stop        - Stop all services"
        echo "  restart     - Restart all services"
        echo "  status      - Show service status"
        echo "  logs        - Show recent logs"
        echo "  backup      - Create database backup"
        echo "  setup-cron  - Setup automated backups"
        echo "  update      - Update and redeploy"
        exit 1
        ;;
esac
