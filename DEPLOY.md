# 🚀 Zeta CMS - Hướng dẫn Deploy

Hướng dẫn đơn giản để deploy Zeta CMS trên VPS hoặc local.

## 📁 Environment File

- **`env`** - File environment duy nhất với comments hướng dẫn

## 🎯 Cách Deploy

### 1. **Local Development**
```bash
# Copy file environment
cp env .env

# Deploy
./scripts/quick-deploy.sh
```
**URLs:** `http://localhost:8080` và `http://localhost:4000/api`

### 2. **VPS không có domain**
```bash
# Copy file environment
cp env .env

# Sửa IP trong .env
nano .env
# Uncomment và thay đổi:
# CORS_ORIGIN=http://your-vps-ip:8080
# VITE_API_URL=http://your-vps-ip:4000/api

# Deploy
./scripts/quick-deploy.sh
```
**URLs:** `http://your-vps-ip:8080` và `http://your-vps-ip:4000/api`

### 3. **VPS có domain (Production)**
```bash
# Copy file environment
cp env .env

# Sửa domain và passwords
nano .env
# Uncomment và thay đổi:
# NODE_ENV=production
# CORS_ORIGIN=https://yourdomain.com
# VITE_API_URL=https://yourdomain.com/api
# JWT_SECRET=your_strong_password
# POSTGRES_PASSWORD=your_strong_password

# Deploy
./scripts/quick-deploy.sh --production --domain yourdomain.com --email admin@yourdomain.com
```
**URLs:** `https://yourdomain.com` và `https://yourdomain.com/api`

## 🤖 Auto Deploy (Khuyến nghị)

```bash
# Tự động detect và deploy
./scripts/auto-deploy.sh --github-username your-username --github-email your@email.com

# Production với domain
./scripts/auto-deploy.sh --github-username your-username --github-email your@email.com --domain yourdomain.com --email admin@yourdomain.com
```

## ⚡ One-liner Commands

### **Local:**
```bash
cp env .env && ./scripts/quick-deploy.sh
```

### **VPS (IP only):**
```bash
cp env .env && sed -i 's/# CORS_ORIGIN=http:\/\/your-vps-ip:8080/CORS_ORIGIN=http:\/\/your-vps-ip:8080/' .env && sed -i 's/# VITE_API_URL=http:\/\/your-vps-ip:4000\/api/VITE_API_URL=http:\/\/your-vps-ip:4000\/api/' .env && ./scripts/quick-deploy.sh
```

### **Production:**
```bash
cp env .env && sed -i 's/# NODE_ENV=production/NODE_ENV=production/' .env && sed -i 's/# CORS_ORIGIN=https:\/\/yourdomain.com/CORS_ORIGIN=https:\/\/yourdomain.com/' .env && sed -i 's/# VITE_API_URL=https:\/\/yourdomain.com\/api/VITE_API_URL=https:\/\/yourdomain.com\/api/' .env && ./scripts/quick-deploy.sh --production --domain yourdomain.com --email admin@yourdomain.com
```

## 🔧 Setup VPS (nếu cần)

```bash
# Setup VPS tự động
curl -fsSL https://raw.githubusercontent.com/your-username/Zeta/dev/scripts/vps-setup.sh | bash

# Setup Git SSH
./scripts/setup-git-ssh.sh --username your-github-username --email your@email.com
```

## 📋 Tóm tắt

| Trường hợp | File Environment | Command |
|------------|------------------|---------|
| **Local** | `env` | `cp env .env && ./scripts/quick-deploy.sh` |
| **VPS (IP only)** | `env` + uncomment VPS | `cp env .env` + uncomment VPS section |
| **VPS (Domain)** | `env` + uncomment Production | `cp env .env` + uncomment Production section |
| **Auto** | Auto detect | `./scripts/auto-deploy.sh --github-username your-username --github-email your@email.com` |

## 🎯 Quyết định nhanh

- **Có domain?** → Uncomment Production section trong `env`
- **Không có domain?** → Uncomment VPS section trong `env`
- **Local?** → Giữ nguyên `env` (default)
- **Không chắc?** → `./scripts/auto-deploy.sh`

## 🔍 Troubleshooting

### **CORS errors?**
```bash
# Kiểm tra CORS_ORIGIN
grep CORS_ORIGIN .env

# Sửa cho đúng
sed -i 's/CORS_ORIGIN=.*/CORS_ORIGIN=http:\/\/your-actual-ip:8080/' .env
```

### **Database connection issues?**
```bash
# Kiểm tra DATABASE_URL
grep DATABASE_URL .env

# Test connection
psql "$(grep DATABASE_URL .env | cut -d'=' -f2)"
```

### **File .env không đúng?**
```bash
# Reset về default
cp env .env
```

## 📞 Management Commands

```bash
# Check status
./scripts/monitor.sh status

# View logs
./scripts/monitor.sh logs

# Health check
./scripts/health-check.sh

# Update
./scripts/update.sh

# Backup
./scripts/backup.sh backup
```

## 🎉 Default Credentials

- **Email:** admin@example.com
- **Password:** admin123
- **⚠️ Thay đổi ngay sau khi deploy!**

---

**Tóm tắt:** Copy `env` thành `.env`, uncomment section phù hợp, chỉnh sửa values cần thiết, rồi deploy! 🚀
