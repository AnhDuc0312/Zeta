# 🐳 Docker Quick Start

Hướng dẫn nhanh để chạy Zeta CMS với Docker.

## 📁 Files Docker

- **`docker-compose.services.yml`** - Backend Services (Database + Redis + API)
- **`docker-compose.frontend.yml`** - Frontend Only
- **`docker-compose.yml`** - Full Stack (tất cả services)

## 🚀 Cách chạy

### **Option 1: Chạy riêng biệt (Khuyến nghị)**

```bash
# 1. Chạy backend services trước
./start-services.sh

# 2. Chạy frontend sau
./start-frontend.sh
```

### **Option 2: Chạy tất cả cùng lúc**

```bash
./start-all.sh
```

### **Option 3: Chạy thủ công**

```bash
# Tạo network
sudo docker network create zeta-network

# Backend services
sudo docker compose -f docker-compose.services.yml up -d

# Frontend
sudo docker compose -f docker-compose.frontend.yml up -d
```

## 📋 URLs

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:4000/api
- **API Docs:** http://localhost:4000/api-docs
- **Database:** localhost:5432
- **Redis:** localhost:6379

## 🔧 Management

```bash
# Xem logs
sudo docker compose -f docker-compose.services.yml logs
sudo docker compose -f docker-compose.frontend.yml logs

# Xem status
sudo docker compose -f docker-compose.services.yml ps
sudo docker compose -f docker-compose.frontend.yml ps

# Dừng tất cả
./stop-all.sh
```

## 🎯 Tóm tắt

| Script | Mô tả |
|--------|-------|
| `./start-services.sh` | Chạy backend services |
| `./start-frontend.sh` | Chạy frontend |
| `./start-all.sh` | Chạy tất cả |
| `./stop-all.sh` | Dừng tất cả |

**Khuyến nghị:** Chạy `./start-services.sh` trước, sau đó `./start-frontend.sh` 🚀

