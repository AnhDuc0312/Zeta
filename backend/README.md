# Zeta CMS Backend API

Express.js API server cho hệ thống quản lý nội dung Zeta CMS, cung cấp RESTful APIs với PostgreSQL database và comprehensive testing suite.

## 🏗️ Architecture

```
src/
├── controllers/        # API Controllers (20+ controllers)
│   ├── authController.ts           # Authentication & authorization
│   ├── userController.ts           # User management
│   ├── contentController.ts        # Content CRUD operations
│   ├── categoryController.ts       # Category management
│   ├── tagController.ts           # Tag management
│   ├── commentController.ts        # Comment system
│   ├── searchController.ts         # Search functionality
│   ├── uploadController.ts         # File upload handling
│   ├── imageController.ts          # Image processing & serving
│   ├── bookmarkController.ts       # Bookmark system
│   ├── activityLogController.ts    # Activity logging
│   ├── analyticsEventController.ts # Analytics tracking
│   ├── settingController.ts        # System settings
│   ├── accountController.ts        # Account management
│   ├── healthController.ts         # Health checks
│   └── admin*.ts                   # Admin-specific controllers
├── models/            # TypeScript Interfaces & Types
│   ├── User.ts                    # User model
│   ├── Content.ts                 # Content model
│   ├── Category.ts                # Category model
│   ├── Tag.ts                     # Tag model
│   ├── Comment.ts                 # Comment model
│   ├── ActivityLog.ts             # Activity log model
│   ├── AnalyticsEvent.ts          # Analytics model
│   └── Setting.ts                 # Setting model
├── routes/            # Express Route Handlers (20+ routes)
│   ├── auth.ts                   # Authentication routes
│   ├── users.ts                  # User management routes
│   ├── content.ts                # Content routes
│   ├── categories.ts              # Category routes
│   ├── tags.ts                   # Tag routes
│   ├── comments.ts               # Comment routes
│   ├── search.ts                 # Search routes
│   ├── upload.ts                 # Upload routes
│   ├── bookmarks.ts              # Bookmark routes
│   ├── activityLogs.ts           # Activity log routes
│   ├── analyticsEvents.ts        # Analytics routes
│   ├── settings.ts               # Settings routes
│   ├── account.ts                # Account routes
│   ├── health.ts                 # Health check routes
│   └── admin*.ts                 # Admin routes
├── services/          # Business Logic Services (9+ services)
│   ├── authService.ts            # Authentication logic
│   ├── userService.ts            # User business logic
│   ├── contentService.ts         # Content business logic
│   ├── searchService.ts          # Search functionality
│   ├── uploadService.ts          # File upload logic
│   ├── imageService.ts           # Image processing
│   ├── bookmarkService.ts        # Bookmark logic
│   ├── activityLogService.ts     # Activity logging
│   └── analyticsService.ts       # Analytics processing
├── repositories/      # Data Access Layer (8+ repositories)
│   ├── userRepository.ts         # User data access
│   ├── contentRepository.ts      # Content data access
│   ├── categoryRepository.ts     # Category data access
│   ├── tagRepository.ts          # Tag data access
│   ├── commentRepository.ts      # Comment data access
│   ├── activityLogRepository.ts  # Activity log data access
│   ├── analyticsEventRepository.ts # Analytics data access
│   └── settingRepository.ts      # Setting data access
├── middleware/        # Express Middleware
│   ├── authMiddleware.ts         # JWT authentication
│   ├── adminMiddleware.ts        # Admin authorization
│   └── errorHandler.ts           # Global error handling
├── types/             # TypeScript Type Definitions
│   └── express/                   # Express type extensions
├── scripts/           # Database & Utility Scripts
│   └── seedMockData.ts           # Database seeding
├── db.ts              # PostgreSQL Connection Pool
├── index.ts           # Main Application Setup
├── server.ts          # Server Entry Point
└── swagger.ts         # API Documentation Setup
```

## 🔧 Tech Stack

### Core Technologies
- **Node.js 18+** - JavaScript runtime với ES modules
- **Express.js 4.18+** - Web framework với CORS support
- **TypeScript 5.8+** - Full type safety throughout
- **PostgreSQL** - Primary database với pg driver
- **JWT (jsonwebtoken)** - Authentication & authorization

