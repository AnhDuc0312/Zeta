# 🚀 Zeta CMS - Quick Start Guide

## ✅ Build đã thành công!

Dockerfile đã được sửa và build thành công. Bây giờ bạn có thể chạy ứng dụng.

## 🔧 Setup Docker Permissions (Chỉ cần làm 1 lần)

### Option 1: Thêm user vào docker group (Khuyến nghị)
```bash
# Chạy script setup
./setup-docker-permissions.sh

# Sau đó logout và login lại
# Sau khi login lại, chạy:
./start-without-sudo.sh
```

### Option 2: Sử dụng sudo (Tạm thời)
```bash
# Chạy với sudo
sudo ./start-backend-only.sh
```

## 🚀 Chạy ứng dụng

### Cách 1: Backend với Frontend tích hợp (Khuyến nghị)
```bash
# Build (đã xong)
./build-backend-only.sh

# Start
./start-without-sudo.sh  # (sau khi setup permissions)
# hoặc
sudo ./start-backend-only.sh  # (với sudo)
```

### Cách 2: Full stack với Nginx
```bash
# Start tất cả services
sudo ./start-all.sh
```

## 🌐 Truy cập ứng dụng

- **Frontend:** http://localhost:8080
- **API:** http://localhost:4000/api
- **API Health:** http://localhost:4000/api/health
- **API Docs:** http://localhost:4000/api-docs

## 🔍 Kiểm tra trạng thái

```bash
# Check status
./check-status.sh

# Xem logs
docker compose -f docker-compose.backend-only.yml logs

# Debug
./debug-backend-only.sh
```

## 🛑 Dừng ứng dụng

```bash
# Dừng tất cả
sudo ./stop-all.sh

# Hoặc dừng backend only
docker compose -f docker-compose.backend-only.yml down
```

## 📝 Lưu ý

1. **Build đã thành công** - Dockerfile đã được sửa
2. **Frontend tích hợp** - Chỉ cần 1 container backend
3. **Ports:** 4000 (API), 8080 (Frontend)
4. **Database:** PostgreSQL trên port 5432
5. **Cache:** Redis trên port 6379

## 🆘 Troubleshooting

### Nếu gặp lỗi permission:
```bash
# Thêm user vào docker group
sudo usermod -aG docker $USER
# Logout và login lại
```

### Nếu containers không start:
```bash
# Check logs
docker compose -f docker-compose.backend-only.yml logs

# Rebuild
./build-backend-only.sh
```

### Nếu ports bị chiếm:
```bash
# Check ports đang sử dụng
sudo netstat -tulpn | grep :4000
sudo netstat -tulpn | grep :8080
```
