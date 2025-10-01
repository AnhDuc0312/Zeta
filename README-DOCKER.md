# Zeta CMS - Docker Deployment Guide

Hướng dẫn triển khai Zeta CMS trên VPS sử dụng Docker với backup data tự động.

## 🐳 Cấu trúc Docker

```
Zeta/
├── docker-compose.yml          # Docker Compose configuration
├── backend/
│   └── Dockerfile             # Backend container
├── builder-orbit-lab-main/
│   └── Dockerfile             # Frontend container
├── nginx/
│   └── nginx.conf             # Nginx reverse proxy
├── scripts/
│   ├── deploy.sh              # Deployment script
│   └── backup.sh              # Backup script
├── backup/                    # Database backups
├── logs/                      # Application logs
└── data-export/               # Database schema & data
```

## 🚀 Quick Start

### 1. Chuẩn bị VPS

```bash
# Cài đặt Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Cài đặt các dependencies khác
sudo apt update
sudo apt install -y git curl wget openssl
```

### 2. Clone và cấu hình

```bash
# Clone repository
git clone <your-repo-url>
cd Zeta

# Tạo file cấu hình
cp env.example .env
nano .env  # Chỉnh sửa các thông số cần thiết

# Cấp quyền thực thi
chmod +x scripts/*.sh
```

### 3. Triển khai

```bash
# Triển khai tự động
./scripts/deploy.sh

# Hoặc triển khai thủ công
docker-compose up -d
```

## 📊 Services

| Service | Port | Description |
|---------|------|-------------|
| **Frontend** | 8080 | React SPA application |
| **Backend** | 4000 | Express.js API server |
| **PostgreSQL** | 5432 | Database |
| **Redis** | 6379 | Caching (optional) |
| **Nginx** | 80/443 | Reverse proxy & SSL |

## 🔒 SSL Configuration

### Tự động (Self-signed)
```bash
# Script sẽ tự động tạo self-signed certificates
./scripts/deploy.sh
```

### Thủ công (Production)
```bash
# Tạo thư mục SSL
mkdir -p nginx/ssl

# Copy certificates của bạn
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem

# Cấp quyền
chmod 644 nginx/ssl/cert.pem
chmod 600 nginx/ssl/key.pem
```

## 💾 Backup & Restore

### Tự động backup
```bash
# Thiết lập cron job cho backup hàng ngày
./scripts/deploy.sh setup-cron

# Tạo backup ngay lập tức
./scripts/backup.sh backup
```

### Thủ công backup
```bash
# Tạo backup
./scripts/backup.sh backup

# Xem danh sách backup
./scripts/backup.sh list

# Restore từ backup
./scripts/backup.sh restore /backup/zetadb_20241201_120000.sql.gz
```

### Backup data được lưu tại:
- **Local**: `./backup/`
- **Container**: `/backup/`
- **Retention**: 7 ngày (có thể thay đổi)

## 🔧 Management Commands

```bash
# Xem trạng thái services
./scripts/deploy.sh status

# Xem logs
./scripts/deploy.sh logs

# Restart services
./scripts/deploy.sh restart

# Stop services
./scripts/deploy.sh stop

# Start services
./scripts/deploy.sh start

# Update & redeploy
./scripts/deploy.sh update
```

## 📁 Data Persistence

### Volumes được tạo:
- `postgres_data` - Database data
- `redis_data` - Redis cache data  
- `backend_uploads` - Uploaded files

### Backup locations:
- `./backup/` - Database backups
- `./logs/` - Application logs
- `./nginx/ssl/` - SSL certificates

## 🔍 Monitoring & Logs

### Xem logs real-time
```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend

# Chỉ database
docker-compose logs -f postgres
```

### Health checks
```bash
# Backend API
curl http://localhost:4000/api/health

# Frontend
curl http://localhost:8080

# Database
docker-compose exec postgres pg_isready -U zeta_user -d zetadb
```

## 🚨 Troubleshooting

### Container không start
```bash
# Xem logs chi tiết
docker-compose logs <service-name>

# Restart container
docker-compose restart <service-name>

# Rebuild container
docker-compose up -d --build <service-name>
```

### Database connection issues
```bash
# Kiểm tra database
docker-compose exec postgres psql -U zeta_user -d zetadb -c "SELECT 1;"

# Reset database
docker-compose down -v
docker-compose up -d
```

### Port conflicts
```bash
# Kiểm tra port đang sử dụng
sudo netstat -tulpn | grep :4000
sudo netstat -tulpn | grep :8080

# Thay đổi port trong docker-compose.yml
```

## 🔄 Updates

### Update application
```bash
# Pull latest code
git pull

# Update & redeploy
./scripts/deploy.sh update
```

### Update Docker images
```bash
# Pull latest images
docker-compose pull

# Rebuild & restart
docker-compose up -d --build
```

## 📈 Performance Optimization

### Nginx caching
- Static assets: 1 year cache
- API responses: No cache
- Uploaded files: 1 year cache

### Database optimization
- Connection pooling
- Query optimization
- Index optimization

### Memory limits
```yaml
# Thêm vào docker-compose.yml
services:
  postgres:
    deploy:
      resources:
        limits:
          memory: 1G
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
```

## 🔐 Security

### Environment variables
- Tất cả secrets trong `.env`
- Không commit `.env` vào git
- Sử dụng strong passwords

### Network security
- Nginx reverse proxy
- Rate limiting
- SSL/TLS encryption
- Security headers

### Database security
- Non-root user
- Encrypted connections
- Regular backups
- Access restrictions

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Logs: `./scripts/deploy.sh logs`
2. Status: `./scripts/deploy.sh status`
3. Health checks: `curl http://localhost:4000/api/health`
4. Database: `docker-compose exec postgres psql -U zeta_user -d zetadb`

## 🎯 Production Checklist

- [ ] Thay đổi tất cả default passwords
- [ ] Cấu hình SSL certificates thật
- [ ] Thiết lập domain name
- [ ] Cấu hình firewall
- [ ] Thiết lập monitoring
- [ ] Cấu hình backup tự động
- [ ] Test restore từ backup
- [ ] Cấu hình log rotation
- [ ] Thiết lập alerts
- [ ] Performance testing
