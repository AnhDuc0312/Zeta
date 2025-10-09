# Zeta CMS - Deployment Guide

## 🚀 Quick Start

### Option 1: Backend with Integrated Frontend (Recommended)
```bash
# Build and start everything
./build-backend-only.sh
./start-backend-only.sh

# Or manually
sudo docker compose -f docker-compose.backend-only.yml up -d --build
```

### Option 2: Full Stack with Nginx
```bash
# Start all services including Nginx
./start-all.sh

# Or manually
sudo docker compose up -d --build
```

## 📁 Project Structure

```
Zeta/
├── backend/                    # Backend API
│   ├── Dockerfile             # Multi-stage build with frontend integration
│   └── src/                   # Backend source code
├── builder-orbit-lab-main/    # Frontend source code
│   ├── client/                # React components
│   ├── server/                # Express server (for development)
│   └── shared/                # Shared types
├── docker-compose.yml         # Full stack (Backend + Nginx + DB)
├── docker-compose.backend-only.yml  # Backend only with integrated frontend
└── scripts/                   # Deployment scripts
```

## 🐳 Docker Configuration

### Backend with Integrated Frontend
- **File:** `docker-compose.backend-only.yml`
- **Services:** PostgreSQL, Redis, Backend (with frontend), Backup
- **Ports:** 
  - `4000` - Backend API
  - `8080` - Frontend (same as backend)
  - `5432` - PostgreSQL
  - `6379` - Redis

### Full Stack
- **File:** `docker-compose.yml`
- **Services:** PostgreSQL, Redis, Backend (with frontend), Nginx, Backup
- **Ports:**
  - `80/443` - Nginx (Frontend + API)
  - `4000` - Backend API (direct)
  - `5432` - PostgreSQL
  - `6379` - Redis

## 🔧 Available Scripts

### Main Scripts
```bash
# Start all services
./start-all.sh

# Start only backend with integrated frontend
./start-backend-only.sh

# Stop all services
./stop-all.sh

# Fix/rebuild backend
./fix-backend.sh

# Debug backend
./debug-backend.sh
./debug-backend-only.sh

# Health check
./health-check.sh
```

### Build Scripts
```bash
# Build backend with integrated frontend
./build-backend-only.sh
```

## 🌐 Access URLs

### Backend Only Mode
- **Frontend:** http://localhost:8080
- **API:** http://localhost:4000/api
- **API Health:** http://localhost:4000/api/health
- **API Docs:** http://localhost:4000/api-docs

### Full Stack Mode
- **Frontend:** http://localhost (or https://localhost)
- **API:** http://localhost/api
- **API Health:** http://localhost/api/health
- **API Docs:** http://localhost/api-docs

## 🔍 Troubleshooting

### Check Status
```bash
# Check container status
sudo docker compose ps

# Check logs
sudo docker compose logs -f

# Debug specific container
./debug-backend-only.sh
```

### Common Issues
1. **Port conflicts:** Make sure ports 4000, 8080, 5432, 6379 are available
2. **Permission issues:** Use `sudo` for Docker commands
3. **Build failures:** Check Docker logs and rebuild with `--no-cache`

### Reset Everything
```bash
# Stop and remove all containers
sudo docker compose down

# Remove all images
sudo docker rmi $(sudo docker images -q)

# Rebuild from scratch
./build-backend-only.sh
./start-backend-only.sh
```

## 📝 Notes

- Frontend is now **integrated** into the backend container
- No separate frontend container needed
- SPA routing is handled by the backend Express server
- All static files are served from `/app/ui` directory in the container
- API routes are prefixed with `/api/`
- Frontend routes fall back to `index.html` for SPA routing
