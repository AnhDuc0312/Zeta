#!/bin/bash

# Quick Deploy Script for Zeta CMS
# This script provides a one-command deployment for VPS

set -e

# Configuration
PROJECT_NAME="zeta-cms"
DOMAIN=""
EMAIL=""
ENVIRONMENT="development"

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

# Function to show banner
show_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    Zeta CMS Quick Deploy                    ║"
    echo "║                                                              ║"
    echo "║  🚀 Full-stack React + Express + PostgreSQL CMS            ║"
    echo "║  🐳 Docker containerized with automatic backups            ║"
    echo "║  🔒 SSL ready with Let's Encrypt support                   ║"
    echo "║  📊 Monitoring with Prometheus & Grafana                   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Function to check system requirements
check_requirements() {
    log "Checking system requirements..."
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        warning "Running as root. Consider using a non-root user for security."
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        echo "Install Docker: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check available disk space (at least 2GB)
    AVAILABLE_SPACE=$(df / | awk 'NR==2 {print $4}')
    if [ "$AVAILABLE_SPACE" -lt 2097152 ]; then
        warning "Low disk space. At least 2GB recommended."
    fi
    
    # Check available memory (at least 1GB)
    AVAILABLE_MEMORY=$(free -m | awk 'NR==2{print $7}')
    if [ "$AVAILABLE_MEMORY" -lt 1024 ]; then
        warning "Low memory. At least 1GB RAM recommended."
    fi
    
    log "System requirements check completed"
}

# Function to setup environment
setup_environment() {
    log "Setting up environment..."
    
    # Create .env file if not exists
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            log "Creating .env file from example..."
            cp env.example .env
            
            # Generate random passwords
            JWT_SECRET=$(openssl rand -base64 32)
            POSTGRES_PASSWORD=$(openssl rand -base64 16)
            
            # Update .env file
            sed -i "s/your_super_secret_jwt_key_here_change_in_production/$JWT_SECRET/" .env
            sed -i "s/zeta_password_2024/$POSTGRES_PASSWORD/" .env
            
            log "Environment file created with secure passwords"
        else
            error ".env file not found and no example available"
            exit 1
        fi
    else
        log "Environment file already exists"
    fi
    
    # Create necessary directories
    mkdir -p backup logs nginx/ssl data-export monitoring
    
    log "Environment setup completed"
}

# Function to setup SSL certificates
setup_ssl() {
    if [ "$ENVIRONMENT" = "production" ] && [ -n "$DOMAIN" ]; then
        log "Setting up SSL certificates for production..."
        
        if [ -n "$EMAIL" ]; then
            # Use Let's Encrypt
            ./scripts/ssl-setup.sh letsencrypt "$DOMAIN" "$EMAIL"
        else
            warning "No email provided. Using self-signed certificates."
            ./scripts/ssl-setup.sh self-signed "$DOMAIN"
        fi
    else
        log "Setting up self-signed SSL certificates for development..."
        ./scripts/ssl-setup.sh self-signed "localhost"
    fi
}

# Function to deploy application
deploy_application() {
    log "Deploying Zeta CMS application..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Deploying in production mode..."
        docker-compose -f docker-compose.prod.yml up -d --build
    else
        log "Deploying in development mode..."
        docker-compose up -d --build
    fi
    
    log "Application deployment completed"
}

# Function to wait for services
wait_for_services() {
    log "Waiting for services to be ready..."
    
    # Wait for database
    info "Waiting for database..."
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose exec -T postgres pg_isready -U zeta_user -d zetadb > /dev/null 2>&1; then
            log "✅ Database is ready"
            break
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    if [ $attempt -eq $max_attempts ]; then
        error "Database failed to start within expected time"
        exit 1
    fi
    
    # Wait for backend
    info "Waiting for backend API..."
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s http://localhost:4000/api/health > /dev/null 2>&1; then
            log "✅ Backend API is ready"
            break
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    if [ $attempt -eq $max_attempts ]; then
        error "Backend API failed to start within expected time"
        exit 1
    fi
    
    # Wait for frontend
    info "Waiting for frontend..."
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s http://localhost:8080 > /dev/null 2>&1; then
            log "✅ Frontend is ready"
            break
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    if [ $attempt -eq $max_attempts ]; then
        error "Frontend failed to start within expected time"
        exit 1
    fi
    
    log "All services are ready!"
}

# Function to setup monitoring
setup_monitoring() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Setting up monitoring..."
        ./scripts/monitor.sh setup
        log "Monitoring setup completed"
    fi
}

# Function to setup backups
setup_backups() {
    log "Setting up automated backups..."
    
    # Setup backup cron job
    ./scripts/deploy.sh setup-cron
    
    # Create initial backup
    ./scripts/backup.sh backup
    
    log "Backup system setup completed"
}

# Function to show final information
show_final_info() {
    log "🎉 Zeta CMS deployment completed successfully!"
    echo ""
    
    info "Application URLs:"
    if [ "$ENVIRONMENT" = "production" ] && [ -n "$DOMAIN" ]; then
        echo "  🌐 Frontend: https://$DOMAIN"
        echo "  🔌 Backend API: https://$DOMAIN/api"
    else
        echo "  🌐 Frontend: http://localhost:8080"
        echo "  🔌 Backend API: http://localhost:4000/api"
    fi
    
    echo ""
    info "Management Commands:"
    echo "  📊 Check status: ./scripts/monitor.sh status"
    echo "  📝 View logs: ./scripts/monitor.sh logs"
    echo "  🔄 Restart: ./scripts/deploy.sh restart"
    echo "  💾 Backup: ./scripts/backup.sh backup"
    echo "  🛑 Stop: ./scripts/deploy.sh stop"
    
    echo ""
    info "Default Credentials:"
    echo "  📧 Email: admin@example.com"
    echo "  🔑 Password: admin123"
    echo "  ⚠️  Please change these in production!"
    
    echo ""
    info "Next Steps:"
    echo "  1. Access the application using the URLs above"
    echo "  2. Login with default credentials"
    echo "  3. Change default passwords"
    echo "  4. Configure your domain (if production)"
    echo "  5. Setup monitoring (if production)"
    
    echo ""
    log "Happy coding! 🚀"
}

# Function to show help
show_help() {
    echo "Zeta CMS Quick Deploy Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --domain <domain>     - Domain name for production (required for production)"
    echo "  --email <email>       - Email for Let's Encrypt SSL (optional)"
    echo "  --production          - Deploy in production mode"
    echo "  --help                - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Development deployment"
    echo "  $0 --production --domain example.com # Production deployment"
    echo "  $0 --production --domain example.com --email admin@example.com"
    echo ""
    echo "Environment Variables:"
    echo "  DOMAIN               - Domain name"
    echo "  EMAIL                - Email for SSL"
    echo "  ENVIRONMENT          - deployment|production"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --email)
            EMAIL="$2"
            shift 2
            ;;
        --production)
            ENVIRONMENT="production"
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

# Main deployment process
main() {
    show_banner
    
    # Validate production requirements
    if [ "$ENVIRONMENT" = "production" ] && [ -z "$DOMAIN" ]; then
        error "Domain is required for production deployment"
        echo "Use: $0 --production --domain yourdomain.com"
        exit 1
    fi
    
    check_requirements
    setup_environment
    setup_ssl
    deploy_application
    wait_for_services
    setup_monitoring
    setup_backups
    show_final_info
}

# Run main function
main
