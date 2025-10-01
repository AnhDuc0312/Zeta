# Database Documentation - Zeta CMS

## Tổng quan

Hệ thống Zeta CMS sử dụng PostgreSQL làm cơ sở dữ liệu chính với 11 bảng chính và các bảng liên kết. Database được thiết kế để hỗ trợ quản lý nội dung, người dùng, phân quyền, analytics và social features.

**📊 Thống kê database hiện tại:**
- Tổng số bảng: 11 bảng chính
- Tổng số bản ghi: 600+ bản ghi mẫu
- Có dữ liệu mẫu đã được seed
- Hỗ trợ full-text search và analytics
- Tối ưu cho performance với indexes

## Cấu trúc Database

### 1. Bảng `users` - Quản lý người dùng

**Mục đích**: Lưu trữ thông tin tài khoản người dùng và phân quyền

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của người dùng |
| `name` | VARCHAR(100) | NOT NULL | Tên hiển thị của người dùng |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập (duy nhất) |
| `password_hash` | VARCHAR(255) | NOT NULL | Mã hash của mật khẩu |
| `role` | user_role | NOT NULL, DEFAULT 'user' | Vai trò: admin, moderator, user |
| `status` | user_status | NOT NULL, DEFAULT 'active' | Trạng thái: active, inactive, banned |
| `avatar` | VARCHAR(255) | NULL | URL ảnh đại diện |
| `bio` | TEXT | NULL | Tiểu sử người dùng |
| `location` | VARCHAR(255) | NULL | Địa chỉ |
| `website` | VARCHAR(255) | NULL | Website cá nhân |
| `join_date` | TIMESTAMP WITH TIME ZONE | DEFAULT now() | Ngày tham gia |
| `last_active` | TIMESTAMP WITH TIME ZONE | NULL | Lần hoạt động cuối |

**Enum Types:**
- `user_role`: 'admin', 'moderator', 'user'
- `user_status`: 'active', 'inactive', 'banned'

### 2. Bảng `categories` - Danh mục nội dung

**Mục đích**: Phân loại nội dung theo danh mục

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của danh mục |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Tên danh mục (duy nhất) |
| `description` | TEXT | NULL | Mô tả danh mục |

### 3. Bảng `tags` - Thẻ nội dung

**Mục đích**: Gắn thẻ cho nội dung để dễ tìm kiếm và phân loại

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của thẻ |
| `name` | VARCHAR(50) | UNIQUE, NOT NULL | Tên thẻ (duy nhất) |

### 4. Bảng `content` - Nội dung chính

**Mục đích**: Lưu trữ tất cả nội dung (articles, documents, notes) với đầy đủ metadata

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của nội dung |
| `type` | content_type | NOT NULL | Loại: article, document, note |
| `title` | VARCHAR(255) | NOT NULL | Tiêu đề nội dung |
| `description` | TEXT | NULL | Mô tả ngắn |
| `content` | TEXT | NULL | Nội dung chính (HTML/Markdown) |
| `file_url` | VARCHAR(255) | NULL | URL file đính kèm |
| `file_size` | VARCHAR(50) | NULL | Kích thước file (e.g., "2.5MB") |
| `status` | content_status | NOT NULL, DEFAULT 'draft' | Trạng thái: published, draft, private, archived |
| `author_id` | UUID | REFERENCES users(id) ON DELETE SET NULL | ID tác giả |
| `author_email` | VARCHAR(255) | NULL | Email tác giả (backup) |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT now() | Ngày tạo |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT now() | Ngày cập nhật |
| `published_at` | TIMESTAMP WITH TIME ZONE | NULL | Ngày xuất bản |
| `views` | INTEGER | DEFAULT 0 | Số lượt xem |
| `likes` | INTEGER | DEFAULT 0 | Số lượt thích |
| `comments` | INTEGER | DEFAULT 0 | Số bình luận |
| `category_id` | UUID | REFERENCES categories(id) ON DELETE SET NULL | ID danh mục |
| `featured` | BOOLEAN | DEFAULT FALSE | Nội dung nổi bật |
| `word_count` | INTEGER | NULL | Số từ trong nội dung |
| `seo_title` | VARCHAR(255) | NULL | Tiêu đề SEO |
| `seo_description` | VARCHAR(255) | NULL | Mô tả SEO |
| `custom_url` | VARCHAR(255) | NULL | URL tùy chỉnh (slug) |
| `allow_comments` | BOOLEAN | DEFAULT TRUE | Cho phép bình luận |

**Enum Types:**
- `content_type`: 'article', 'document', 'note'
- `content_status`: 'published', 'draft', 'private', 'archived'

