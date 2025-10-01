#!/bin/bash

# Git SSH Setup Script for Zeta CMS
# This script helps setup SSH keys for Git access

set -e

# Configuration
GITHUB_USERNAME=""
GITHUB_EMAIL=""
SSH_KEY_TYPE="ed25519"
SSH_KEY_PATH=""

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

# Function to check if SSH key exists
check_existing_ssh_key() {
    local key_type="$1"
    local key_path="$2"
    
    if [ -f "$key_path" ]; then
        log "SSH key already exists: $key_path"
        return 0
    else
        return 1
    fi
}

# Function to generate SSH key
generate_ssh_key() {
    local key_type="$1"
    local key_path="$2"
    local email="$3"
    
    log "Generating SSH key ($key_type)..."
    
    # Generate SSH key
    ssh-keygen -t "$key_type" -C "$email" -f "$key_path" -N ""
    
    log "SSH key generated: $key_path"
}

# Function to add SSH key to SSH agent
add_to_ssh_agent() {
    local key_path="$1"
    
    log "Adding SSH key to SSH agent..."
    
    # Start SSH agent
    eval "$(ssh-agent -s)"
    
    # Add key to SSH agent
    ssh-add "$key_path"
    
    log "SSH key added to agent"
}

# Function to display public key
display_public_key() {
    local key_path="$1"
    
    log "Your public SSH key:"
    echo ""
    echo "=========================================="
    cat "${key_path}.pub"
    echo "=========================================="
    echo ""
    
    info "Copy the above key and add it to your GitHub account:"
    echo "1. Go to https://github.com/settings/keys"
    echo "2. Click 'New SSH key'"
    echo "3. Paste the key above"
    echo "4. Give it a title (e.g., 'VPS Key')"
    echo "5. Click 'Add SSH key'"
    echo ""
}

# Function to test SSH connection
test_ssh_connection() {
    local max_attempts=5
    local attempt=1
    
    log "Testing SSH connection to GitHub..."
    
    while [ $attempt -le $max_attempts ]; do
        if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
            log "✅ SSH connection to GitHub successful!"
            return 0
        else
            warning "Attempt $attempt/$max_attempts failed. Retrying in 5 seconds..."
            sleep 5
            attempt=$((attempt + 1))
        fi
    done
    
    error "❌ SSH connection to GitHub failed after $max_attempts attempts"
    return 1
}

# Function to configure Git
configure_git() {
    local username="$1"
    local email="$2"
    
    log "Configuring Git..."
    
    # Configure Git user
    git config --global user.name "$username"
    git config --global user.email "$email"
    
    # Configure SSH for Git
    git config --global url."git@github.com:".insteadOf "https://github.com/"
    
    log "Git configured successfully"
}

# Function to clone repository
clone_repository() {
    local repo_url="$1"
    local branch="${2:-main}"
    
    log "Cloning repository from $repo_url (branch: $branch)..."
    
    if [ -d "Zeta" ]; then
        warning "Directory 'Zeta' already exists. Skipping clone."
        return 0
    fi
    
    # Clone repository
    git clone -b "$branch" "$repo_url" Zeta
    
    log "Repository cloned successfully"
}

# Function to setup SSH config
setup_ssh_config() {
    local key_path="$1"
    
    log "Setting up SSH config..."
    
    # Create .ssh directory if it doesn't exist
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    
    # Create SSH config
    cat > ~/.ssh/config << EOF
Host github.com
    HostName github.com
    User git
    IdentityFile $key_path
    IdentitiesOnly yes
EOF
    
    chmod 600 ~/.ssh/config
    
    log "SSH config created"
}

# Function to show help
show_help() {
    echo "Git SSH Setup Script for Zeta CMS"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --username <username>    - GitHub username"
    echo "  --email <email>          - GitHub email"
    echo "  --key-type <type>        - SSH key type (ed25519|rsa) (default: ed25519)"
    echo "  --key-path <path>        - SSH key path (default: ~/.ssh/id_ed25519)"
    echo "  --repo <url>             - Repository URL to clone"
    echo "  --branch <branch>        - Branch to clone (default: dev)"
    echo "  --help                   - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --username myuser --email my@email.com"
    echo "  $0 --username myuser --email my@email.com --repo git@github.com:user/Zeta.git --branch dev"
    echo "  $0 --username myuser --email my@email.com --key-type rsa"
}

# Function to interactive setup
interactive_setup() {
    echo "🔑 Git SSH Setup for Zeta CMS"
    echo "=============================="
    echo ""
    
    # Get GitHub username
    if [ -z "$GITHUB_USERNAME" ]; then
        read -p "Enter your GitHub username: " GITHUB_USERNAME
    fi
    
    # Get GitHub email
    if [ -z "$GITHUB_EMAIL" ]; then
        read -p "Enter your GitHub email: " GITHUB_EMAIL
    fi
    
    # Get repository URL
    read -p "Enter repository URL (or press Enter to skip): " REPO_URL
    
    # Get branch
    read -p "Enter branch to clone (default: dev): " BRANCH
    BRANCH=${BRANCH:-dev}
    
    echo ""
}

# Main setup function
main() {
    log "Starting Git SSH setup..."
    
    # Set default key path
    if [ -z "$SSH_KEY_PATH" ]; then
        SSH_KEY_PATH="$HOME/.ssh/id_$SSH_KEY_TYPE"
    fi
    
    # Check if SSH key already exists
    if check_existing_ssh_key "$SSH_KEY_TYPE" "$SSH_KEY_PATH"; then
        warning "SSH key already exists. Using existing key."
    else
        # Generate new SSH key
        generate_ssh_key "$SSH_KEY_TYPE" "$SSH_KEY_PATH" "$GITHUB_EMAIL"
    fi
    
    # Add to SSH agent
    add_to_ssh_agent "$SSH_KEY_PATH"
    
    # Setup SSH config
    setup_ssh_config "$SSH_KEY_PATH"
    
    # Display public key
    display_public_key "$SSH_KEY_PATH"
    
    # Wait for user to add key to GitHub
    read -p "Press Enter after adding the key to GitHub..."
    
    # Test SSH connection
    if test_ssh_connection; then
        # Configure Git
        configure_git "$GITHUB_USERNAME" "$GITHUB_EMAIL"
        
        # Clone repository if URL provided
        if [ -n "$REPO_URL" ]; then
            clone_repository "$REPO_URL" "$BRANCH"
        fi
        
        log "🎉 Git SSH setup completed successfully!"
        echo ""
        echo "Next steps:"
        echo "1. cd Zeta (if repository was cloned)"
        echo "2. chmod +x scripts/*.sh"
        echo "3. ./scripts/quick-deploy.sh"
    else
        error "Setup failed. Please check your SSH key configuration."
        exit 1
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --username)
            GITHUB_USERNAME="$2"
            shift 2
            ;;
        --email)
            GITHUB_EMAIL="$2"
            shift 2
            ;;
        --key-type)
            SSH_KEY_TYPE="$2"
            shift 2
            ;;
        --key-path)
            SSH_KEY_PATH="$2"
            shift 2
            ;;
        --repo)
            REPO_URL="$2"
            shift 2
            ;;
        --branch)
            BRANCH="$2"
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

# If no arguments provided, run interactive setup
if [ $# -eq 0 ]; then
    interactive_setup
fi

# Run main function
main
