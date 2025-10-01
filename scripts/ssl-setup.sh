#!/bin/bash

# SSL Certificate Setup Script for Zeta CMS
# This script helps set up SSL certificates for production deployment

set -e

# Configuration
DOMAIN=""
EMAIL=""
SSL_DIR="./nginx/ssl"
CERTBOT_DIR="/var/www/certbot"

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
    
    # Check if running as root for certbot
    if [ "$EUID" -ne 0 ] && [ "$1" = "letsencrypt" ]; then
        error "Please run as root for Let's Encrypt setup"
        exit 1
    fi
    
    # Check if domain is provided
    if [ -z "$DOMAIN" ]; then
        error "Domain is required. Use: $0 letsencrypt <domain> <email>"
        exit 1
    fi
    
    # Check if email is provided for Let's Encrypt
    if [ -z "$EMAIL" ] && [ "$1" = "letsencrypt" ]; then
        error "Email is required for Let's Encrypt. Use: $0 letsencrypt <domain> <email>"
        exit 1
    fi
    
    log "Prerequisites check passed"
}

# Function to create self-signed certificates
create_self_signed() {
    log "Creating self-signed SSL certificates..."
    
    # Create SSL directory
    mkdir -p "$SSL_DIR"
    
    # Generate private key
    openssl genrsa -out "$SSL_DIR/key.pem" 2048
    
    # Generate certificate
    openssl req -new -x509 -key "$SSL_DIR/key.pem" -out "$SSL_DIR/cert.pem" -days 365 \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN"
    
    # Set permissions
    chmod 600 "$SSL_DIR/key.pem"
    chmod 644 "$SSL_DIR/cert.pem"
    
    log "Self-signed certificates created successfully"
    warning "These are self-signed certificates. For production, use Let's Encrypt certificates."
}

# Function to setup Let's Encrypt certificates
setup_letsencrypt() {
    log "Setting up Let's Encrypt SSL certificates for domain: $DOMAIN"
    
    # Install certbot if not installed
    if ! command -v certbot &> /dev/null; then
        log "Installing certbot..."
        apt update
        apt install -y certbot
    fi
    
    # Create certbot directory
    mkdir -p "$CERTBOT_DIR"
    
    # Create temporary nginx config for ACME challenge
    cat > /tmp/nginx-acme.conf << EOF
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name $DOMAIN;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 200 'ACME Challenge Server';
            add_header Content-Type text/plain;
        }
    }
}
EOF
    
    # Start temporary nginx for ACME challenge
    log "Starting temporary nginx for ACME challenge..."
    docker run -d --name nginx-acme \
        -p 80:80 \
        -v /tmp/nginx-acme.conf:/etc/nginx/nginx.conf:ro \
        -v "$CERTBOT_DIR:/var/www/certbot" \
        nginx:alpine
    
    # Wait for nginx to start
    sleep 5
    
    # Request certificate
    log "Requesting SSL certificate from Let's Encrypt..."
    certbot certonly \
        --webroot \
        --webroot-path="$CERTBOT_DIR" \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --domains "$DOMAIN"
    
    # Stop temporary nginx
    docker stop nginx-acme
    docker rm nginx-acme
    
    # Copy certificates to project directory
    log "Copying certificates to project directory..."
    mkdir -p "$SSL_DIR"
    cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$SSL_DIR/cert.pem"
    cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$SSL_DIR/key.pem"
    
    # Set permissions
    chmod 644 "$SSL_DIR/cert.pem"
    chmod 600 "$SSL_DIR/key.pem"
    
    log "Let's Encrypt certificates setup completed successfully"
}

# Function to setup certificate renewal
setup_renewal() {
    log "Setting up certificate renewal..."
    
    # Create renewal script
    cat > /usr/local/bin/zeta-ssl-renew << 'EOF'
#!/bin/bash
# Zeta CMS SSL Certificate Renewal Script

set -e

DOMAIN="$1"
SSL_DIR="/path/to/your/project/nginx/ssl"

if [ -z "$DOMAIN" ]; then
    echo "Usage: $0 <domain>"
    exit 1
fi

# Renew certificate
certbot renew --cert-name "$DOMAIN" --quiet

# Copy renewed certificates
cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$SSL_DIR/cert.pem"
cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$SSL_DIR/key.pem"

# Reload nginx
docker-compose restart nginx

echo "SSL certificate renewed successfully"
EOF
    
    # Make script executable
    chmod +x /usr/local/bin/zeta-ssl-renew
    
    # Add cron job for renewal (runs twice daily)
    (crontab -l 2>/dev/null; echo "0 12,0 * * * /usr/local/bin/zeta-ssl-renew $DOMAIN >> /var/log/zeta-ssl-renew.log 2>&1") | crontab -
    
    log "Certificate renewal setup completed"
}

# Function to verify certificates
verify_certificates() {
    log "Verifying SSL certificates..."
    
    if [ ! -f "$SSL_DIR/cert.pem" ] || [ ! -f "$SSL_DIR/key.pem" ]; then
        error "SSL certificates not found in $SSL_DIR"
        exit 1
    fi
    
    # Check certificate validity
    if openssl x509 -in "$SSL_DIR/cert.pem" -text -noout > /dev/null 2>&1; then
        log "Certificate is valid"
        
        # Show certificate details
        info "Certificate details:"
        openssl x509 -in "$SSL_DIR/cert.pem" -text -noout | grep -E "(Subject:|Not Before:|Not After:|DNS:)"
    else
        error "Certificate is invalid"
        exit 1
    fi
    
    # Check private key
    if openssl rsa -in "$SSL_DIR/key.pem" -check -noout > /dev/null 2>&1; then
        log "Private key is valid"
    else
        error "Private key is invalid"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Zeta CMS SSL Certificate Setup Script"
    echo ""
    echo "Usage: $0 {self-signed|letsencrypt|verify|renew} [options]"
    echo ""
    echo "Commands:"
    echo "  self-signed <domain>           - Create self-signed certificates"
    echo "  letsencrypt <domain> <email>   - Setup Let's Encrypt certificates"
    echo "  verify                         - Verify existing certificates"
    echo "  renew <domain>                 - Renew Let's Encrypt certificates"
    echo "  setup-renewal <domain>         - Setup automatic renewal"
    echo ""
    echo "Examples:"
    echo "  $0 self-signed localhost"
    echo "  $0 letsencrypt example.com admin@example.com"
    echo "  $0 verify"
    echo "  $0 renew example.com"
    echo "  $0 setup-renewal example.com"
}

# Main script logic
case "${1:-help}" in
    "self-signed")
        DOMAIN="$2"
        check_prerequisites
        create_self_signed
        verify_certificates
        ;;
    "letsencrypt")
        DOMAIN="$2"
        EMAIL="$3"
        check_prerequisites "letsencrypt"
        setup_letsencrypt
        verify_certificates
        setup_renewal
        ;;
    "verify")
        verify_certificates
        ;;
    "renew")
        DOMAIN="$2"
        if [ -z "$DOMAIN" ]; then
            error "Domain is required for renewal"
            exit 1
        fi
        /usr/local/bin/zeta-ssl-renew "$DOMAIN"
        ;;
    "setup-renewal")
        DOMAIN="$2"
        if [ -z "$DOMAIN" ]; then
            error "Domain is required for renewal setup"
            exit 1
        fi
        setup_renewal
        ;;
    "help"|*)
        show_help
        ;;
esac

log "SSL setup completed successfully"
