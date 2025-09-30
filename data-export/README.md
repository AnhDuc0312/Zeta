# Zeta CMS - Database Export

Thư mục này chứa dữ liệu đã xuất từ database Zeta CMS.

## 📁 Cấu trúc file

- `schema.sql` - Schema database (tables, constraints, enums)
- `00-master-import.sql` - File master để import tất cả
- `users.sql` - Dữ liệu bảng users
- `categories.sql` - Dữ liệu bảng categories  
- `tags.sql` - Dữ liệu bảng tags
- `content.sql` - Dữ liệu bảng content
- `content_tags.sql` - Dữ liệu bảng content_tags
- `comments.sql` - Dữ liệu bảng comments
- `activity_logs.sql` - Dữ liệu bảng activity_logs
- `analytics_events.sql` - Dữ liệu bảng analytics_events
- `settings.sql` - Dữ liệu bảng settings
- `user_likes.sql` - Dữ liệu bảng user_likes
- `user_views.sql` - Dữ liệu bảng user_views

## 🚀 Cách sử dụng

### Import toàn bộ dữ liệu:
```bash
psql -U postgres -d your_database -f 00-master-import.sql
```

### Import từng bảng riêng lẻ:
```bash
# Import schema trước
psql -U postgres -d your_database -f schema.sql

# Import dữ liệu theo thứ tự
psql -U postgres -d your_database -f users.sql
psql -U postgres -d your_database -f categories.sql
psql -U postgres -d your_database -f tags.sql
psql -U postgres -d your_database -f content.sql
# ... các bảng khác
```

## ⚠️ Lưu ý

1. **Thứ tự import quan trọng**: Phải import theo thứ tự dependency
2. **Schema trước**: Luôn import schema.sql trước khi import dữ liệu
3. **Kiểm tra constraints**: Đảm bảo foreign keys được tạo đúng
4. **Backup**: Luôn backup database hiện tại trước khi import

## 📊 Thống kê dữ liệu

- **Tổng số bảng**: 11
- **Tổng số bản ghi**: 623+ bản ghi
- **Dữ liệu mẫu**: Có sẵn để test và development

## 🔧 Troubleshooting

### Lỗi foreign key constraint:
- Kiểm tra thứ tự import
- Đảm bảo bảng cha được import trước bảng con

### Lỗi duplicate key:
- Xóa dữ liệu cũ trước khi import
- Hoặc sử dụng `ON CONFLICT` trong SQL

### Lỗi permission:
- Đảm bảo user có quyền CREATE, INSERT
- Kiểm tra database connection
