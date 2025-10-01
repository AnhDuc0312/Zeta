# Zeta CMS - Content Management System

Một hệ thống quản lý nội dung (CMS) full-stack hiện đại với React frontend và Express backend, được thiết kế để quản lý articles, documents, notes, analytics và user interactions.

## 📁 Cấu trúc Project

```
Zeta/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── controllers/        # API Controllers (20+ endpoints)
│   │   ├── models/            # TypeScript Models & Interfaces
│   │   ├── routes/            # Express Route Handlers
│   │   ├── services/          # Business Logic Layer
│   │   ├── repositories/      # Data Access Layer
│   │   ├── middleware/        # Express Middleware
│   │   ├── types/             # TypeScript Type Definitions
│   │   ├── scripts/           # Database Seeding Scripts
│   │   ├── db.ts             # PostgreSQL Connection
│   │   ├── index.ts          # Main Application Setup
│   │   └── server.ts         # Server Entry Point
│   ├── tests/                 # Comprehensive Test Suite
│   │   ├── controllers/       # Controller Tests
│   │   ├── repositories/      # Repository Tests
│   │   ├── services/          # Service Tests
│   │   └── integration/       # Integration Tests
│   ├── mock_data/            # Sample Data & Seed Scripts
│   └── public/uploads/       # File Upload Storage
│
├── builder-orbit-lab-main/    # React Frontend (Fusion Starter)
│   ├── client/               # React SPA Application
│   │   ├── pages/           # Route Components (36 pages)
│   │   ├── components/      # UI Components (80+ components)
│   │   │   └── ui/         # Radix UI Component Library
│   │   ├── contexts/        # React Context Providers
│   │   ├── hooks/           # Custom React Hooks
│   │   ├── lib/             # Utility Functions
│   │   ├── mocks/           # MSW Mock Handlers
│   │   └── __tests__/       # Frontend Test Suite
│   ├── server/              # Express Development Server
│   ├── shared/              # Shared TypeScript Types
│   ├── dist/                # Production Build Output
│   └── public/              # Static Assets
│
├── data-export/              # Database Export & Migration Scripts
│   ├── schema.sql           # Complete Database Schema
│   ├── *.sql               # Individual Table Exports
│   └── export-summary.md   # Export Documentation
│
└── Documentation Files
    ├── README.md                    # Main Project Documentation
    ├── DATABASE_DOCUMENTATION.md   # Database Schema Documentation
    ├── BOOKMARK_SYSTEM.md          # Bookmark Feature Documentation
    └── COMMENT_SYSTEM.md           # Comment System Documentation
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

### Backend (Express.js API)
- **Runtime**: Node.js 18+ với TypeScript
- **Framework**: Express.js 4.18+ với CORS support
- **Database**: PostgreSQL với pg driver
- **Authentication**: JWT với bcrypt password hashing
- **File Processing**: Sharp cho image optimization
- **Validation**: Express-validator cho input validation
- **Rate Limiting**: Express-rate-limit
- **Testing**: Jest với Supertest cho API testing
- **Documentation**: Swagger UI với auto-generated docs
- **File Upload**: Multer với file type validation

### Frontend (React SPA)
- **Framework**: React 18 với TypeScript
- **Routing**: React Router 6 với SPA mode
- **Styling**: TailwindCSS 3 với custom design system
- **UI Components**: Radix UI component library (80+ components)
- **State Management**: TanStack React Query cho server state
- **Forms**: React Hook Form với Zod validation
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion
- **Build Tool**: Vite với hot reload
- **Testing**: Vitest với Testing Library
- **Mocking**: MSW (Mock Service Worker)

## 📊 Features

### 🎯 Core Content Management
- ✅ **Multi-format Content**: Articles, Documents, Notes với rich text support
- ✅ **Content Organization**: Categories và Tags system với many-to-many relationships
- ✅ **Content Status**: Draft, Published, Private, Archived states
- ✅ **SEO Optimization**: Custom URLs, meta titles, descriptions
- ✅ **Content Analytics**: View counts, like counts, comment tracking
- ✅ **File Attachments**: Support cho images, documents, archives

### 👤 User Management & Authentication
- ✅ **JWT Authentication**: Secure login/logout với token refresh
- ✅ **Role-based Access**: Admin, Moderator, User roles
- ✅ **User Profiles**: Avatar, bio, location, website
- ✅ **Account Management**: Profile editing, password changes
- ✅ **User Dashboard**: Personal content management

### 🔍 Search & Discovery
- ✅ **Full-text Search**: Search across all content types
- ✅ **Advanced Filtering**: Filter by category, tags, author, date
- ✅ **Search Analytics**: Track search queries và results
- ✅ **Content Recommendations**: Related content suggestions

### 💬 Social Features
- ✅ **Comment System**: Nested comments với moderation
- ✅ **Like System**: User likes với unique constraints
- ✅ **Bookmark System**: Save content for later
- ✅ **Activity Tracking**: User activity logs và analytics

### 🛠️ Admin Features
- ✅ **Admin Dashboard**: System overview với key metrics
- ✅ **Content Management**: CRUD operations cho all content types
- ✅ **User Management**: User administration và role management
- ✅ **Analytics Dashboard**: Usage statistics và reports
- ✅ **Activity Monitoring**: Real-time activity logs
- ✅ **System Settings**: Configurable system parameters
- ✅ **Category/Tag Management**: Content organization tools

### 🔧 Technical Features
- ✅ **RESTful API**: 20+ endpoints với comprehensive error handling
- ✅ **File Upload**: Image optimization với Sharp
- ✅ **Rate Limiting**: API protection với configurable limits
- ✅ **Database Migrations**: Automated schema updates
- ✅ **API Documentation**: Auto-generated Swagger docs
- ✅ **Comprehensive Testing**: Unit, integration, và E2E tests
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Error Handling**: Global error boundaries và logging

## 🔌 API Endpoints

### 🔐 Authentication & Account
```
POST   /api/auth/login              # User login
POST   /api/auth/register           # User registration  
POST   /api/auth/logout             # User logout
GET    /api/auth/profile            # Get current user profile
POST   /api/auth/change-password    # Change user password

