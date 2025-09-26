# Zeta Project

Một hệ thống quản lý nội dung (CMS) full-stack với React frontend và Express backend, được thiết kế để quản lý articles, documents, notes và analytics.

## 📁 Cấu trúc Project

```
Zeta/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── controllers/        # API Controllers
│   │   ├── models/            # Database Models
│   │   ├── routes/            # API Routes
│   │   ├── services/          # Business Logic
│   │   ├── repositories/      # Data Access Layer
│   │   ├── middleware/        # Express Middleware
│   │   └── db.ts             # Database Connection
│   ├── tests/                 # Jest Tests
│   └── mock_data/            # Sample Data
│
└── builder-orbit-lab-main/    # React Frontend (Fusion Starter)
    ├── client/               # React SPA
    │   ├── pages/           # Route Components
    │   ├── components/      # UI Components
    │   ├── contexts/        # React Contexts
    │   └── hooks/           # Custom Hooks
    ├── server/              # Express Server (Development)
    └── shared/              # Shared Types
```

## 🚀 Quick Start

### 1. Cài đặt Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../builder-orbit-lab-main
npm install
```

### 2. Cấu hình Database

Tạo file `.env` trong thư mục `backend/`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/zetadb
PORT=4000
JWT_SECRET=your_jwt_secret_here
```

### 3. Chạy Database

```bash
# Tạo database và chạy migrations
psql -U postgres -c "CREATE DATABASE zetadb;"
psql -U postgres -d zetadb -f builder-orbit-lab-main/schema.sql
```

### 4. Chạy Applications

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server chạy trên http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd builder-orbit-lab-main
npm run dev
# Frontend chạy trên http://localhost:8080
```

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: Jest
- **Documentation**: Swagger
- **File Upload**: Multer

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router 6
- **Styling**: TailwindCSS 3
- **UI Components**: Radix UI
- **State Management**: React Query
- **Build Tool**: Vite
- **Testing**: Vitest

## 📊 Features

### User Features
- ✅ User Authentication (Login/Register)
- ✅ Article Management
- ✅ Document Management
- ✅ Notes System
- ✅ Search Functionality
- ✅ User Dashboard
- ✅ Account Management

### Admin Features
- ✅ Admin Dashboard
- ✅ Content Management
- ✅ User Management
- ✅ Analytics & Reports
- ✅ Activity Logs
- ✅ Category & Tag Management
- ✅ System Settings

### Technical Features
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ File Upload
- ✅ Rate Limiting
- ✅ Error Handling
- ✅ Database Migrations
- ✅ API Documentation

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Content Management
- `GET /api/content` - Get all content
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### User Management
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Analytics
- `GET /api/analytics` - Get analytics data
- `GET /api/activity-logs` - Get activity logs

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd builder-orbit-lab-main
npm test
```

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./builder-orbit-lab-main/README.md)
- [API Documentation](http://localhost:4000/api-docs) (Swagger UI)

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm start

# Frontend
cd builder-orbit-lab-main
npm run build
npm start
```

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
PORT=4000
JWT_SECRET=...
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:4000
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

Nếu gặp vấn đề, vui lòng tạo issue hoặc liên hệ team phát triển.

---

**Zeta Project** - Modern CMS Solution
