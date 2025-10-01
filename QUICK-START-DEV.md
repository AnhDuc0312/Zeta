# ⚡ Quick Start - Deploy Zeta CMS từ nhánh DEV

Hướng dẫn nhanh để deploy Zeta CMS từ nhánh `dev` trên VPS trong 15 phút.

## 🚀 Bước 1: Setup VPS

### Kết nối VPS:
```bash
ssh root@your-vps-ip
```

### Auto Setup VPS:
```bash
# Download và chạy script setup
curl -fsSL https://raw.githubusercontent.com/your-username/Zeta/dev/scripts/vps-setup.sh | bash
```

## 🔑 Bước 2: Setup Git SSH

### Tạo SSH Key:
```bash
# Tạo SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

### Thêm vào GitHub:
1. Vào https://github.com/settings/keys
2. Click "New SSH key"
3. Paste key và save

### Test SSH:
```bash
ssh -T git@github.com
```

## 📥 Bước 3: Clone & Deploy

### Clone từ nhánh dev:
```bash
# Clone từ nhánh dev
git clone -b dev git@github.com:your-username/Zeta.git
cd Zeta

# Cấp quyền
chmod +x scripts/*.sh
```

### Deploy development:
```bash
# Deploy nhanh (không cần domain)
./scripts/quick-deploy.sh

# Hoặc deploy thủ công
docker-compose up -d --build
```

## 🌐 Bước 4: Truy cập Application

### URLs:
- **Frontend**: `http://your-vps-ip:8080`
- **Backend API**: `http://your-vps-ip:4000/api`
- **Health Check**: `http://your-vps-ip:4000/api/health`

### Default Login:
- **Email**: admin@example.com
- **Password**: admin123
- **⚠️ Thay đổi ngay!**

## 🔧 Bước 5: Kiểm tra & Quản lý

### Kiểm tra trạng thái:
```bash
# Status
./scripts/monitor.sh status

# Health check
./scripts/health-check.sh

# Logs
./scripts/monitor.sh logs
```

### Quản lý services:
```bash
# Start/Stop
./scripts/deploy.sh start
./scripts/deploy.sh stop

# Restart
./scripts/deploy.sh restart

# Update
./scripts/update.sh
```

## 🔄 Development Workflow

### Pull latest changes:
```bash
git pull origin dev
./scripts/update.sh
```

### Code changes:
```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin dev

# On VPS
git pull origin dev
./scripts/update.sh
```

## 🚨 Troubleshooting

### Git issues:
```bash
# Permission denied
ssh-add ~/.ssh/id_ed25519

# Test SSH
ssh -T git@github.com
```

### Port conflicts:
```bash
# Check ports
netstat -tulpn | grep :8080
netstat -tulpn | grep :4000

# Kill process
sudo kill -9 [PID]
```

### Docker issues:
```bash
# Clean up
docker system prune -a

# Rebuild
docker-compose down
docker-compose up -d --build
```

## 📱 Mobile Access

### Truy cập từ mobile:
```
Frontend: http://your-vps-ip:8080
Backend: http://your-vps-ip:4000/api
```

## 🎯 One-liner Deploy

```bash
# Complete setup + deploy từ dev branch
curl -fsSL https://raw.githubusercontent.com/your-username/Zeta/dev/scripts/vps-setup.sh | bash && \
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/id_ed25519 -N "" && \
echo "Add this key to GitHub:" && cat ~/.ssh/id_ed25519.pub && \
read -p "Press Enter after adding key to GitHub..." && \
git clone -b dev git@github.com:your-username/Zeta.git && \
cd Zeta && chmod +x scripts/*.sh && \
./scripts/quick-deploy.sh
```

## 🎉 Hoàn thành!

Bây giờ bạn có thể:

1. ✅ **Truy cập** `http://your-vps-ip:8080`
2. ✅ **Đăng nhập** với `admin@example.com` / `admin123`
3. ✅ **Thay đổi password**
4. ✅ **Bắt đầu development**

**Next Steps:**
- Xem [DEV-DEPLOYMENT-GUIDE.md](./DEV-DEPLOYMENT-GUIDE.md) để biết thêm chi tiết
- Setup domain nếu cần
- Configure monitoring alerts

**Need Help?** Xem logs với `./scripts/monitor.sh logs` 🚀