GET    /api/account/profile         # Get account details
PUT    /api/account/profile         # Update account profile
```

### 📝 Content Management
```
GET    /api/content                 # Get all content (with filters)
GET    /api/content/:id             # Get content by ID
POST   /api/content                 # Create new content
PUT    /api/content/:id             # Update content
DELETE /api/content/:id             # Delete content
```

### 👥 User Management
```
GET    /api/users                   # Get all users
GET    /api/users/:id               # Get user by ID
PUT    /api/users/profile           # Update user profile
GET    /api/users/stats             # Get user statistics
GET    /api/users/favorites         # Get user favorites
```

### 🏷️ Categories & Tags
```
GET    /api/categories              # Get all categories
GET    /api/categories/:id          # Get category by ID
POST   /api/categories              # Create category (Admin)
PUT    /api/categories/:id          # Update category (Admin)
DELETE /api/categories/:id          # Delete category (Admin)

GET    /api/tags                    # Get all tags
GET    /api/tags/:id                # Get tag by ID
POST   /api/tags                    # Create tag (Admin)
PUT    /api/tags/:id                # Update tag (Admin)
DELETE /api/tags/:id                # Delete tag (Admin)
```

### 💬 Comments & Social
```
GET    /api/comments                # Get all comments
GET    /api/comments/:id            # Get comment by ID
POST   /api/comments                # Create comment
PUT    /api/comments/:id            # Update comment
DELETE /api/comments/:id            # Delete comment