### Database & Data Processing
- **pg 8.11+** - PostgreSQL client driver
- **Sharp 0.34+** - Image processing & optimization
- **bcrypt 5.1+** - Password hashing
- **uuid 9.0+** - UUID generation

### API & Validation
- **Express-validator 7.2+** - Input validation
- **Express-rate-limit 7.5+** - Rate limiting
- **Multer 2.0+** - File upload handling
- **CORS 2.8+** - Cross-origin resource sharing

### Documentation & Testing
- **Swagger UI 5.0+** - Interactive API documentation
- **Swagger JSDoc 6.2+** - API documentation generation
- **Jest 30.2+** - Testing framework
- **Supertest 7.1+** - HTTP assertion testing
- **ts-jest 29.4+** - TypeScript testing support

### Development Tools
- **Nodemon 3.0+** - Development server với hot reload
- **tsx 4.20+** - TypeScript execution
- **Prettier 3.6+** - Code formatting
- **ESLint 9.31+** - Code linting với TypeScript support
- **ts-node 10.9+** - TypeScript execution

## 🚀 Quick Start

### 1. Cài đặt Dependencies

```bash
npm install
```

### 2. Cấu hình Environment

Tạo file `.env`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/zetadb

# Server
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# File Upload
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760
```

### 3. Setup Database

```bash
# Tạo database
psql -U postgres -c "CREATE DATABASE zetadb;"

# Chạy schema
psql -U postgres -d zetadb -f ../builder-orbit-lab-main/schema.sql

# Seed mock data (optional)
npm run seed
```

### 4. Chạy Development Server

  ```bash
npm run dev
```

Server sẽ chạy trên `http://localhost:4000`

## 📊 Database Schema

### Core Tables

- **users** - User accounts và profiles
- **content** - Articles, documents, notes
- **categories** - Content categories
- **tags** - Content tags
- **comments** - User comments
- **activity_logs** - User activity tracking
- **analytics_events** - Analytics data
- **settings** - System settings

### Key Relationships

- Users → Content (1:many)
- Content → Categories (many:many)
- Content → Tags (many:many)
- Users → Comments (1:many)
- Content → Comments (1:many)

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

## 🔐 Authentication & Authorization

### JWT Authentication
- Access tokens với expiration time
- Refresh token mechanism
- Role-based access control (admin, moderator, user)

### Middleware
- `authMiddleware` - Verify JWT tokens
- `adminMiddleware` - Check admin permissions
- `errorHandler` - Global error handling
- `rateLimit` - API rate limiting

### User Roles
- **admin**: Full system access
- **moderator**: Content management
- **user**: Basic user features

## 📁 File Upload

### Supported Formats
- Images: jpg, jpeg, png, gif, webp
- Documents: pdf, doc, docx, txt
- Archives: zip, rar

### Upload Configuration
```typescript
const upload = multer({
  dest: process.env.UPLOAD_DIR || './public/uploads',
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760')
  },
  fileFilter: (req, file, cb) => {
    // File type validation
  }
});
```

## 🧪 Testing

### Test Commands
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit              # Unit tests only
npm run test:integration       # Integration tests only
npm run test:coverage          # Coverage report
npm run test:watch             # Watch mode
npm run test:ci                # CI mode

