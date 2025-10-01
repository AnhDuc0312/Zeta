# 🚀 Hướng dẫn Deploy Zeta CMS từ nhánh DEV

Tài liệu hướng dẫn triển khai Zeta CMS từ nhánh `dev` trên VPS mà không cần domain.

## 📋 Mục lục

1. [Chuẩn bị Git Access](#chuẩn-bị-git-access)
2. [Setup VPS](#setup-vps)
3. [Clone từ nhánh DEV](#clone-từ-nhánh-dev)
4. [Deploy Development](#deploy-development)
5. [Truy cập qua IP](#truy-cập-qua-ip)
6. [Setup Domain (Optional)](#setup-domain-optional)
7. [Management & Monitoring](#management--monitoring)

## 🔑 Chuẩn bị Git Access

### 1. Tạo SSH Key

```bash
# Tạo SSH key mới
ssh-keygen -t ed25519 -C "your-email@example.com"

# Hoặc sử dụng RSA (nếu ed25519 không được hỗ trợ)
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

### 2. Thêm SSH Key vào GitHub

```bash
# Copy public key
cat ~/.ssh/id_ed25519.pub
# hoặc
cat ~/.ssh/id_rsa.pub

# Copy toàn bộ output và thêm vào GitHub:
# 1. Vào GitHub.com → Settings → SSH and GPG keys
# 2. Click "New SSH key"
# 3. Paste key và save
```

### 3. Test SSH Connection

```bash
# Test kết nối GitHub
ssh -T git@github.com

# Nếu thành công sẽ thấy:
# Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### 4. Cấu hình Git (nếu cần)

```bash
# Cấu hình Git user
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Cấu hình SSH cho Git
git config --global url."git@github.com:".insteadOf "https://github.com/"
```

## 🖥️ Setup VPS

### 1. Kết nối VPS

```bash
# SSH vào VPS
ssh root@your-vps-ip

# Hoặc với user khác
ssh username@your-vps-ip
```

### 2. Auto Setup VPS

```bash
# Download và chạy script setup
curl -fsSL https://raw.githubusercontent.com/your-username/Zeta/dev/scripts/vps-setup.sh | bash

# Hoặc clone trước rồi chạy
git clone -b dev git@github.com:your-username/Zeta.git
cd Zeta
chmod +x scripts/*.sh
./scripts/vps-setup.sh
```

### 3. Manual Setup (nếu cần)

```bash
# Cập nhật hệ thống
apt update && apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Cài đặt Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Cài đặt tools
apt install -y git curl wget htop nano

# Cấu hình firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 8080/tcp
ufw allow 4000/tcp
ufw --force enable
```

## 📥 Clone từ nhánh DEV

### 1. Clone Repository

```bash
# Clone từ nhánh dev
git clone -b dev git@github.com:your-username/Zeta.git
cd Zeta

# Hoặc nếu đã clone, chuyển sang nhánh dev
git checkout dev
git pull origin dev
```

### 2. Cấu hình Environment

```bash
# Tạo file cấu hình
cp env.example .env

# Chỉnh sửa cấu hình cho development
nano .env
```

**Nội dung file `.env` cho development:**

```env
# Database Configuration
DATABASE_URL=postgresql://zeta_user:zeta_password_2024@localhost:5432/zetadb
POSTGRES_DB=zetadb
POSTGRES_USER=zeta_user
POSTGRES_PASSWORD=zeta_password_2024

# Server Configuration
NODE_ENV=development
PORT=4000
FRONTEND_PORT=8080

# JWT Configuration
JWT_SECRET=dev_jwt_secret_key_2024
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security (Development)
CORS_ORIGIN=http://your-vps-ip:8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Backup Configuration
BACKUP_RETENTION_DAYS=7
BACKUP_SCHEDULE=0 2 * * *

# SSL Configuration (Development - self-signed)
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem

# Monitoring
LOG_LEVEL=debug
ENABLE_METRICS=true
```

## 🚀 Deploy Development

### 1. Deploy nhanh

```bash
# Cấp quyền cho scripts
chmod +x scripts/*.sh

# Deploy development (không cần domain)
./scripts/quick-deploy.sh

# Hoặc deploy thủ công
docker-compose up -d --build
```

### 2. Setup SSL cho Development

```bash
# Tạo self-signed certificate
./scripts/ssl-setup.sh self-signed your-vps-ip

# Hoặc sử dụng localhost
./scripts/ssl-setup.sh self-signed localhost
```

### 3. Kiểm tra Deploy

```bash
# Kiểm tra trạng thái
./scripts/monitor.sh status

# Health check
./scripts/health-check.sh

# Xem logs
./scripts/monitor.sh logs
```

## 🌐 Truy cập qua IP

### 1. URLs sau khi deploy:

```bash
# Frontend (HTTP)
http://your-vps-ip:8080

# Backend API (HTTP)
http://your-vps-ip:4000/api

# Health Check
http://your-vps-ip:4000/api/health

# Database (Internal)
localhost:5432

# Redis (Internal)
localhost:6379
```

### 2. Test kết nối

```bash
# Test backend API
curl http://your-vps-ip:4000/api/health

# Test frontend
curl http://your-vps-ip:8080

# Test từ browser
# Mở: http://your-vps-ip:8080
```

### 3. Default Credentials

```
Email: admin@example.com
Password: admin123
```

**⚠️ Thay đổi ngay sau khi đăng nhập!**

## 🔧 Management Commands

### 1. Service Management

```bash
# Start services
./scripts/deploy.sh start

# Stop services
./scripts/deploy.sh stop

# Restart services
./scripts/deploy.sh restart

# Check status
./scripts/monitor.sh status
```

### 2. Development Commands

```bash
# Xem logs real-time
./scripts/monitor.sh logs

# Monitor resources
./scripts/monitor.sh monitor

# Health check
./scripts/health-check.sh

# Backup database
./scripts/backup.sh backup
```

### 3. Code Updates

```bash
# Pull latest changes từ dev branch
git pull origin dev

# Rebuild và restart
docker-compose down
docker-compose up -d --build

# Hoặc sử dụng update script
./scripts/update.sh
```

## 🌍 Setup Domain (Optional)

### 1. Nếu có domain

```bash
# Deploy production với domain
./scripts/quick-deploy.sh --production --domain yourdomain.com --email admin@yourdomain.com

# Setup SSL với Let's Encrypt
sudo ./scripts/ssl-setup.sh letsencrypt yourdomain.com admin@yourdomain.com
```

### 2. Cấu hình DNS

```
Type: A
Name: @
Value: your-vps-ip
TTL: 300

Type: A
Name: www
Value: your-vps-ip
TTL: 300
```

## 📊 Monitoring & Debugging

### 1. Health Checks

```bash
# Comprehensive health check
./scripts/health-check.sh

# Check specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### 2. Resource Monitoring

```bash
# System resources
htop
df -h
free -h

# Docker resources
docker stats
docker system df
```

### 3. Application Logs

```bash
# All services
./scripts/monitor.sh logs

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Database logs
docker-compose logs -f postgres
```

## 🚨 Troubleshooting

### 1. Git Issues

```bash
# Permission denied
ssh-add ~/.ssh/id_ed25519
# hoặc
ssh-add ~/.ssh/id_rsa

# Test SSH
ssh -T git@github.com

# Re-clone nếu cần
rm -rf Zeta
git clone -b dev git@github.com:your-username/Zeta.git
```

### 2. Port Issues

```bash
# Check ports
netstat -tulpn | grep :8080
netstat -tulpn | grep :4000

# Kill process nếu cần
sudo kill -9 [PID]
```

### 3. Docker Issues

```bash
# Clean up
docker system prune -a

# Rebuild
docker-compose down
docker-compose up -d --build --force-recreate
```

### 4. Database Issues

```bash
# Check database
docker-compose exec postgres psql -U zeta_user -d zetadb -c "SELECT 1;"

# Reset database
docker-compose down -v
docker-compose up -d
```

## 🔄 Development Workflow

### 1. Daily Development

```bash
# Pull latest changes
git pull origin dev

# Deploy changes
./scripts/update.sh

# Check status
./scripts/monitor.sh status
```

### 2. Code Changes

```bash
# Make changes locally
# Commit changes
git add .
git commit -m "Your changes"
git push origin dev

# On VPS, pull changes
git pull origin dev
./scripts/update.sh
```

### 3. Backup Strategy

```bash
# Daily backup
./scripts/backup.sh backup

# List backups
./scripts/backup.sh list

# Restore if needed
./scripts/backup.sh restore [backup-file]
```

## 📱 Mobile Access

### 1. Truy cập từ mobile

```
Frontend: http://your-vps-ip:8080
Backend: http://your-vps-ip:4000/api
```

### 2. Cấu hình CORS

Trong file `.env`, đảm bảo:
```env
CORS_ORIGIN=http://your-vps-ip:8080
```

## 🎯 Quick Reference

### One-liner Deploy từ DEV

```bash
# Setup VPS + Deploy từ dev branch
curl -fsSL https://raw.githubusercontent.com/your-username/Zeta/dev/scripts/vps-setup.sh | bash && \
git clone -b dev git@github.com:your-username/Zeta.git && \
cd Zeta && chmod +x scripts/*.sh && \
./scripts/quick-deploy.sh
```

### URLs sau khi deploy:

- **Frontend**: `http://your-vps-ip:8080`
- **Backend API**: `http://your-vps-ip:4000/api`
- **Health Check**: `http://your-vps-ip:4000/api/health`

### Management Commands:

```bash
# Status
./scripts/monitor.sh status

# Logs
./scripts/monitor.sh logs

# Health check
./scripts/health-check.sh

# Update
./scripts/update.sh

# Backup
./scripts/backup.sh backup
```

---

## 🎉 Hoàn thành!

Bây giờ bạn có thể:

1. ✅ **Deploy từ nhánh dev** mà không cần domain
2. ✅ **Truy cập qua IP** từ bất kỳ đâu
3. ✅ **Quản lý Git** với SSH keys
4. ✅ **Development workflow** hoàn chỉnh
5. ✅ **Monitoring & debugging** tools

**Next Steps:**
- Truy cập `http://your-vps-ip:8080`
- Đăng nhập với `admin@example.com` / `admin123`
- Thay đổi password
- Bắt đầu development!

**Need Help?** Xem logs với `./scripts/monitor.sh logs` 🚀
