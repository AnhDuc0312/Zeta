#!/bin/bash

# Auto Deploy Script for Zeta CMS
# This script automatically detects the environment and deploys accordingly

set -e

# Configuration
ENVIRONMENT=""
DOMAIN=""
EMAIL=""
VPS_IP=""
GITHUB_USERNAME=""
GITHUB_EMAIL=""

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

# Function to detect environment
detect_environment() {
    log "Detecting deployment environment..."
    
    # Check if running on VPS (not localhost)
    if [ -n "$SSH_CLIENT" ] || [ -n "$SSH_TTY" ]; then
        log "Detected: VPS environment"
        ENVIRONMENT="vps"
    else
        log "Detected: Local environment"
        ENVIRONMENT="local"
    fi
    
    # Check if domain is provided
    if [ -n "$DOMAIN" ]; then
        log "Domain provided: $DOMAIN"
        ENVIRONMENT="production"
    fi
    
    log "Environment: $ENVIRONMENT"
}

# Function to detect VPS IP
detect_vps_ip() {
    if [ "$ENVIRONMENT" = "vps" ] || [ "$ENVIRONMENT" = "production" ]; then
        log "Detecting VPS IP..."
        VPS_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || hostname -I | awk '{print $1}')
        log "VPS IP: $VPS_IP"
    fi
}

# Function to select environment file
select_env_file() {
    log "Selecting environment file..."
    
    case "$ENVIRONMENT" in
        "local")
            ENV_FILE="env.development"
            log "Using: $ENV_FILE (Local development)"
            ;;
        "vps")
            ENV_FILE="env.development"
            log "Using: $ENV_FILE (VPS development)"
            ;;
        "production")
            ENV_FILE="env.production"
            log "Using: $ENV_FILE (Production with domain)"
            ;;
        *)
            ENV_FILE="env.standard"
            log "Using: $ENV_FILE (Standard configuration)"
            ;;
    esac
}

# Function to setup environment file
setup_env_file() {
    log "Setting up environment file..."
    
    # Copy environment file
    cp "$ENV_FILE" .env
    log "Copied $ENV_FILE to .env"
    
    # Update environment-specific values
    case "$ENVIRONMENT" in
        "vps")
            # Update CORS and API URLs for VPS IP
            sed -i "s|CORS_ORIGIN=http://localhost:8080|CORS_ORIGIN=http://$VPS_IP:8080|g" .env
            sed -i "s|VITE_API_URL=http://localhost:4000/api|VITE_API_URL=http://$VPS_IP:4000/api|g" .env
            log "Updated CORS and API URLs for VPS IP: $VPS_IP"
            ;;
        "production")
            # Update for production domain
            sed -i "s|CORS_ORIGIN=https://yourdomain.com|CORS_ORIGIN=https://$DOMAIN|g" .env
            sed -i "s|VITE_API_URL=https://yourdomain.com/api|VITE_API_URL=https://$DOMAIN/api|g" .env
            log "Updated CORS and API URLs for domain: $DOMAIN"
            ;;
    esac
}

# Function to setup Git SSH
setup_git_ssh() {
    if [ "$ENVIRONMENT" = "vps" ] || [ "$ENVIRONMENT" = "production" ]; then
        log "Setting up Git SSH access..."
        
        if [ -n "$GITHUB_USERNAME" ] && [ -n "$GITHUB_EMAIL" ]; then
            ./scripts/setup-git-ssh.sh --username "$GITHUB_USERNAME" --email "$GITHUB_EMAIL"
        else
            warning "GitHub username/email not provided. Skipping Git SSH setup."
            warning "You may need to setup Git SSH manually later."
        fi
    fi
}

