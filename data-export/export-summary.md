# Zeta CMS - Database Export Summary

## 📊 Thống kê xuất dữ liệu

**Thời gian xuất**: 2025-09-29T03:46:03.448Z

### ✅ Các bảng đã xuất thành công:

| Bảng | Số bản ghi | File | Trạng thái |
|------|------------|------|------------|
| `users` | 23 | `users.sql` | ✅ Thành công |
| `categories` | 8 | `categories.sql` | ✅ Thành công |
| `tags` | 11 | `tags.sql` | ✅ Thành công |
| `content` | 172 | `content.sql` | ✅ Thành công |
| `comments` | 13 | `comments.sql` | ✅ Thành công |
| `activity_logs` | 364 | `activity_logs.sql` | ✅ Thành công |
| `analytics_events` | 10 | `analytics_events.sql` | ✅ Thành công |
| `settings` | 5 | `settings.sql` | ✅ Thành công |
| `user_likes` | 5 | `user_likes.sql` | ✅ Thành công |
| `user_views` | 12 | `user_views.sql` | ✅ Thành công |

### ⚠️ Các bảng không có dữ liệu:

| Bảng | File | Lý do |
|------|------|-------|
| `content_tags` | `content_tags.sql` | Không có dữ liệu (sử dụng cột `tags` JSONB thay thế) |

## 📁 Cấu trúc file export

```
data-export/
├── 00-master-import.sql      # File master để import tất cả
├── schema.sql                # Schema database (tables, constraints, enums)
├── README.md                 # Hướng dẫn sử dụng
├── export-summary.md         # Báo cáo này
├── users.sql                 # 23 bản ghi
├── categories.sql            # 8 bản ghi
├── tags.sql                  # 11 bản ghi
├── content.sql               # 172 bản ghi
├── content_tags.sql          # 0 bản ghi (trống)
├── comments.sql              # 13 bản ghi
├── activity_logs.sql         # 364 bản ghi
├── analytics_events.sql      # 10 bản ghi
├── settings.sql              # 5 bản ghi
├── user_likes.sql            # 5 bản ghi
└── user_views.sql            # 12 bản ghi
```

## 🎯 Tổng kết

- **Tổng số bảng**: 11
- **Bảng có dữ liệu**: 10
- **Bảng trống**: 1 (`content_tags`)
- **Tổng số bản ghi**: 623 bản ghi
- **Kích thước ước tính**: ~2-3 MB

## 🚀 Cách sử dụng

### 1. Import toàn bộ (Khuyến nghị):
```bash
psql -U postgres -d your_database -f 00-master-import.sql
```

### 2. Import từng bước:
```bash
# Bước 1: Tạo schema
psql -U postgres -d your_database -f schema.sql

# Bước 2: Import dữ liệu theo thứ tự
psql -U postgres -d your_database -f users.sql
psql -U postgres -d your_database -f categories.sql
psql -U postgres -d your_database -f tags.sql
psql -U postgres -d your_database -f content.sql
psql -U postgres -d your_database -f comments.sql
psql -U postgres -d your_database -f activity_logs.sql
psql -U postgres -d your_database -f analytics_events.sql
psql -U postgres -d your_database -f settings.sql
psql -U postgres -d your_database -f user_likes.sql
psql -U postgres -d your_database -f user_views.sql
```

## ⚠️ Lưu ý quan trọng

1. **Thứ tự import**: Phải import theo đúng thứ tự dependency
2. **Schema trước**: Luôn import `schema.sql` trước khi import dữ liệu
3. **Backup**: Luôn backup database hiện tại trước khi import
4. **Content_tags**: Bảng này trống vì hệ thống sử dụng cột `tags` JSONB trong bảng `content`
5. **Foreign Keys**: Đảm bảo tất cả foreign key constraints được tạo đúng

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **Foreign key constraint fails**:
   - Kiểm tra thứ tự import
   - Đảm bảo bảng cha được import trước

2. **Duplicate key error**:
   - Xóa dữ liệu cũ trước khi import
   - Hoặc sử dụng `ON CONFLICT DO NOTHING`

3. **Permission denied**:
   - Đảm bảo user có quyền CREATE, INSERT
   - Kiểm tra database connection

## 📞 Hỗ trợ

Nếu gặp vấn đề khi import dữ liệu, hãy kiểm tra:
1. Logs của PostgreSQL
2. Thứ tự import các file
3. Quyền truy cập database
4. Cấu hình connection string
