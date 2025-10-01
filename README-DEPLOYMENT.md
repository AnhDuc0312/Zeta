# 🚀 Zeta CMS - Deployment Documentation

Tài liệu tổng hợp về việc triển khai Zeta CMS trên VPS với Docker.

## 📚 Tài liệu Deployment

### 🎯 Quick Start
- **[DEPLOY.md](./DEPLOY.md)** - Hướng dẫn deploy đơn giản
- **[ENV.md](./ENV.md)** - Tài liệu environment variables
- **[README-DOCKER.md](./README-DOCKER.md)** - Tài liệu Docker configuration

### 🔧 Scripts & Tools
- **`scripts/vps-setup.sh`** - Tự động cài đặt VPS và dependencies
- **`scripts/setup-git-ssh.sh`** - Setup SSH keys cho Git access
- **`scripts/quick-deploy.sh`** - Deploy ứng dụng một lệnh
- **`scripts/deploy.sh`** - Quản lý deployment
- **`scripts/backup.sh`** - Backup và restore database
- **`scripts/ssl-setup.sh`** - Cấu hình SSL certificates
- **`scripts/monitor.sh`** - Monitoring và health checks
- **`scripts/update.sh`** - Cập nhật ứng dụng zero-downtime
- **`scripts/health-check.sh`** - Kiểm tra sức khỏe hệ thống

## 🎬 Video Tutorials (Coming Soon)

### 1. VPS Setup & Preparation
```bash
# Tự động setup VPS
curl -fsSL https://raw.githubusercontent.com/your-repo/Zeta/main/scripts/vps-setup.sh | bash

# Hoặc download và chạy
wget https://raw.githubusercontent.com/your-repo/Zeta/main/scripts/vps-setup.sh
chmod +x vps-setup.sh
./vps-setup.sh
```

### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/your-username/Zeta.git
cd Zeta

# Deploy development
./scripts/quick-deploy.sh

# Deploy production
./scripts/quick-deploy.sh --production --domain yourdomain.com --email admin@yourdomain.com
```

### 3. SSL Configuration
```bash
# Let's Encrypt (Production)
sudo ./scripts/ssl-setup.sh letsencrypt yourdomain.com admin@yourdomain.com

# Self-signed (Development)
./scripts/ssl-setup.sh self-signed localhost
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] VPS với specs tối thiểu (1GB RAM, 10GB SSD)
- [ ] Domain name đã cấu hình DNS
- [ ] SSH access đến VPS
- [ ] Firewall ports mở (22, 80, 443)

### VPS Setup
- [ ] Cập nhật hệ thống
- [ ] Cài đặt Docker & Docker Compose
- [ ] Cấu hình firewall
- [ ] Tối ưu hệ thống
- [ ] Tạo swap file (nếu cần)

### Application Deployment
- [ ] Clone repository
- [ ] Cấu hình environment variables
- [ ] Deploy services
- [ ] Kiểm tra health checks
- [ ] Cấu hình SSL certificates

### Post-deployment
- [ ] Thay đổi default passwords
- [ ] Setup monitoring alerts
- [ ] Cấu hình backup schedule
- [ ] Test tất cả chức năng
- [ ] Performance optimization

## 🔧 Environment Configurations

### Development
```bash
# Sử dụng docker-compose.yml
docker-compose up -d

# URLs
Frontend: http://localhost:8080
Backend: http://localhost:4000/api
Database: localhost:5432
```

### Production
```bash
# Sử dụng docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d

# URLs
Frontend: https://yourdomain.com
Backend: https://yourdomain.com/api
Database: localhost:5432 (internal)
```

## 🛠️ Management Commands

### Service Management
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

### Backup & Restore
```bash
# Create backup
./scripts/backup.sh backup

# List backups
./scripts/backup.sh list

# Restore from backup
./scripts/backup.sh restore /backup/zetadb_20241201_120000.sql.gz
```

### Monitoring
```bash
# Health check
./scripts/health-check.sh

# Real-time monitoring
./scripts/monitor.sh monitor

# View logs
./scripts/monitor.sh logs
```

### Updates
```bash
# Update application
./scripts/update.sh

# Force update
./scripts/update.sh --force
```

## 🔒 Security Best Practices