# Function to clone repository
clone_repository() {
    if [ ! -d "Zeta" ]; then
        log "Cloning repository..."
        
        if [ "$ENVIRONMENT" = "production" ]; then
            git clone -b main git@github.com:$GITHUB_USERNAME/Zeta.git
        else
            git clone -b dev git@github.com:$GITHUB_USERNAME/Zeta.git
        fi
        
        cd Zeta
        log "Repository cloned successfully"
    else
        log "Repository already exists. Updating..."
        cd Zeta
        git pull origin $(git branch --show-current)
    fi
}

# Function to deploy application
deploy_application() {
    log "Deploying application..."
    
    # Make scripts executable
    chmod +x scripts/*.sh
    
    case "$ENVIRONMENT" in
        "local")
            log "Deploying for local development..."
            ./scripts/quick-deploy.sh
            ;;
        "vps")
            log "Deploying for VPS development..."
            ./scripts/quick-deploy.sh
            ;;
        "production")
            log "Deploying for production..."
            if [ -n "$EMAIL" ]; then
                ./scripts/quick-deploy.sh --production --domain "$DOMAIN" --email "$EMAIL"
            else
                ./scripts/quick-deploy.sh --production --domain "$DOMAIN"
            fi
            ;;
    esac
}

# Function to show deployment info
show_deployment_info() {
    log "Deployment completed successfully! 🎉"
    echo ""
    
    info "Deployment Information:"
    echo "======================"
    echo "Environment: $ENVIRONMENT"
    echo "Environment File: $ENV_FILE"
    echo "VPS IP: $VPS_IP"
    echo "Domain: $DOMAIN"
    echo ""
    
    info "Application URLs:"
    echo "================"
    case "$ENVIRONMENT" in
        "local")
            echo "Frontend: http://localhost:8080"
            echo "Backend: http://localhost:4000/api"
            ;;
        "vps")
            echo "Frontend: http://$VPS_IP:8080"
            echo "Backend: http://$VPS_IP:4000/api"
            ;;
        "production")
            echo "Frontend: https://$DOMAIN"
            echo "Backend: https://$DOMAIN/api"
            ;;
    esac
    echo ""
    
    info "Management Commands:"
    echo "==================="
    echo "Check status: ./scripts/monitor.sh status"
    echo "View logs: ./scripts/monitor.sh logs"
    echo "Health check: ./scripts/health-check.sh"
    echo "Update: ./scripts/update.sh"
    echo "Backup: ./scripts/backup.sh backup"
    echo ""
    
    info "Default Credentials:"
    echo "==================="
    echo "Email: admin@example.com"
    echo "Password: admin123"
    echo "⚠️  Please change these in production!"
    echo ""
}

# Function to show help
show_help() {
    echo "Auto Deploy Script for Zeta CMS"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --github-username <username>  - GitHub username"
    echo "  --github-email <email>        - GitHub email"
    echo "  --domain <domain>             - Domain name (for production)"
    echo "  --email <email>               - Email for SSL (for production)"
    echo "  --environment <env>           - Force environment (local|vps|production)"
    echo "  --help                        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --github-username myuser --github-email my@email.com"
    echo "  $0 --github-username myuser --github-email my@email.com --domain example.com --email admin@example.com"
    echo "  $0 --environment production --domain example.com"
    echo ""
    echo "Auto Detection:"
    echo "  - Local machine: Uses env.development"
    echo "  - VPS without domain: Uses env.development + updates CORS"
    echo "  - VPS with domain: Uses env.production + updates domain"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --github-username)
            GITHUB_USERNAME="$2"
            shift 2
            ;;
        --github-email)
            GITHUB_EMAIL="$2"
            shift 2
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --email)
            EMAIL="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
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
    log "Starting Zeta CMS Auto Deploy..."
    echo ""
    
    # Detect environment
    detect_environment
    
    # Detect VPS IP if needed
    detect_vps_ip
    
    # Select environment file
    select_env_file
    
    # Setup environment file
    setup_env_file
    
    # Setup Git SSH if needed
    setup_git_ssh
    
    # Clone repository
    clone_repository
    
    # Deploy application
    deploy_application
    
    # Show deployment info
    show_deployment_info
}

# Run main function
main
