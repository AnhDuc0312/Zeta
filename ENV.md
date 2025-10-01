# ⚙️ Zeta CMS - Environment Variables

Tài liệu về các biến môi trường trong Zeta CMS.

## 📁 Environment File

- **`env`** - File environment duy nhất với comments hướng dẫn
- **`env.example`** - File mẫu cơ bản

## 🔧 Các biến môi trường chính

### **Database**
```env
DATABASE_URL=postgresql://zeta_user:zeta_password_2024@localhost:5432/zetadb
POSTGRES_DB=zetadb
POSTGRES_USER=zeta_user
POSTGRES_PASSWORD=zeta_password_2024
```

### **Server**
```env
NODE_ENV=development
PORT=4000
FRONTEND_PORT=8080
```

### **JWT Authentication**
```env
JWT_SECRET=dev_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
```

### **File Upload**
```env
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

### **Security**
```env
CORS_ORIGIN=http://localhost:8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### **Frontend (Vite)**
```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=Zeta CMS
VITE_APP_VERSION=1.0.0
```

### **Redis (Optional)**
```env
REDIS_URL=redis://localhost:6379
```

### **Email (Optional)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### **Backup**
```env
BACKUP_RETENTION_DAYS=7
BACKUP_SCHEDULE=0 2 * * *
```

### **SSL**
```env
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
```

### **Monitoring**
```env
LOG_LEVEL=debug
ENABLE_METRICS=true
```

## 🎯 Cách sử dụng

### **1. Copy file environment**
```bash
# Copy file environment
cp env .env
```

### **2. Uncomment section phù hợp**
```bash
nano .env

# Uncomment các dòng cần thiết:
# - VPS section: CORS_ORIGIN và VITE_API_URL
# - Production section: NODE_ENV, CORS_ORIGIN, VITE_API_URL, JWT_SECRET, POSTGRES_PASSWORD
```

### **3. Load trong code**
```typescript
// Backend
import dotenv from 'dotenv';
dotenv.config();

// Frontend (Vite tự động load)
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🔒 Security Best Practices

### **Development**
- Sử dụng default passwords
- CORS cho localhost
- Debug mode bật

### **Production**
- Strong passwords cho JWT và database
- CORS cho domain thật
- Debug mode tắt
- SSL certificates

## 🔍 Troubleshooting

### **Biến môi trường không load**
```bash
# Kiểm tra file .env
ls -la .env
cat .env | head -10

# Test load
node -e "require('dotenv').config(); console.log(process.env.NODE_ENV);"
```

### **Frontend không nhận VITE_**
```bash
# Kiểm tra prefix VITE_
grep VITE_ .env

# Restart dev server
npm run dev
```

### **Database connection issues**
```bash
# Kiểm tra DATABASE_URL
grep DATABASE_URL .env

# Test connection
psql "$(grep DATABASE_URL .env | cut -d'=' -f2)"
```

## 📊 Các section trong file env

| Section | Mục đích | Cách sử dụng |
|---------|----------|--------------|
| **Default** | Development local | Giữ nguyên, không cần sửa |
| **VPS section** | VPS không domain | Uncomment CORS_ORIGIN và VITE_API_URL |
| **Production section** | VPS có domain | Uncomment tất cả dòng trong section |
| **Optional sections** | Tính năng nâng cao | Uncomment khi cần |

## 🎯 Quick Reference

### **Development**
```env
NODE_ENV=development
LOG_LEVEL=debug
DEBUG=true
CORS_ORIGIN=http://localhost:8080
VITE_API_URL=http://localhost:4000/api
```

### **Production**
```env
NODE_ENV=production
LOG_LEVEL=info
DEBUG=false
CORS_ORIGIN=https://yourdomain.com
VITE_API_URL=https://yourdomain.com/api
JWT_SECRET=your_super_secure_jwt_secret_here
POSTGRES_PASSWORD=your_super_secure_database_password_here
```

## ⚠️ Lưu ý

- Tất cả biến có prefix `VITE_` sẽ được expose cho frontend
- Biến không có prefix chỉ dành cho backend
- Luôn sử dụng strong passwords trong production
- Không commit file `.env` vào Git
- Sử dụng file `.env.example` làm template

---

**Tóm tắt:** Copy `env` thành `.env`, uncomment section phù hợp, chỉnh sửa values cần thiết! 🚀
