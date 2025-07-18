# HƯỚNG DẪN TEST THỦ CÔNG API

## 1. Auth API

### Đăng ký user mới
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"testuser@example.com","password":"test1234"}'
```

### Đăng nhập
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"testuser@example.com","password":"test1234"}'
```

### Đăng nhập sai mật khẩu
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"testuser@example.com","password":"sai123"}'
```

### Lấy profile (cần Bearer token)
```bash
curl -X GET http://localhost:4000/api/auth/profile \
  -H 'Authorization: Bearer <TOKEN>'
```

---

## 2. User/Admin User API

### Lấy danh sách user (phân trang, filter)
```bash
curl 'http://localhost:4000/api/admin/users?page=1&limit=5&role=user&status=active&search=test'
```

### Lấy chi tiết user
```bash
curl http://localhost:4000/api/admin/users/<USER_ID>
```

### Tạo user mới (admin)
```bash
curl -X POST http://localhost:4000/api/admin/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"User2","email":"user2@example.com","password":"test1234","role":"user","status":"active"}'
```

### Sửa user
```bash
curl -X PUT http://localhost:4000/api/admin/users/<USER_ID> \
  -H 'Content-Type: application/json' \
  -d '{"name":"User2 Updated","email":"user2@example.com","role":"user","status":"active"}'
```

### Xóa user
```bash
curl -X DELETE http://localhost:4000/api/admin/users/<USER_ID>
```

---

## 3. Settings API

### Lấy danh sách settings
```bash
curl http://localhost:4000/api/admin/settings?page=1&limit=5
```

### Lấy chi tiết setting
```bash
curl http://localhost:4000/api/admin/settings/<SETTING_ID>
```

### Tạo setting mới
```bash
curl -X POST http://localhost:4000/api/admin/settings \
  -H 'Content-Type: application/json' \
  -d '{"key":"site_name","value":"Builder Orbit"}'
```

### Sửa setting
```bash
curl -X PUT http://localhost:4000/api/admin/settings/<SETTING_ID> \
  -H 'Content-Type: application/json' \
  -d '{"key":"site_name","value":"Builder Orbit Updated"}'
```

### Xóa setting
```bash
curl -X DELETE http://localhost:4000/api/admin/settings/<SETTING_ID>
```

---

## 4. Search API

### Tìm kiếm nội dung
```bash
curl 'http://localhost:4000/api/search?q=node'
```

---

## 5. Upload API

### Upload file
```bash
curl -X POST http://localhost:4000/api/upload \
  -F 'file=@/path/to/your/file.txt'
```

### Upload lỗi (không có file)
```bash
curl -X POST http://localhost:4000/api/upload
```

---

## 6. Rate Limit (giới hạn request)
- Gửi quá 30 request/15 phút với các route public sẽ bị chặn (HTTP 429).

---

**Lưu ý:**
- Thay <TOKEN>, <USER_ID>, <SETTING_ID> bằng giá trị thực tế.
- Nếu API yêu cầu xác thực, thêm header `Authorization: Bearer <TOKEN>`.
- Xem thêm ví dụ test tự động trong thư mục `tests/`. 