# Run specific test files
npm test auth.test.ts          # Authentication tests
npm test content.test.ts       # Content tests
npm test user.test.ts          # User tests
```

### Test Structure
```
tests/
├── controllers/           # Controller Tests (20+ controllers)
│   ├── authController.test.ts
│   ├── contentController.test.ts
│   └── userController.test.ts
├── repositories/          # Repository Tests (8+ repositories)
│   ├── contentRepository.test.ts
│   └── userRepository.test.ts
├── services/              # Service Tests (9+ services)
│   └── imageService.test.ts
├── integration/           # Integration Tests (5+ scenarios)
│   ├── auth.integration.test.ts
│   ├── content.integration.test.ts
│   └── user.integration.test.ts
├── auth.test.ts           # Authentication tests
├── user.test.ts          # User management tests
├── content.test.ts       # Content management tests
├── category.test.ts      # Category tests
├── tag.test.ts          # Tag tests
├── comment.test.ts      # Comment tests
├── search.test.ts       # Search tests
├── upload.test.ts       # File upload tests
├── activityLog.test.ts  # Activity log tests
├── analyticsEvent.test.ts # Analytics tests
├── settings.test.ts     # Settings tests
├── comprehensive.test.ts # Comprehensive integration tests
└── simple.test.ts       # Basic functionality tests
```

### Test Coverage
- ✅ **Controller Tests**: 20+ controllers với full CRUD operations
- ✅ **Repository Tests**: 8+ repositories với database operations
- ✅ **Service Tests**: 9+ services với business logic
- ✅ **Integration Tests**: 5+ end-to-end scenarios
- ✅ **Authentication Tests**: Login, register, JWT validation
- ✅ **File Upload Tests**: Image processing, file validation
- ✅ **Database Tests**: Connection, queries, transactions
- ✅ **API Tests**: HTTP endpoints, error handling

## 📚 API Documentation

Swagger UI available at: `http://localhost:4000/api-docs`

### API Response Format
```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔧 Development

### Scripts
```bash
# Development
npm run dev              # Development server với nodemon
npm start               # Production server
npm run format          # Format code với Prettier

# Testing
npm test                # Run all tests
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage   # Coverage report
npm run test:watch      # Watch mode
npm run test:ci         # CI mode

# Database
npm run seed            # Seed mock data
```

### Code Structure & Patterns

#### Controllers (Request/Response Layer)
Handle HTTP requests và responses với validation:
```typescript
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ContentService } from '../services/contentService';

