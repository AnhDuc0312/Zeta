# ⚡ Quick Start - Deploy Zeta CMS trên VPS

Hướng dẫn nhanh để deploy Zeta CMS trên VPS trong 10 phút.

## 🚀 Bước 1: Chuẩn bị VPS

### Yêu cầu tối thiểu:
- **RAM**: 1GB+
- **Storage**: 10GB+ SSD
- **OS**: Ubuntu 20.04+ / CentOS 8+

### Kết nối VPS:
```bash
ssh root@your-vps-ip
```

## 🔧 Bước 2: Cài đặt Dependencies

```bash
# Cập nhật hệ thống
apt update && apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Cài đặt Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Cài đặt tools cần thiết
apt install -y git curl wget
```

## 📥 Bước 3: Clone & Deploy

```bash
# Clone project
git clone https://github.com/your-username/Zeta.git
cd Zeta

# Cấp quyền
chmod +x scripts/*.sh

# Deploy nhanh (Development)
./scripts/quick-deploy.sh

# Hoặc Deploy Production với domain
./scripts/quick-deploy.sh --production --domain yourdomain.com --email admin@yourdomain.com
```

## 🌐 Bước 4: Cấu hình Domain (Production)

### 1. Cấu hình DNS:
```
Type: A
Name: @
Value: your-vps-ip
TTL: 300
```

### 2. Mở Firewall:
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 3. Setup SSL:
```bash
# Let's Encrypt (Production)
sudo ./scripts/ssl-setup.sh letsencrypt yourdomain.com admin@yourdomain.com

# Self-signed (Development)
./scripts/ssl-setup.sh self-signed localhost
```

## ✅ Bước 5: Kiểm tra

```bash
# Kiểm tra trạng thái
./scripts/monitor.sh status

# Health check
./scripts/health-check.sh

# Xem logs
./scripts/monitor.sh logs
```

## 🎯 Truy cập Application

- **Frontend**: `https://yourdomain.com` (production) hoặc `http://your-vps-ip:8080`
- **Backend API**: `https://yourdomain.com/api` hoặc `http://your-vps-ip:4000/api`

### Default Login:
- **Email**: admin@example.com
- **Password**: admin123
- **⚠️ Thay đổi ngay!**

## 🔧 Quản lý

```bash
# Start/Stop
./scripts/deploy.sh start
./scripts/deploy.sh stop

# Backup
./scripts/backup.sh backup

# Update
./scripts/update.sh

# Monitor
./scripts/monitor.sh monitor
```

## 🚨 Troubleshooting

### Services không start:
```bash
docker-compose logs
docker-compose restart
```

### Port conflicts:
```bash
netstat -tulpn | grep :4000
kill -9 [PID]
```

### Database issues:
```bash
docker-compose exec postgres psql -U zeta_user -d zetadb -c "SELECT 1;"
```

## 📊 Monitoring URLs

- **Prometheus**: `http://your-vps-ip:9090`
- **Grafana**: `http://your-vps-ip:3000`
- **Health Check**: `https://yourdomain.com/health`

---

## 🎉 Hoàn thành!

Bạn đã deploy thành công Zeta CMS! 

**Next Steps:**
1. Đăng nhập và thay đổi password
2. Cấu hình domain (nếu chưa)
3. Setup monitoring alerts
4. Tạo backup schedule

**Need Help?** Xem [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md) để biết thêm chi tiết.