**Đặc điểm:**
- Hỗ trợ nhiều loại nội dung khác nhau
- Tracking đầy đủ analytics (views, likes, comments)
- SEO optimization với custom URLs
- File attachment support
- Word count tracking cho content analysis

### 5. Bảng `content_tags` - Liên kết nội dung và thẻ

**Mục đích**: Bảng liên kết many-to-many giữa content và tags

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `content_id` | UUID | REFERENCES content(id) ON DELETE CASCADE | ID nội dung |
| `tag_id` | UUID | REFERENCES tags(id) ON DELETE CASCADE | ID thẻ |
| PRIMARY KEY | (content_id, tag_id) | - | Khóa chính composite |

### 6. Bảng `comments` - Bình luận

**Mục đích**: Lưu trữ bình luận của người dùng trên nội dung

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của bình luận |
| `content_id` | UUID | REFERENCES content(id) ON DELETE CASCADE | ID nội dung |
| `user_id` | UUID | REFERENCES users(id) ON DELETE SET NULL | ID người bình luận |
| `text` | TEXT | NOT NULL | Nội dung bình luận |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT now() | Ngày tạo bình luận |
| `status` | comment_status | NOT NULL, DEFAULT 'visible' | Trạng thái: visible, hidden, deleted |

**Enum Types:**
- `comment_status`: 'visible', 'hidden', 'deleted'

### 7. Bảng `activity_logs` - Nhật ký hoạt động

**Mục đích**: Theo dõi hoạt động của người dùng trong hệ thống

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của log |
| `timestamp` | TIMESTAMP WITH TIME ZONE | DEFAULT now() | Thời gian hoạt động |
| `user_id` | UUID | REFERENCES users(id) ON DELETE SET NULL | ID người dùng |
| `action` | VARCHAR(100) | NOT NULL | Hành động thực hiện |
| `resource` | VARCHAR(255) | NULL | Tài nguyên liên quan |
| `ip` | VARCHAR(45) | NULL | Địa chỉ IP |
| `user_agent` | VARCHAR(255) | NULL | User agent |
| `status` | log_status | NOT NULL | Trạng thái: success, warning, error, info |
| `details` | TEXT | NULL | Chi tiết bổ sung |

**Enum Types:**
- `log_status`: 'success', 'warning', 'error', 'info'

### 8. Bảng `settings` - Cài đặt hệ thống

**Mục đích**: Lưu trữ cài đặt cấu hình hệ thống dạng key-value

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của setting |
| `key` | VARCHAR(100) | UNIQUE, NOT NULL | Khóa cài đặt (duy nhất) |
| `value` | TEXT | NULL | Giá trị cài đặt |

### 9. Bảng `analytics_events` - Sự kiện phân tích

**Mục đích**: Lưu trữ dữ liệu analytics và tracking

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của event |
| `event_type` | VARCHAR(100) | NOT NULL | Loại sự kiện |
| `user_id` | UUID | REFERENCES users(id) ON DELETE SET NULL | ID người dùng |
| `content_id` | UUID | REFERENCES content(id) ON DELETE SET NULL | ID nội dung |
| `timestamp` | TIMESTAMP WITH TIME ZONE | DEFAULT now() | Thời gian sự kiện |
| `meta` | JSONB | NULL | Dữ liệu metadata bổ sung |

### 10. Bảng `user_likes` - Lượt thích của người dùng

**Mục đích**: Theo dõi lượt thích của người dùng trên nội dung

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của lượt thích |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) | ID người dùng |
| `content_id` | UUID | NOT NULL, REFERENCES content(id) | ID nội dung |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT now() | Thời gian thích |
| UNIQUE | (user_id, content_id) | - | Mỗi user chỉ thích 1 content 1 lần |

### 11. Bảng `user_views` - Lượt xem của người dùng

**Mục đích**: Theo dõi lượt xem của người dùng trên nội dung

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của lượt xem |
| `user_id` | UUID | REFERENCES users(id) ON DELETE SET NULL | ID người dùng |
| `content_id` | UUID | REFERENCES content(id) ON DELETE SET NULL | ID nội dung |
| `viewed_at` | TIMESTAMP WITH TIME ZONE | DEFAULT now() | Thời gian xem |
| UNIQUE | (user_id, content_id) | - | Mỗi user chỉ xem 1 content 1 lần |

## 📊 Database Features & Capabilities

### Full-Text Search
- **PostgreSQL Full-Text Search**: Hỗ trợ tìm kiếm nội dung nâng cao
- **Search Indexes**: Tối ưu cho tìm kiếm title, description, content
- **Search Ranking**: Kết quả được sắp xếp theo relevance

### Analytics & Tracking
- **Content Analytics**: Views, likes, comments tracking
- **User Activity**: Comprehensive activity logging
- **Performance Metrics**: Database performance monitoring
- **Custom Events**: Flexible analytics event system