export const getContent = async (req: Request, res: Response) => {
  try {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { page = 1, limit = 10, type, category, search } = req.query;
    const content = await ContentService.getAllContent({
      page: Number(page),
      limit: Number(limit),
      type: type as string,
      category: category as string,
      search: search as string
    });

    res.json({ 
      success: true, 
      data: content,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: content.length
      }
    });
  } catch (error) {
    console.error('Error in getContent:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};
```

#### Services (Business Logic Layer)
Business logic với validation và error handling:
```typescript
import { ContentRepository } from '../repositories/contentRepository';
import { Content, CreateContentDto, UpdateContentDto } from '../models/Content';
import { validateContent } from '../validators/contentValidator';

export class ContentService {
  static async getAllContent(filters?: ContentFilters): Promise<Content[]> {
    try {
      return await ContentRepository.findAll(filters);
    } catch (error) {
      console.error('Error in ContentService.getAllContent:', error);
      throw new Error('Failed to fetch content');
    }
  }
  
  static async createContent(data: CreateContentDto, userId: string): Promise<Content> {
    // Validation
    const validation = validateContent(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Business logic
    const contentData = {
      ...data,
      author_id: userId,
      created_at: new Date(),
      updated_at: new Date()
    };

    return await ContentRepository.create(contentData);
  }

  static async updateContent(id: string, data: UpdateContentDto, userId: string): Promise<Content> {
    // Check ownership or admin
    const existingContent = await ContentRepository.findById(id);
    if (!existingContent) {
      throw new Error('Content not found');
    }

    if (existingContent.author_id !== userId && !req.user?.isAdmin) {
      throw new Error('Unauthorized to update this content');
    }

    return await ContentRepository.update(id, data);
  }
}
```

#### Repositories (Data Access Layer)
Database operations với connection pooling:
```typescript
import pool from '../db';
import { Content, CreateContentDto, ContentFilters } from '../models/Content';

export class ContentRepository {
  static async findAll(filters?: ContentFilters): Promise<Content[]> {
    let query = `
      SELECT c.*, u.name as author_name, cat.name as category_name
      FROM content c
      LEFT JOIN users u ON c.author_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (filters?.type) {
      query += ` AND c.type = $${++paramCount}`;
      params.push(filters.type);
    }

    if (filters?.category) {
      query += ` AND c.category_id = $${++paramCount}`;
      params.push(filters.category);
    }

    if (filters?.search) {
      query += ` AND (c.title ILIKE $${++paramCount} OR c.description ILIKE $${++paramCount})`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ` ORDER BY c.created_at DESC`;

    if (filters?.limit) {
      query += ` LIMIT $${++paramCount}`;
      params.push(filters.limit);
    }

    if (filters?.offset) {
      query += ` OFFSET $${++paramCount}`;
      params.push(filters.offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }
  
  static async create(data: CreateContentDto): Promise<Content> {
    const query = `
      INSERT INTO content (title, description, content, type, author_id, category_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.content,
      data.type,
      data.author_id,
      data.category_id,
      data.status || 'draft'
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}
```

#### Middleware (Cross-cutting Concerns)
```typescript
// authMiddleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// adminMiddleware.ts
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};
```

## 🚀 Production Deployment

### Environment Variables
```env
# Production Configuration
NODE_ENV=production
DATABASE_URL=postgresql://username:password@localhost:5432/zetadb
PORT=4000
JWT_SECRET=your_super_secret_jwt_key_here

# File Upload
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# CORS
CORS_ORIGIN=https://yourdomain.com
```

### Build & Start
```bash
# Install production dependencies
npm ci --only=production

# Start production server
npm start

# Or with PM2 for process management
pm2 start src/server.ts --name "zeta-api"
pm2 save
pm2 startup
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/zetadb
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - db
    volumes:
      - ./public/uploads:/app/public/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=zetadb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 📊 Monitoring & Logging

### Health Check
```bash
# Basic health check
GET /api/health

# Response
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "memory": {
    "used": "45MB",
    "total": "128MB"
  }
}
```

### Activity Logging
- **User Actions**: Login, logout, content creation, updates
- **API Requests**: All endpoints với response times
- **Error Logging**: Stack traces với context
- **Database Queries**: Slow query logging
- **File Operations**: Upload, download, delete events

### Rate Limiting
```typescript
// Rate limiting configuration
const rateLimits = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 },      // 5 attempts per 15 min
  upload: { windowMs: 60 * 1000, max: 10 },        // 10 uploads per minute
  api: { windowMs: 15 * 60 * 1000, max: 1000 },    // 1000 requests per 15 min
  search: { windowMs: 60 * 1000, max: 100 }        // 100 searches per minute
};
```

### Performance Monitoring
- **Response Times**: Track API endpoint performance
- **Database Performance**: Query execution times
- **Memory Usage**: Monitor memory consumption
- **Error Rates**: Track error frequency và types

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database status
   sudo systemctl status postgresql
   
   # Test connection
   psql -U postgres -d zetadb -c "SELECT 1;"
   
   # Check environment variables
   echo $DATABASE_URL
   ```

2. **JWT Token Issues**
   ```bash
   # Verify JWT_SECRET is set
   echo $JWT_SECRET
   
   # Test token generation
   node -e "console.log(require('jsonwebtoken').sign({test: true}, process.env.JWT_SECRET))"
   ```

3. **File Upload Issues**
   ```bash
   # Check upload directory permissions
   ls -la public/uploads/
   chmod 755 public/uploads/
   
   # Verify file size limits
   echo $MAX_FILE_SIZE
   ```

4. **Port Already in Use**
   ```bash
   # Find process using port 4000
   lsof -i :4000
   
   # Kill process
   kill -9 <PID>
   ```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Enable specific debug namespaces
DEBUG=express:*,app:* npm run dev

# Production debugging
NODE_ENV=production DEBUG=app:* npm start
```

### Performance Debugging
```bash
# Memory usage
node --inspect src/server.ts

# Database query analysis
# Add to your queries:
EXPLAIN ANALYZE SELECT * FROM content WHERE title ILIKE '%search%';
```

## 📚 Resources

### Core Technologies
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io/) - JWT debugging tool

### Testing & Development
- [Jest Documentation](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Deployment & Monitoring
- [PM2 Process Manager](https://pm2.keymetrics.io/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

## 📝 License

MIT License - see LICENSE file for details.

---

**Zeta CMS Backend API** - Modern Express.js API với TypeScript, PostgreSQL, và comprehensive testing