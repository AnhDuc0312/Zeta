# 🚀 Hướng dẫn Deploy Zeta CMS trên VPS

Tài liệu chi tiết hướng dẫn triển khai Zeta CMS trên VPS với Docker, bao gồm cài đặt, cấu hình và quản lý.

## 📋 Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Chuẩn bị VPS](#chuẩn-bị-vps)
3. [Cài đặt Dependencies](#cài-đặt-dependencies)
4. [Deploy Application](#deploy-application)
5. [Cấu hình Domain & SSL](#cấu-hình-domain--ssl)
6. [Quản lý & Monitoring](#quản-lý--monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

## 🖥️ Yêu cầu hệ thống

### Tối thiểu:
- **CPU**: 1 core
- **RAM**: 1GB
- **Storage**: 10GB SSD
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### Khuyến nghị:
- **CPU**: 2+ cores
- **RAM**: 2GB+
- **Storage**: 20GB+ SSD
- **Bandwidth**: 1TB/month

## 🔧 Chuẩn bị VPS

### 1. Kết nối VPS

```bash
# SSH vào VPS
ssh root@your-vps-ip

# Hoặc với user khác
ssh username@your-vps-ip
```

### 2. Cập nhật hệ thống

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
# hoặc
sudo dnf update -y
```

### 3. Tạo user mới (khuyến nghị)

```bash
# Tạo user mới
sudo adduser zeta
sudo usermod -aG sudo zeta

# Chuyển sang user mới
su - zeta
```

## 📦 Cài đặt Dependencies

### 1. Cài đặt Docker

```bash
# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào group docker
sudo usermod -aG docker $USER

# Khởi động Docker
sudo systemctl start docker
sudo systemctl enable docker

# Kiểm tra cài đặt
docker --version
```

### 2. Cài đặt Docker Compose

```bash
# Tải Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Cấp quyền thực thi
sudo chmod +x /usr/local/bin/docker-compose

# Tạo symlink
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Kiểm tra cài đặt
docker-compose --version
```

### 3. Cài đặt các tools cần thiết

```bash
# Ubuntu/Debian
sudo apt install -y git curl wget unzip htop nano vim

# CentOS/RHEL
sudo yum install -y git curl wget unzip htop nano vim
# hoặc
sudo dnf install -y git curl wget unzip htop nano vim
```

### 4. Cài đặt Git (nếu chưa có)

```bash
# Ubuntu/Debian
sudo apt install -y git

# CentOS/RHEL
sudo yum install -y git
# hoặc
sudo dnf install -y git
```

## 🚀 Deploy Application

### 1. Clone Repository

```bash
# Clone project
git clone https://github.com/your-username/Zeta.git
cd Zeta

# Hoặc upload file zip và giải nén
# wget https://github.com/your-username/Zeta/archive/main.zip
# unzip main.zip
# cd Zeta-main
```

### 2. Cấu hình Environment

```bash
# Tạo file cấu hình
cp env.example .env

# Chỉnh sửa cấu hình
nano .env
```

**Nội dung file `.env`:**

```env
# Database Configuration
DATABASE_URL=postgresql://zeta_user:your_secure_password@localhost:5432/zetadb
POSTGRES_DB=zetadb
POSTGRES_USER=zeta_user
POSTGRES_PASSWORD=your_secure_password_here

# Server Configuration
NODE_ENV=production
PORT=4000
FRONTEND_PORT=8080

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Backup Configuration
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE=0 2 * * *

# SSL Configuration
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
```

### 3. Cấp quyền thực thi

```bash
# Cấp quyền cho scripts
chmod +x scripts/*.sh
```

### 4. Deploy nhanh (Khuyến nghị)

```bash
# Deploy development
./scripts/quick-deploy.sh

# Deploy production với domain
./scripts/quick-deploy.sh --production --domain yourdomain.com --email admin@yourdomain.com
```

### 5. Deploy thủ công

```bash
# Tạo thư mục cần thiết
mkdir -p backup logs nginx/ssl data-export monitoring

# Deploy services
docker-compose up -d --build

# Kiểm tra trạng thái
docker-compose ps
```

## 🌐 Cấu hình Domain & SSL

### 1. Cấu hình DNS

Trong DNS provider của bạn, thêm A record:

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

### 2. Cấu hình Firewall

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### 3. Setup SSL Certificate

#### Option A: Let's Encrypt (Khuyến nghị)

```bash
# Cài đặt Certbot
sudo apt install -y certbot  # Ubuntu/Debian
# hoặc
sudo yum install -y certbot  # CentOS/RHEL

# Tạo SSL certificate
sudo ./scripts/ssl-setup.sh letsencrypt yourdomain.com admin@yourdomain.com
```

#### Option B: Self-signed (Development)

```bash
# Tạo self-signed certificate
./scripts/ssl-setup.sh self-signed yourdomain.com
```

### 4. Cấu hình Nginx cho Production

```bash
# Sử dụng production config
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Quản lý & Monitoring

### 1. Kiểm tra trạng thái

```bash
# Trạng thái services
./scripts/monitor.sh status

# Health check
./scripts/health-check.sh

# Logs
./scripts/monitor.sh logs
```

### 2. Quản lý Services

```bash
# Start services
./scripts/deploy.sh start

# Stop services
./scripts/deploy.sh stop

# Restart services
./scripts/deploy.sh restart

# Update application
./scripts/update.sh
```

### 3. Backup & Restore

```bash
# Tạo backup
./scripts/backup.sh backup

# Xem danh sách backup
./scripts/backup.sh list

# Restore từ backup
./scripts/backup.sh restore /backup/zetadb_20241201_120000.sql.gz
```

### 4. Monitoring Setup

```bash
# Setup monitoring
./scripts/monitor.sh setup

# Real-time monitoring
./scripts/monitor.sh monitor
```

## 🔧 Troubleshooting

### 1. Services không start

```bash
# Xem logs chi tiết
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild service
docker-compose up -d --build [service-name]
```

### 2. Database connection issues

```bash
# Kiểm tra database
docker-compose exec postgres psql -U zeta_user -d zetadb -c "SELECT 1;"

# Reset database
docker-compose down -v
docker-compose up -d
```

### 3. Port conflicts

```bash
# Kiểm tra port đang sử dụng
sudo netstat -tulpn | grep :4000
sudo netstat -tulpn | grep :8080

# Kill process sử dụng port
sudo kill -9 [PID]
```

### 4. SSL issues

```bash
# Kiểm tra certificate
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Renew certificate
./scripts/ssl-setup.sh renew yourdomain.com
```

### 5. Memory issues

```bash
# Kiểm tra memory usage
free -h
docker stats

# Cleanup unused images
docker system prune -a
```

## 🔄 Maintenance

### 1. Cập nhật hệ thống

```bash
# Cập nhật OS
sudo apt update && sudo apt upgrade -y  # Ubuntu/Debian
sudo yum update -y  # CentOS/RHEL

# Cập nhật Docker
sudo apt install docker.io  # Ubuntu/Debian
sudo yum update docker  # CentOS/RHEL
```

### 2. Cập nhật Application

```bash
# Pull latest code
git pull

# Update application
./scripts/update.sh
```

### 3. Backup Strategy

```bash
# Setup automated backup
./scripts/deploy.sh setup-cron

# Manual backup
./scripts/backup.sh backup
```

### 4. Log Rotation

```bash
# Setup log rotation
sudo nano /etc/logrotate.d/zeta-cms
```

**Nội dung logrotate:**

```
/var/log/zeta-cms/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 zeta zeta
}
```

## 📈 Performance Optimization

### 1. Database Optimization

```bash
# Tối ưu PostgreSQL
docker-compose exec postgres psql -U zeta_user -d zetadb -c "
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
SELECT pg_reload_conf();
"
```

### 2. Nginx Optimization

```bash
# Tối ưu Nginx
sudo nano nginx/nginx.prod.conf
```

Thêm vào `http` block:

```nginx
# Nginx optimization
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Caching
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
```

### 3. Docker Optimization

```bash
# Tối ưu Docker daemon
sudo nano /etc/docker/daemon.json
```

```json
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2",
    "live-restore": true
}
```

## 🚨 Security Checklist

### 1. Server Security

- [ ] Cập nhật OS thường xuyên
- [ ] Cấu hình firewall
- [ ] Sử dụng SSH key thay vì password
- [ ] Disable root login
- [ ] Cấu hình fail2ban

### 2. Application Security

- [ ] Thay đổi tất cả default passwords
- [ ] Sử dụng SSL/TLS
- [ ] Cấu hình rate limiting
- [ ] Enable security headers
- [ ] Regular backup

### 3. Database Security

- [ ] Sử dụng strong passwords
- [ ] Restrict database access
- [ ] Enable SSL cho database
- [ ] Regular backup

## 📞 Support & Help

### 1. Logs Location

```bash
# Application logs
tail -f logs/app.log

# Docker logs
docker-compose logs -f

# System logs
sudo journalctl -u docker
```

### 2. Useful Commands

```bash
# System info
uname -a
free -h
df -h

# Docker info
docker version
docker-compose version
docker system df

# Application status
./scripts/health-check.sh --email admin@yourdomain.com
```

### 3. Emergency Recovery

```bash
# Stop all services
docker-compose down

# Restore from backup
./scripts/backup.sh restore [backup-file]

# Start services
docker-compose up -d
```

## 🎯 Quick Reference

### URLs sau khi deploy:

- **Frontend**: `https://yourdomain.com`
- **Backend API**: `https://yourdomain.com/api`
- **Health Check**: `https://yourdomain.com/health`
- **Monitoring**: `http://your-vps-ip:9090` (Prometheus)

### Default Credentials:

- **Email**: admin@example.com
- **Password**: admin123
- **⚠️ Thay đổi ngay sau khi deploy!**

### Management Commands:

```bash
# Quick deploy
./scripts/quick-deploy.sh --production --domain yourdomain.com

# Check status
./scripts/monitor.sh status

# Create backup
./scripts/backup.sh backup

# Update app
./scripts/update.sh

# Health check
./scripts/health-check.sh
```

---

## 🎉 Chúc mừng!

Bạn đã hoàn thành việc deploy Zeta CMS trên VPS! Hệ thống của bạn bây giờ có:

- ✅ **Full-stack application** với React + Express + PostgreSQL
- ✅ **Docker containerized** với data persistence
- ✅ **SSL/TLS encryption** với Let's Encrypt
- ✅ **Automated backups** với retention policy
- ✅ **Monitoring & alerting** với Prometheus
- ✅ **Zero-downtime updates** với rolling deployment
- ✅ **Security hardening** với rate limiting và headers

Nếu gặp vấn đề, hãy kiểm tra logs và sử dụng các script monitoring để debug! 🚀