POST   /api/content/:id/bookmark    # Bookmark content
DELETE /api/content/:id/bookmark    # Remove bookmark
GET    /api/content/:id/bookmark-status # Check bookmark status
GET    /api/user/bookmarks          # Get user bookmarks
GET    /api/user/bookmarks/stats    # Get bookmark statistics
```

### 🔍 Search & Discovery
```
GET    /api/search                  # Search content
GET    /api/search/users            # Search users
```

### 📁 File Management
```
POST   /api/upload                  # Upload file
GET    /api/upload/:filename        # Get uploaded file
GET    /api/images/:filename        # Get image file
```

### 📊 Analytics & Monitoring
```
GET    /api/analytics-events        # Get analytics events
POST   /api/analytics-events        # Create analytics event
GET    /api/activity-logs           # Get activity logs
POST   /api/activity-logs           # Create activity log
```

### ⚙️ System & Settings
```
GET    /api/settings                # Get system settings
PUT    /api/settings                # Update settings (Admin)
GET    /api/health                  # Health check
```

### 🛠️ Admin Endpoints
```
GET    /api/admin/users             # Admin: Get all users
PUT    /api/admin/users/:id         # Admin: Update user
DELETE /api/admin/users/:id         # Admin: Delete user

GET    /api/admin/analytics         # Admin: Get analytics dashboard
GET    /api/admin/activity-logs     # Admin: Get activity logs
GET    /api/admin/settings          # Admin: Get system settings
PUT    /api/admin/settings          # Admin: Update system settings
```

## 🧪 Testing

### Backend Testing (Jest + Supertest)
```bash
cd backend

# Run all tests
npm test

# Run specific test suites
npm run test:unit              # Unit tests only
npm run test:integration       # Integration tests only
npm run test:coverage          # Coverage report
npm run test:watch             # Watch mode
```

**Test Coverage:**
- ✅ Controller tests (20+ controllers)
- ✅ Repository tests (8+ repositories) 
- ✅ Service tests (9+ services)
- ✅ Integration tests (5+ scenarios)
- ✅ Authentication & authorization
- ✅ File upload & processing
- ✅ Database operations

### Frontend Testing (Vitest + Testing Library)
```bash
cd builder-orbit-lab-main

# Run all tests
npm test

# Run specific test types
npm run test:watch             # Watch mode
npm run test:ui                # UI test runner
npm run test:coverage          # Coverage report
```

**Test Coverage:**
- ✅ Component tests (80+ components)
- ✅ Page tests (36+ pages)
- ✅ Hook tests (6+ custom hooks)
- ✅ Context tests (4+ contexts)
- ✅ Integration tests với MSW mocking

## 📚 Documentation

- 📖 [Main Documentation](./README.md) - Project overview và setup
- 🔧 [Backend Documentation](./backend/README.md) - API server details
- 🎨 [Frontend Documentation](./builder-orbit-lab-main/README.md) - React app details
- 🗄️ [Database Documentation](./DATABASE_DOCUMENTATION.md) - Schema và relationships
- 🔖 [Bookmark System](./BOOKMARK_SYSTEM.md) - Bookmark feature docs
- 💬 [Comment System](./COMMENT_SYSTEM.md) - Comment system docs
- 📊 [API Documentation](http://localhost:4000/api-docs) - Interactive Swagger UI

## 🚀 Deployment

### Development Environment
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Server: http://localhost:4000

# Terminal 2 - Frontend  
cd builder-orbit-lab-main
npm run dev
# Frontend: http://localhost:8080
```

### Production Deployment

**Backend:**
```bash
cd backend
npm start
# Production server on port 4000
```

**Frontend:**
```bash
cd builder-orbit-lab-main
npm run build
npm start
# Serves built React app
```

### Environment Configuration

**Backend (.env):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@localhost:5432/zetadb
PORT=4000
JWT_SECRET=your_super_secret_jwt_key_here
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Zeta CMS
```

### Docker Deployment
```bash
# Build và run với Docker
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure all tests pass before submitting PR

## 📊 Project Statistics

- **Backend**: 20+ API controllers, 8+ repositories, 9+ services
- **Frontend**: 36+ pages, 80+ components, 6+ custom hooks
- **Database**: 11 tables, 600+ sample records
- **Tests**: 50+ test files covering unit, integration, và E2E
- **Documentation**: Comprehensive docs cho all features

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- 📧 **Issues**: Tạo issue trên GitHub repository
- 📖 **Documentation**: Xem comprehensive docs trong project
- 🔧 **Development**: Follow setup guide trong README files
- 🐛 **Bugs**: Report bugs với detailed reproduction steps

---

**Zeta CMS** - Modern Content Management System với React + Express + PostgreSQL
