#!/bin/bash

echo "🔧 Setting up Docker permissions..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root"
    echo "Run: ./setup-docker-permissions.sh"
    exit 1
fi

# Check if user is already in docker group
if groups $USER | grep -q '\bdocker\b'; then
    echo "✅ User $USER is already in docker group"
    echo "You can now run: ./start-without-sudo.sh"
    exit 0
fi

echo "📋 Adding user $USER to docker group..."
echo "This requires sudo privileges"

# Add user to docker group
sudo usermod -aG docker $USER

echo ""
echo "✅ User $USER has been added to docker group"
echo ""
echo "⚠️  IMPORTANT: You need to logout and login again for changes to take effect"
echo ""
echo "After logging out and back in, you can run:"
echo "   ./start-without-sudo.sh"
echo ""
echo "Or continue using sudo for now:"
echo "   sudo ./start-backend-only.sh"
