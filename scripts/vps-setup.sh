#!/bin/bash

# VPS Setup Script for Zeta CMS
# This script automates VPS preparation and dependency installation

set -e

# Configuration
OS_TYPE=""
PACKAGE_MANAGER=""
DOCKER_VERSION=""
COMPOSE_VERSION=""

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

# Function to detect OS
detect_os() {
    log "Detecting operating system..."
    
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS_TYPE=$ID
        VERSION=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS_TYPE=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
        VERSION=$(lsb_release -sr)
    else
        error "Cannot detect operating system"
        exit 1
    fi
    
    log "Detected OS: $OS_TYPE $VERSION"
    
    # Set package manager
    case $OS_TYPE in
        ubuntu|debian)
            PACKAGE_MANAGER="apt"
            ;;
        centos|rhel|fedora)
            PACKAGE_MANAGER="yum"
            if command -v dnf >/dev/null 2>&1; then
                PACKAGE_MANAGER="dnf"
            fi
            ;;
        *)
            error "Unsupported operating system: $OS_TYPE"
            exit 1
            ;;
    esac
    
    log "Package manager: $PACKAGE_MANAGER"
}

# Function to update system
update_system() {
    log "Updating system packages..."
    
    case $PACKAGE_MANAGER in
        apt)
            apt update && apt upgrade -y
            ;;
        yum)
            yum update -y
            ;;
        dnf)
            dnf update -y
            ;;
    esac
    
    log "System update completed"
}

# Function to install basic tools
install_basic_tools() {
    log "Installing basic tools..."
    
    local packages="git curl wget unzip htop nano vim"
    
    case $PACKAGE_MANAGER in
        apt)
            apt install -y $packages
            ;;
        yum)
            yum install -y $packages
            ;;
        dnf)
            dnf install -y $packages
            ;;
    esac
    
    log "Basic tools installed"
}

# Function to install Docker
install_docker() {
    log "Installing Docker..."
    
    # Check if Docker is already installed
    if command -v docker >/dev/null 2>&1; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        log "Docker already installed: $DOCKER_VERSION"
        return 0
    fi
    
    # Install Docker using official script
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Add current user to docker group
    usermod -aG docker $USER
    
    # Get Docker version
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    log "Docker installed: $DOCKER_VERSION"
}

# Function to install Docker Compose
install_docker_compose() {
    log "Installing Docker Compose..."
    
    # Check if Docker Compose is already installed
    if command -v docker-compose >/dev/null 2>&1; then
        COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
        log "Docker Compose already installed: $COMPOSE_VERSION"
        return 0
    fi
    
    # Get latest version
    local latest_version=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d'"' -f4)
    
    # Download Docker Compose
    curl -L "https://github.com/docker/compose/releases/download/${latest_version}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Make executable
    chmod +x /usr/local/bin/docker-compose
    
    # Create symlink
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    # Get version
    COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
    log "Docker Compose installed: $COMPOSE_VERSION"
}

# Function to configure firewall
configure_firewall() {
    log "Configuring firewall..."
    
    case $OS_TYPE in
        ubuntu|debian)
            # Install UFW if not present
            if ! command -v ufw >/dev/null 2>&1; then
                apt install -y ufw
            fi
            
            # Configure UFW
            ufw --force reset
            ufw default deny incoming
            ufw default allow outgoing
            ufw allow 22/tcp
            ufw allow 80/tcp
            ufw allow 443/tcp
            ufw --force enable
            
            log "UFW firewall configured"
            ;;
        centos|rhel|fedora)
            # Install firewalld if not present
            if ! command -v firewall-cmd >/dev/null 2>&1; then
                case $PACKAGE_MANAGER in
                    yum) yum install -y firewalld ;;
                    dnf) dnf install -y firewalld ;;
                esac
            fi
            
            # Start and enable firewalld
            systemctl start firewalld
            systemctl enable firewalld
            
            # Configure firewall
            firewall-cmd --permanent --add-port=22/tcp
            firewall-cmd --permanent --add-port=80/tcp
            firewall-cmd --permanent --add-port=443/tcp
            firewall-cmd --reload
            
            log "Firewalld configured"
            ;;
    esac
}

# Function to optimize system
optimize_system() {
    log "Optimizing system settings..."
    
    # Increase file descriptor limits
    cat >> /etc/security/limits.conf << EOF
* soft nofile 65535
* hard nofile 65535
EOF
    
    # Optimize kernel parameters
    cat >> /etc/sysctl.conf << EOF
# Zeta CMS optimizations
vm.max_map_count=262144
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=65535
net.core.netdev_max_backlog=5000
EOF
    
    # Apply sysctl changes
    sysctl -p
    
    log "System optimization completed"
}

