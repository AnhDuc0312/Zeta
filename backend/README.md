# Builder Orbit Lab Backend

Express.js API server cho hệ thống quản lý nội dung Zeta, cung cấp RESTful APIs cho frontend React.

## 🏗️ Architecture

```
src/
├── controllers/        # API Controllers (Business Logic)
├── models/            # TypeScript Interfaces
├── routes/            # Express Routes
├── services/          # Business Logic Services
├── repositories/      # Data Access Layer
├── middleware/        # Express Middleware
├── db.ts             # PostgreSQL Connection
├── index.ts          # Main App Setup
└── server.ts         # Server Entry Point
```

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

### Authentication
```
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration
POST   /api/auth/logout         # User logout
GET    /api/auth/me            # Get current user
```

### Content Management
```
GET    /api/content            # Get all content
GET    /api/content/:id        # Get content by ID
POST   /api/content            # Create content
PUT    /api/content/:id        # Update content
DELETE /api/content/:id        # Delete content
```

### User Management
```
GET    /api/users              # Get all users
GET    /api/users/:id          # Get user by ID
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
```

### Categories & Tags
```
GET    /api/categories         # Get all categories
POST   /api/categories         # Create category
PUT    /api/categories/:id     # Update category
DELETE /api/categories/:id     # Delete category

GET    /api/tags              # Get all tags
POST   /api/tags              # Create tag
PUT    /api/tags/:id          # Update tag
DELETE /api/tags/:id          # Delete tag
```

### Comments
```
GET    /api/comments          # Get all comments
GET    /api/comments/:id      # Get comment by ID
POST   /api/comments          # Create comment
PUT    /api/comments/:id      # Update comment
DELETE /api/comments/:id      # Delete comment
```

### Search
```
GET    /api/search            # Search content
GET    /api/search/users      # Search users
```

### File Upload
```
POST   /api/upload            # Upload file
GET    /api/upload/:filename  # Get uploaded file
```

### Analytics
```
GET    /api/analytics-events  # Get analytics events
POST   /api/analytics-events  # Create analytics event
GET    /api/activity-logs     # Get activity logs
POST   /api/activity-logs     # Create activity log
```

### Admin Endpoints
```
GET    /api/admin/users       # Admin: Get all users
PUT    /api/admin/users/:id   # Admin: Update user
DELETE /api/admin/users/:id   # Admin: Delete user

GET    /api/admin/analytics   # Admin: Get analytics
GET    /api/admin/activity-logs # Admin: Get activity logs
GET    /api/admin/settings    # Admin: Get settings
PUT    /api/admin/settings    # Admin: Update settings
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

### Chạy Tests
  ```bash
  npm test
  ```

### Test Structure
```
tests/
├── auth.test.ts           # Authentication tests
├── user.test.ts          # User management tests
├── content.test.ts       # Content management tests
├── category.test.ts      # Category tests
├── tag.test.ts          # Tag tests
├── comment.test.ts      # Comment tests
├── search.test.ts       # Search tests
├── upload.test.ts       # File upload tests
└── activityLog.test.ts  # Activity log tests
```

### Test Commands
  ```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Coverage report
npm test auth.test.ts      # Run specific test file
```

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
npm run dev          # Development server with nodemon
npm start           # Production server
npm test           # Run tests
npm run format     # Format code with Prettier
```

### Code Structure

#### Controllers
Handle HTTP requests và responses:
```typescript
export const getContent = async (req: Request, res: Response) => {
  try {
    const content = await contentService.getAllContent();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

#### Services
Business logic layer:
```typescript
export class ContentService {
  async getAllContent(): Promise<Content[]> {
    return await contentRepository.findAll();
  }
  
  async createContent(data: CreateContentDto): Promise<Content> {
    // Validation logic
    return await contentRepository.create(data);
  }
}
```

#### Repositories
Data access layer:
```typescript
export class ContentRepository {
  async findAll(): Promise<Content[]> {
    const result = await pool.query('SELECT * FROM content');
    return result.rows;
  }
  
  async create(data: CreateContentDto): Promise<Content> {
    const query = 'INSERT INTO content (...) VALUES (...) RETURNING *';
    const result = await pool.query(query, [data.title, data.content]);
    return result.rows[0];
  }
}
```

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
PORT=4000
JWT_SECRET=...
```

### Build & Start
```bash
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## 📊 Monitoring & Logging

### Health Check
```
GET /api/health
```

### Activity Logging
- User actions được log tự động
- API requests được track
- Error logging với stack traces

### Rate Limiting
- 1000 requests per 15 minutes cho public endpoints
- Configurable limits per endpoint

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Kiểm tra DATABASE_URL
   - Đảm bảo PostgreSQL đang chạy
   - Verify database exists

2. **JWT Token Issues**
   - Kiểm tra JWT_SECRET
   - Verify token expiration
   - Check token format

3. **File Upload Issues**
   - Kiểm tra UPLOAD_DIR permissions
   - Verify file size limits
   - Check file type restrictions

### Debug Mode
```bash
DEBUG=* npm run dev
```

## 📝 License

MIT License - see LICENSE file for details.