# Bookmark APIs - Implementation Guide

## 📋 APIs cần tạo

### 1. **POST /api/content/{id}/bookmark**
```typescript
// Thêm content vào bookmark
POST /api/content/{id}/bookmark
Headers: Authorization: Bearer {token}
Response: { success: true, message: "Content bookmarked" }
```

### 2. **DELETE /api/content/{id}/bookmark**
```typescript
// Xóa content khỏi bookmark
DELETE /api/content/{id}/bookmark
Headers: Authorization: Bearer {token}
Response: { success: true, message: "Bookmark removed" }
```

### 3. **GET /api/content/{id}/bookmark-status**
```typescript
// Kiểm tra trạng thái bookmark
GET /api/content/{id}/bookmark-status
Headers: Authorization: Bearer {token}
Response: { isBookmarked: boolean }
```

### 4. **GET /api/user/bookmarks**
```typescript
// Lấy danh sách bookmarks của user
GET /api/user/bookmarks?page=1&limit=20&type=all
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  data: [
    {
      id: "bookmark-uuid",
      content_id: "content-uuid",
      content: {
        id: "content-uuid",
        title: "Article Title",
        description: "Description",
        type: "article|document|note",
        author: "Author Name",
        created_at: "2024-01-01T00:00:00Z",
        views: 100,
        likes: 10,
        category: "Technology"
      },
      bookmarked_at: "2024-01-01T00:00:00Z"
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 50,
    totalPages: 3
  }
}
```

### 5. **GET /api/user/bookmarks/stats**
```typescript
// Thống kê bookmarks
GET /api/user/bookmarks/stats
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  data: {
    total: 50,
    articles: 20,
    documents: 15,
    notes: 15,
    recent: 5 // bookmarks trong 7 ngày qua
  }
}
```

## 🗄️ Database Schema

### Bảng `user_bookmarks`
```sql
CREATE TABLE user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, content_id)
);

-- Indexes
CREATE INDEX idx_user_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX idx_user_bookmarks_content ON user_bookmarks(content_id);
CREATE INDEX idx_user_bookmarks_date ON user_bookmarks(bookmarked_at DESC);
```

## 🔧 Implementation Steps

### 1. **Database Migration**
- Tạo bảng `user_bookmarks`
- Thêm indexes cho performance

### 2. **Backend Controllers**
- `bookmarkController.ts` - xử lý bookmark logic
- `userController.ts` - thêm endpoints cho user bookmarks

### 3. **Backend Services**
- `bookmarkService.ts` - business logic
- `userService.ts` - thêm bookmark methods

### 4. **Backend Routes**
- `/api/content/:id/bookmark` - POST/DELETE
- `/api/content/:id/bookmark-status` - GET
- `/api/user/bookmarks` - GET
- `/api/user/bookmarks/stats` - GET

### 5. **Frontend Pages**
- `Bookmarks.tsx` - trang hiển thị bookmarks
- Cập nhật `Account.tsx` - thêm bookmark section
- Cập nhật `Layout.tsx` - thêm navigation link

### 6. **Frontend Components**
- `BookmarkCard.tsx` - component hiển thị bookmark item
- `BookmarkFilters.tsx` - filter theo type, date
- `BookmarkStats.tsx` - hiển thị thống kê

## 📱 Frontend Features

### **Bookmarks Page Features:**
- Grid layout (3-4 columns như các trang khác)
- Filter by type (All, Articles, Documents, Notes)
- Sort by date (Newest, Oldest)
- Search trong bookmarks
- Pagination
- Bulk actions (Remove multiple bookmarks)
- Quick preview modal

### **Account Page Integration:**
- Bookmark stats widget
- Recent bookmarks preview
- Quick access button to full bookmarks page

### **Navigation Integration:**
- Bookmark count badge
- Quick bookmark access
- Recent bookmarks dropdown

## 🎨 UI/UX Considerations

### **Bookmark Card Design:**
- Content type icon
- Title và description
- Author và date
- Quick actions (View, Remove)
- Content type badge

### **Empty States:**
- "No bookmarks yet" illustration
- Call-to-action để explore content
- Tips về cách bookmark

### **Loading States:**
- Skeleton cards
- Loading spinners
- Progressive loading

## 🚀 Priority Implementation

### **Phase 1 (Core):**
1. Database schema
2. Basic bookmark APIs
3. Bookmarks page
4. Account page integration

### **Phase 2 (Enhanced):**
1. Search và filters
2. Bulk actions
3. Stats dashboard
4. Navigation integration

### **Phase 3 (Advanced):**
1. Bookmark collections
2. Export bookmarks
3. Bookmark sharing
4. Analytics