### Server Security
- [ ] Sử dụng SSH keys thay vì passwords
- [ ] Disable root login
- [ ] Cấu hình fail2ban
- [ ] Regular security updates
- [ ] Firewall configuration

### Application Security
- [ ] Strong passwords cho tất cả accounts
- [ ] SSL/TLS encryption
- [ ] Rate limiting
- [ ] Security headers
- [ ] Regular backups

### Database Security
- [ ] Strong database passwords
- [ ] Restrict database access
- [ ] Enable SSL cho database connections
- [ ] Regular database backups

## 📊 Monitoring & Alerting

### Built-in Monitoring
- **Health Checks**: Tự động kiểm tra tất cả services
- **Resource Monitoring**: CPU, Memory, Disk usage
- **Application Metrics**: Response times, error rates
- **Database Monitoring**: Connection status, query performance

### External Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Email Alerts**: Critical issues notifications
- **Webhook Alerts**: Integration với Slack/Discord

## 🚨 Troubleshooting Guide

### Common Issues

#### Services không start
```bash
# Check logs
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild service
docker-compose up -d --build [service-name]
```

#### Database connection issues
```bash
# Check database
docker-compose exec postgres psql -U zeta_user -d zetadb -c "SELECT 1;"

# Reset database
docker-compose down -v
docker-compose up -d
```

#### Port conflicts
```bash
# Check port usage
netstat -tulpn | grep :4000
netstat -tulpn | grep :8080

# Kill process
kill -9 [PID]
```

#### SSL issues
```bash
# Check certificate
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Renew certificate
./scripts/ssl-setup.sh renew yourdomain.com
```

### Debug Commands
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

## 📈 Performance Optimization

### Database Optimization
- Connection pooling
- Query optimization
- Index optimization
- Memory tuning

### Nginx Optimization
- Gzip compression
- Static file caching
- Rate limiting
- Connection pooling

### Docker Optimization
- Resource limits
- Log rotation
- Image cleanup
- Volume optimization

## 🔄 Maintenance Schedule

### Daily
- [ ] Health check
- [ ] Log review
- [ ] Backup verification

### Weekly
- [ ] Security updates
- [ ] Performance review
- [ ] Log cleanup

### Monthly
- [ ] Full system backup
- [ ] Security audit
- [ ] Performance optimization

## 📞 Support & Community

### Documentation
- [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md) - Chi tiết đầy đủ
- [QUICK-START-VPS.md](./QUICK-START-VPS.md) - Hướng dẫn nhanh
- [README-DOCKER.md](./README-DOCKER.md) - Docker configuration

### Getting Help
1. Kiểm tra logs: `./scripts/monitor.sh logs`
2. Health check: `./scripts/health-check.sh`
3. Xem documentation
4. Tạo issue trên GitHub

### Contributing
- Fork repository
- Tạo feature branch
- Submit pull request
- Update documentation

---

## 🎯 Quick Reference

### One-liner Deploy

#### Development (từ nhánh dev):
```bash
# VPS setup + Git SSH + Deploy từ dev branch
curl -fsSL https://raw.githubusercontent.com/your-username/Zeta/dev/scripts/vps-setup.sh | bash && \
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/id_ed25519 -N "" && \
echo "Add this key to GitHub:" && cat ~/.ssh/id_ed25519.pub && \
read -p "Press Enter after adding key to GitHub..." && \
git clone -b dev git@github.com:your-username/Zeta.git && \
cd Zeta && chmod +x scripts/*.sh && \
./scripts/quick-deploy.sh
```

#### Production (với domain):
```bash
# VPS setup + Deploy production
curl -fsSL https://raw.githubusercontent.com/your-username/Zeta/main/scripts/vps-setup.sh | bash && \
git clone -b main git@github.com:your-username/Zeta.git && \
cd Zeta && chmod +x scripts/*.sh && \
./scripts/quick-deploy.sh --production --domain yourdomain.com --email admin@yourdomain.com
```

### Emergency Recovery
```bash
# Stop all services
docker-compose down

# Restore from backup
./scripts/backup.sh restore [backup-file]

# Start services
docker-compose up -d
```

### Health Check
```bash
# Comprehensive health check
./scripts/health-check.sh --email admin@yourdomain.com --webhook https://hooks.slack.com/your-webhook
```

---

**Happy Deploying! 🚀**