# Function to create swap file
create_swap() {
    local swap_size="${1:-1G}"
    
    log "Creating swap file ($swap_size)..."
    
    # Check if swap already exists
    if swapon --show | grep -q "/swapfile"; then
        log "Swap file already exists"
        return 0
    fi
    
    # Create swap file
    fallocate -l $swap_size /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # Add to fstab
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    
    log "Swap file created: $swap_size"
}

# Function to install monitoring tools
install_monitoring() {
    log "Installing monitoring tools..."
    
    local packages="htop iotop nethogs"
    
    case $PACKAGE_MANAGER in
        apt)
            apt install -y $packages
            ;;
        yum)
            yum install -y epel-release
            yum install -y $packages
            ;;
        dnf)
            dnf install -y epel-release
            dnf install -y $packages
            ;;
    esac
    
    log "Monitoring tools installed"
}

# Function to setup log rotation
setup_log_rotation() {
    log "Setting up log rotation..."
    
    cat > /etc/logrotate.d/zeta-cms << EOF
/var/log/zeta-cms/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 zeta zeta
}
EOF
    
    log "Log rotation configured"
}

# Function to create zeta user
create_zeta_user() {
    local username="${1:-zeta}"
    
    log "Creating zeta user..."
    
    if id "$username" &>/dev/null; then
        log "User $username already exists"
    else
        useradd -m -s /bin/bash "$username"
        usermod -aG docker "$username"
        usermod -aG sudo "$username"
        log "User $username created"
    fi
}

# Function to show system info
show_system_info() {
    log "System Information:"
    echo "=================="
    echo "OS: $OS_TYPE"
    echo "Docker: $DOCKER_VERSION"
    echo "Docker Compose: $COMPOSE_VERSION"
    echo "Memory: $(free -h | awk 'NR==2{print $2}')"
    echo "Disk: $(df -h / | awk 'NR==2{print $2}')"
    echo "CPU: $(nproc) cores"
    echo ""
}

# Function to show next steps
show_next_steps() {
    log "VPS Setup Completed! 🎉"
    echo ""
    echo "Next Steps:"
    echo "==========="
    echo "1. Setup Git SSH access:"
    echo "   ./scripts/setup-git-ssh.sh --username your-github-username --email your@email.com"
    echo ""
    echo "2. Clone Zeta CMS repository from dev branch:"
    echo "   git clone -b dev git@github.com:your-username/Zeta.git"
    echo "   cd Zeta"
    echo ""
    echo "3. Deploy application (development mode):"
    echo "   chmod +x scripts/*.sh"
    echo "   ./scripts/quick-deploy.sh"
    echo ""
    echo "4. Access application:"
    echo "   Frontend: http://your-vps-ip:8080"
    echo "   Backend: http://your-vps-ip:4000/api"
    echo ""
    echo "5. For production with domain:"
    echo "   ./scripts/quick-deploy.sh --production --domain yourdomain.com --email admin@yourdomain.com"
    echo ""
    echo "6. Check status:"
    echo "   ./scripts/monitor.sh status"
    echo ""
    echo "Useful Commands:"
    echo "==============="
    echo "  htop                    # System monitor"
    echo "  docker ps               # Docker containers"
    echo "  docker-compose logs     # Application logs"
    echo "  ufw status              # Firewall status (Ubuntu/Debian)"
    echo "  firewall-cmd --list-all # Firewall status (CentOS/RHEL)"
    echo ""
}

# Function to show help
show_help() {
    echo "VPS Setup Script for Zeta CMS"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --swap <size>           - Create swap file (default: 1G)"
    echo "  --user <username>       - Create user (default: zeta)"
    echo "  --no-firewall           - Skip firewall configuration"
    echo "  --no-optimization       - Skip system optimization"
    echo "  --help                  - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                      # Basic setup"
    echo "  $0 --swap 2G            # Setup with 2GB swap"
    echo "  $0 --user myuser        # Setup with custom user"
}

# Parse command line arguments
SWAP_SIZE="1G"
USERNAME="zeta"
CONFIGURE_FIREWALL=true
OPTIMIZE_SYSTEM=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --swap)
            SWAP_SIZE="$2"
            shift 2
            ;;
        --user)
            USERNAME="$2"
            shift 2
            ;;
        --no-firewall)
            CONFIGURE_FIREWALL=false
            shift
            ;;
        --no-optimization)
            OPTIMIZE_SYSTEM=false
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

# Main setup process
main() {
    log "Starting VPS setup for Zeta CMS..."
    
    detect_os
    update_system
    install_basic_tools
    install_docker
    install_docker_compose
    
    if [ "$CONFIGURE_FIREWALL" = true ]; then
        configure_firewall
    fi
    
    if [ "$OPTIMIZE_SYSTEM" = true ]; then
        optimize_system
    fi
    
    create_swap "$SWAP_SIZE"
    install_monitoring
    setup_log_rotation
    create_zeta_user "$USERNAME"
    show_system_info
    show_next_steps
}

# Run main function
main
