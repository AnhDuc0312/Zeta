# 🚀 Zeta CMS - Complete Documentation

## 📚 Quick Links

- **[DEPLOY.md](./DEPLOY.md)** - Deployment Guide
- **[DOCKER-QUICK-START.md](./DOCKER-QUICK-START.md)** - Docker Quick Start
- **[DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)** - Database Schema

## 🎯 Quick Start

```bash
# Start backend services
./start-services.sh

# Start frontend
./start-frontend.sh

# Or start all at once
./start-all.sh
```

## 📋 URLs

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:4000/api
- **API Docs:** http://localhost:4000/api-docs

## 🔧 Management Scripts

| Script | Purpose |
|--------|---------|
| `start-services.sh` | Start backend services |
| `start-frontend.sh` | Start frontend |
| `start-all.sh` | Start all services |
| `stop-all.sh` | Stop all services |
| `health-check.sh` | Check service health |
| `fix-backend.sh` | Fix backend issues |
| `debug-backend.sh` | Debug backend |

## 🐳 Docker Files

- `docker-compose.services.yml` - Backend services
- `docker-compose.frontend.yml` - Frontend only
- `docker-compose.yml` - Full stack

## 📁 Project Structure

```
Zeta/
├── backend/                    # Express.js API
├── builder-orbit-lab-main/     # React Frontend
├── data-export/               # Database schema & data
├── scripts/                   # Management scripts
├── nginx/                     # Nginx configuration
├── monitoring/                # Monitoring configs
└── e2e-tests/                # End-to-end tests
```

## 🔧 Environment

Copy `env` to `.env` and modify as needed:

```bash
cp env .env
```

## 🚀 Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