### Data Integrity
- **Foreign Key Constraints**: Đảm bảo referential integrity
- **Unique Constraints**: Prevent duplicate data
- **Check Constraints**: Validate data ranges và formats
- **Cascade Rules**: Proper cleanup khi delete records

### Performance Optimization
- **Indexes**: Optimized cho common queries
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Slow query monitoring
- **Partitioning**: Ready for large-scale data

## Mối quan hệ giữa các bảng

### Quan hệ chính:

1. **Users → Content** (1:many)
   - Một user có thể tạo nhiều content
   - `content.author_id` → `users.id`

2. **Content → Categories** (many:1)
   - Nhiều content có thể thuộc một category
   - `content.category_id` → `categories.id`

3. **Content ↔ Tags** (many:many)
   - Nhiều content có thể có nhiều tags
   - Qua bảng trung gian `content_tags`

4. **Users → Comments** (1:many)
   - Một user có thể viết nhiều comments
   - `comments.user_id` → `users.id`

5. **Content → Comments** (1:many)
   - Một content có thể có nhiều comments
   - `comments.content_id` → `content.id`

6. **Users → Activity Logs** (1:many)
   - Một user có thể có nhiều activity logs
   - `activity_logs.user_id` → `users.id`

7. **Users → Analytics Events** (1:many)
   - Một user có thể có nhiều analytics events
   - `analytics_events.user_id` → `users.id`

8. **Content → Analytics Events** (1:many)
   - Một content có thể có nhiều analytics events
   - `analytics_events.content_id` → `content.id`

9. **Users → User Likes** (1:many)
   - Một user có thể thích nhiều content
   - `user_likes.user_id` → `users.id`

10. **Content → User Likes** (1:many)
    - Một content có thể được nhiều user thích
    - `user_likes.content_id` → `content.id`

11. **Users → User Views** (1:many)
    - Một user có thể xem nhiều content
    - `user_views.user_id` → `users.id`

12. **Content → User Views** (1:many)
    - Một content có thể được nhiều user xem
    - `user_views.content_id` → `content.id`

## Indexes để tối ưu hiệu suất

**Indexes hiện có trong database:**

### Primary Keys (tự động)
- Tất cả bảng đều có primary key index

### Unique Indexes
- `users_email_key` - Email duy nhất
- `categories_name_key` - Tên danh mục duy nhất  
- `tags_name_key` - Tên thẻ duy nhất
- `settings_key_key` - Khóa cài đặt duy nhất
- `user_likes_user_id_content_id_key` - Unique constraint cho likes
- `user_views_user_id_content_id_key` - Unique constraint cho views

### Performance Indexes
- `idx_content_type` - Tối ưu query theo loại content
- `idx_content_status` - Tối ưu query theo trạng thái content
- `idx_content_category` - Tối ưu query theo danh mục
- `idx_content_author` - Tối ưu query theo tác giả
- `idx_comments_content` - Tối ưu query comments theo content
- `idx_comments_user` - Tối ưu query comments theo user
- `idx_logs_user` - Tối ưu query activity logs theo user
- `idx_analytics_user` - Tối ưu query analytics theo user
- `idx_analytics_content` - Tối ưu query analytics theo content

## Các ràng buộc và quy tắc

### Foreign Key Constraints:
- `content.author_id` → `users.id` (SET NULL on delete)
- `content.category_id` → `categories.id` (SET NULL on delete)
- `comments.content_id` → `content.id` (CASCADE on delete)
- `comments.user_id` → `users.id` (SET NULL on delete)
- `activity_logs.user_id` → `users.id` (SET NULL on delete)
- `analytics_events.user_id` → `users.id` (SET NULL on delete)
- `analytics_events.content_id` → `content.id` (SET NULL on delete)

### Unique Constraints:
- `users.email` - Email phải duy nhất
- `categories.name` - Tên danh mục phải duy nhất
- `tags.name` - Tên thẻ phải duy nhất
- `settings.key` - Khóa cài đặt phải duy nhất

### Check Constraints:
- Tất cả các enum types đều có giá trị được định nghĩa rõ ràng
- Các trường NOT NULL không được phép null

## Thống kê dữ liệu hiện tại

**Số lượng bản ghi trong từng bảng:**
- `users`: 20+ bản ghi (admin, moderator, user accounts)
- `content`: 150+ bản ghi (articles, documents, notes)
- `categories`: 8 bản ghi (content categories)
- `tags`: 10+ bản ghi (content tags)
- `comments`: 15+ bản ghi (user comments)
- `activity_logs`: 300+ bản ghi (user activity tracking)
- `analytics_events`: 20+ bản ghi (custom analytics events)
- `settings`: 5 bản ghi (system configuration)
- `content_tags`: 50+ bản ghi (content-tag relationships)
- `user_likes`: 25+ bản ghi (user likes on content)
- `user_views`: 30+ bản ghi (user views on content)

