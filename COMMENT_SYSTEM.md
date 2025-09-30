# Comment System Documentation

## Tổng quan
Hệ thống comment đã được tích hợp vào các trang chi tiết bài viết (ArticleDetail, DocumentDetail, NoteDetail) với đầy đủ chức năng CRUD và hỗ trợ nested comments (replies).

## Tính năng đã implement

### Backend
- **API Endpoints**:
  - `GET /api/comments?contentId={id}` - Lấy danh sách comment theo content ID
  - `POST /api/comments` - Tạo comment mới
  - `PUT /api/comments/{id}` - Cập nhật comment
  - `DELETE /api/comments/{id}` - Xóa comment
  - `GET /api/comments/{id}` - Lấy comment theo ID

- **Database Schema**:
  - Bảng `comments` với các cột:
    - `id` (UUID, Primary Key)
    - `content_id` (UUID, Foreign Key to content table)
    - `user_id` (UUID, Foreign Key to users table)
    - `text` (TEXT, nội dung comment)
    - `parent_id` (UUID, Foreign Key to comments table - cho nested comments)
    - `status` (ENUM: 'visible', 'hidden', 'deleted')
    - `created_at` (TIMESTAMP)
    - `updated_at` (TIMESTAMP)

- **Authentication**: Tất cả các thao tác tạo, sửa, xóa đều yêu cầu authentication

### Frontend
- **Components**:
  - `CommentSection` - Component chính chứa form và danh sách comment
  - `CommentForm` - Form để tạo/sửa comment và reply
  - `CommentList` - Hiển thị danh sách comment
  - `CommentItem` - Hiển thị từng comment với các action buttons

- **Tính năng**:
  - ✅ Tạo comment mới
  - ✅ Reply comment (nested comments)
  - ✅ Edit comment (chỉ owner)
  - ✅ Delete comment (chỉ owner)
  - ✅ Load more comments (pagination)
  - ✅ Real-time UI updates
  - ✅ Authentication required cho các thao tác
  - ✅ Responsive design

## Cách sử dụng

### 1. Cập nhật Database
Chạy script SQL để cập nhật bảng comments:
```sql
-- File: backend/update-comments-table.sql
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
```

### 2. Khởi động Backend
```bash
cd backend
npm start
```

### 3. Khởi động Frontend
```bash
cd builder-orbit-lab-main
npm run dev
```

### 4. Sử dụng
- Truy cập bất kỳ trang chi tiết bài viết nào
- Scroll xuống cuối trang để thấy phần Comments
- Đăng nhập để có thể comment
- Click "Reply" để reply comment
- Click menu 3 chấm để edit/delete comment (chỉ owner)

## API Usage Examples

### Tạo comment mới
```javascript
const response = await fetch('/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    contentId: 'content-uuid',
    body: 'This is a great article!',
    parentId: null // null for top-level comment
  }),
});
```

### Reply comment
```javascript
const response = await fetch('/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    contentId: 'content-uuid',
    body: 'I agree with you!',
    parentId: 'parent-comment-uuid'
  }),
});
```

### Edit comment
```javascript
const response = await fetch(`/api/comments/${commentId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    body: 'Updated comment text'
  }),
});
```

### Delete comment
```javascript
const response = await fetch(`/api/comments/${commentId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Cấu trúc dữ liệu

### Comment Object
```typescript
interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  text: string;
  created_at: string;
  updated_at?: string;
  status: 'visible' | 'hidden' | 'deleted';
  parent_id?: string | null;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  replies?: Comment[];
}
```

## Lưu ý
- Hệ thống comment đã được tích hợp vào tất cả các trang detail mà không thay đổi UI hiện tại
- Comment system hoạt động độc lập và không ảnh hưởng đến các chức năng khác
- Cần đảm bảo database đã được cập nhật với schema mới
- Authentication middleware đã được áp dụng cho tất cả các API endpoints