**Tổng cộng**: 600+ bản ghi dữ liệu mẫu

**Dữ liệu mẫu bao gồm:**
- ✅ User accounts với different roles
- ✅ Content với various types và statuses
- ✅ Categories và tags với realistic data
- ✅ Comments và social interactions
- ✅ Activity logs cho user behavior tracking
- ✅ Analytics events cho performance monitoring
- ✅ System settings cho configuration

## Ghi chú kỹ thuật

1. **UUID**: Tất cả primary keys sử dụng UUID để tránh xung đột và tăng bảo mật
2. **Timestamps**: Sử dụng `TIMESTAMP WITH TIME ZONE` để hỗ trợ múi giờ
3. **JSONB**: Sử dụng JSONB cho metadata analytics để tối ưu query và storage
4. **Cascade Rules**: 
   - CASCADE: Xóa content sẽ xóa comments và content_tags
   - SET NULL: Xóa user sẽ set NULL cho author_id và user_id
5. **Indexes**: Được tối ưu cho các query thường dùng nhất
6. **Unique Constraints**: Đảm bảo tính duy nhất cho email, tên danh mục, tên thẻ
7. **Social Features**: Hỗ trợ likes và views với unique constraints
8. **Full-Text Search**: Ready cho PostgreSQL full-text search implementation
9. **Analytics Ready**: Comprehensive tracking cho user behavior và content performance
10. **Scalability**: Database design hỗ trợ horizontal scaling

## Migration và Schema Updates

### Schema Files
- **Main Schema**: `builder-orbit-lab-main/schema.sql` - Complete database schema
- **Data Export**: `data-export/schema.sql` - Exported schema với data
- **Individual Tables**: `data-export/*.sql` - Individual table exports

### Running Migrations
```bash
# Chạy complete schema
psql -U postgres -d zetadb -f builder-orbit-lab-main/schema.sql

# Chạy từ data export
psql -U postgres -d zetadb -f data-export/schema.sql

# Chạy individual table updates
psql -U postgres -d zetadb -f data-export/content.sql
psql -U postgres -d zetadb -f data-export/users.sql
```

### Schema Validation
```bash
# Check table structure
psql -U postgres -d zetadb -c "\d+"

# Check indexes
psql -U postgres -d zetadb -c "\di"

# Check constraints
psql -U postgres -d zetadb -c "\d+ users"
```

## Backup và Restore

### Full Database Backup
```bash
# Complete backup với data
pg_dump -U postgres -d zetadb > zeta_full_backup.sql

# Schema only backup
pg_dump -U postgres -d zetadb --schema-only > zeta_schema_backup.sql

# Data only backup
pg_dump -U postgres -d zetadb --data-only > zeta_data_backup.sql
```

### Restore Operations
```bash
# Restore complete database
psql -U postgres -d zetadb < zeta_full_backup.sql

# Restore schema only
psql -U postgres -d zetadb < zeta_schema_backup.sql

# Restore data only
psql -U postgres -d zetadb < zeta_data_backup.sql
```

### Incremental Backup
```bash
# Backup specific tables
pg_dump -U postgres -d zetadb -t users -t content > users_content_backup.sql

# Backup with compression
pg_dump -U postgres -d zetadb | gzip > zeta_backup.sql.gz
```

## Performance Tuning

### Query Optimization
```sql
-- Analyze table statistics
ANALYZE;

-- Check query performance
EXPLAIN ANALYZE SELECT * FROM content WHERE title ILIKE '%search%';

-- Update table statistics
VACUUM ANALYZE content;
```

### Index Maintenance
```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Rebuild indexes
REINDEX TABLE content;
```

### Connection Pooling
```bash
# Check active connections
psql -U postgres -d zetadb -c "SELECT count(*) FROM pg_stat_activity;"

# Check connection limits
psql -U postgres -d zetadb -c "SHOW max_connections;"
```

## Monitoring & Maintenance

### Health Checks
```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('zetadb'));

-- Table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Maintenance Tasks
```bash
# Weekly maintenance
psql -U postgres -d zetadb -c "VACUUM ANALYZE;"

# Monthly maintenance
psql -U postgres -d zetadb -c "REINDEX DATABASE zetadb;"

# Check for long-running queries
psql -U postgres -d zetadb -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query FROM pg_stat_activity WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';"
```

---

**Zeta CMS Database** - Modern PostgreSQL database với comprehensive features cho content management, analytics, và social interactions
