# Builder Orbit Lab Backend

## 1. Giới thiệu

Đây là project backend RESTful API cho hệ thống quản lý nội dung, người dùng, phân quyền, analytics, upload, v.v.
- **Ngôn ngữ:** TypeScript (Node.js, Express)
- **Database:** PostgreSQL
- **Kiến trúc:** Service/Repository, chuẩn hóa code, test, bảo mật, phân trang, validate input, rate limit, JWT Auth.

---

## 2. Cài đặt & Khởi động

### 2.1. Yêu cầu
- Node.js >= 18 (khuyến nghị Node 20+)
- PostgreSQL >= 13
- npm >= 8

### 2.2. Clone & Cài đặt
```bash
git clone <repo-url>
cd builder-orbit-lab-main/backend
npm install
```

### 2.3. Cấu hình biến môi trường

Tạo file `.env` (hoặc copy từ `.env.example` nếu có):

```env
DATABASE_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
PORT=4000
NODE_ENV=development
```

### 2.4. Khởi động server

```bash
npm run dev      # Chạy dev (hot reload)
npm start        # Chạy production
```
Server mặc định chạy ở `http://localhost:4000`

---

## 3. Database & Seed dữ liệu

- Kết nối DB qua biến `DATABASE_URL`.
- Đã có script seed dữ liệu mock, tự động chuyển đổi id sang UUID, đồng bộ liên kết.
- Để seed lại dữ liệu:
  ```bash
  npm run seed
  ```
- Đảm bảo đã tạo các bảng, cột (xem migration hoặc schema mẫu).

---

## 4. Test tự động

- Sử dụng Jest + Supertest.
- Chạy toàn bộ test:
  ```bash
  npm test
  ```
- Đã có test cho: auth, user, content, search, upload, settings, category, tag, comment, activity log, analytics event, các case lỗi, bảo mật, rate limit.

---

## 5. Chuẩn hóa code & format

- **Chỉ dùng Prettier để format code:**
  ```bash
  npm run format
  ```
- Không dùng ESLint nâng cao (tương thích tốt với ESM, Node 20+).

---

## 6. Bảo mật

- **JWT Auth:** Đăng nhập, xác thực, phân quyền (user/admin).
- **Rate limit:** Giới hạn 30 request/15 phút cho các route public (`/api/auth`, `/api/upload`, `/api/account`, `/api/search`, `/api/health`).
- **Validate input:** Tất cả API nhận dữ liệu đều kiểm tra input, trả lỗi 400 nếu không hợp lệ.
- **Ẩn lỗi:** Không trả stack trace ở production.
- **Middleware phân quyền:** Kiểm tra quyền admin cho các route quản trị.

---

## 7. Phân trang & Chuẩn API

- Tất cả API list đều hỗ trợ `page`, `limit` (mặc định 18).
- Response chuẩn:
  ```json
  {
    "data": [ ... ],
    "total": 123,
    "page": 1,
    "limit": 18
  }
  ```
- Các API CRUD trả về status code chuẩn REST (200, 201, 204, 400, 401, 404, 429...).

---

## 8. Upload file

- API: `POST /api/upload`
- Trả về URL file đã upload.
- Đã validate file, kiểm soát rate limit.

---

## 9. Seed & Mock data

- Dữ liệu mẫu nằm trong thư mục `mock_data`.
- Script seed tự động chuyển id sang UUID, đồng bộ liên kết.

---

## 10. Tài liệu API (Swagger)

- Đã tích hợp Swagger UI.
- Truy cập docs tại: `http://localhost:4000/api-docs` (hoặc `/swagger` nếu cấu hình lại).
- Tài liệu tự động sinh từ comment OpenAPI trong các file route.

---

## 11. Mở rộng & Tùy biến

- Dễ dàng mở rộng module (user, content, admin, analytics...).
- Có thể tích hợp thêm cache (Redis), search nâng cao, realtime, đa ngôn ngữ...
- Đã chuẩn hóa middleware, service, repository, dễ bảo trì.

---

## 12. Một số lưu ý

- **Không để lộ JWT_SECRET, DATABASE_URL lên public.**
- **Nên đổi PORT, JWT_SECRET khi deploy production.**
- **Kiểm tra lại index DB nếu dữ liệu lớn.**
- **Có thể nâng cấp thêm CI/CD, logging, monitoring...**

---

## 13. Liên hệ & Hỗ trợ

- Nếu gặp lỗi hoặc cần mở rộng, hãy liên hệ team phát triển hoặc tạo issue trên repo.

---

**Chúc bạn sử dụng hệ thống hiệu quả!**
Nếu cần tài liệu chi tiết cho từng API (request/response mẫu, error code, v.v.), hoặc hướng dẫn migration, hãy yêu cầu thêm! 

---

## 14. Cấu trúc thư mục chính

```
backend/
├── src/
│   ├── controllers/         # Xử lý logic cho từng resource (User, Content, Auth, ...)
│   ├── services/            # Xử lý nghiệp vụ, gọi repository
│   ├── repositories/        # Truy vấn database
│   ├── models/              # Định nghĩa model (interface/type)
│   ├── routes/              # Định nghĩa route cho từng resource
│   ├── middleware/          # Middleware (auth, error, rate limit, ...)
│   ├── scripts/             # Script seed, migrate, util
│   ├── db.ts                # Kết nối database
│   ├── index.ts             # Khởi tạo app, mount middleware, routes
│   └── server.ts            # Chạy server (app.listen)
├── tests/                   # Test tự động cho từng API
├── mock_data/               # Dữ liệu mẫu để seed
├── README.md                # Tài liệu dự án
├── package.json             # Thông tin package, script
└── ...
```

---

## 15. Danh sách API endpoint

### **1. Auth & Account**
- `POST   /api/auth/register`      – Đăng ký tài khoản
- `POST   /api/auth/login`         – Đăng nhập
- `POST   /api/auth/logout`        – Đăng xuất
- `GET    /api/auth/profile`       – Lấy thông tin user hiện tại
- `GET    /api/account/profile`    – Lấy profile (có xác thực)
- `PUT    /api/account/profile`    – Cập nhật profile
- `PUT    /api/account/password`   – Đổi mật khẩu

### **2. User**
- `GET    /api/users`              – Danh sách user (phân trang)
- `GET    /api/users/:id`          – Lấy chi tiết user
- `POST   /api/users`              – Tạo user (stub)
- `PUT    /api/users/:id`          – Cập nhật user (stub)
- `DELETE /api/users/:id`          – Xóa user

### **3. Content**
- `GET    /api/content`            – Danh sách content (phân trang)
- `GET    /api/content/:id`        – Lấy chi tiết content
- `POST   /api/content`            – Tạo content
- `PUT    /api/content/:id`        – Cập nhật content
- `DELETE /api/content/:id`        – Xóa content
- `POST   /api/content/:id/publish`   – Publish content
- `POST   /api/content/:id/archive`   – Archive content
- `POST   /api/content/:id/duplicate` – Duplicate content
- `GET    /api/content/export`         – Export content (CSV)
- `POST   /api/content/import`         – Import content (stub)
- `GET    /api/content/:id/comments`   – Lấy comment của content
- `POST   /api/content/:id/comments`   – Thêm comment cho content
- `POST   /api/content/:id/like`       – Like content
- `POST   /api/content/:id/bookmark`   – Bookmark content

### **4. Category**
- `GET    /api/categories`         – Danh sách category (phân trang)
- `GET    /api/categories/:id`     – Lấy chi tiết category
- `POST   /api/categories`         – Tạo category
- `PUT    /api/categories/:id`     – Cập nhật category
- `DELETE /api/categories/:id`     – Xóa category

### **5. Tag**
- `GET    /api/tags`               – Danh sách tag (phân trang)
- `GET    /api/tags/:id`           – Lấy chi tiết tag
- `POST   /api/tags`               – Tạo tag
- `PUT    /api/tags/:id`           – Cập nhật tag
- `DELETE /api/tags/:id`           – Xóa tag

### **6. Comment**
- `GET    /api/comments`           – Danh sách comment (phân trang)
- `GET    /api/comments/:id`       – Lấy chi tiết comment
- `POST   /api/comments`           – Tạo comment
- `PUT    /api/comments/:id`       – Cập nhật comment (stub)
- `DELETE /api/comments/:id`       – Xóa comment

### **7. Settings**
- `GET    /api/settings`           – Danh sách settings
- `GET    /api/settings/:id`       – Lấy chi tiết setting
- `POST   /api/settings`           – Tạo setting
- `PUT    /api/settings/:id`       – Cập nhật setting
- `DELETE /api/settings/:id`       – Xóa setting

### **8. Search**
- `GET    /api/search?q=keyword`   – Tìm kiếm content theo từ khóa

### **9. Upload**
- `POST   /api/upload`             – Upload file, trả về URL

### **10. Analytics & Activity Log**
- `GET    /api/analytics-events`   – Danh sách sự kiện analytics
- `GET    /api/analytics-events/:id` – Lấy chi tiết event
- `POST   /api/analytics-events`   – Tạo event (stub)
- `PUT    /api/analytics-events/:id` – Cập nhật event (stub)
- `DELETE /api/analytics-events/:id` – Xóa event
- `GET    /api/activity-logs`      – Danh sách activity log
- `GET    /api/activity-logs/:id`  – Lấy chi tiết log
- `POST   /api/activity-logs`      – Tạo log (stub)
- `PUT    /api/activity-logs/:id`  – Cập nhật log (stub)
- `DELETE /api/activity-logs/:id`  – Xóa log

### **11. Admin (quản trị)**
- `GET    /api/admin/users`        – Danh sách user (lọc, search, phân trang)
- `GET    /api/admin/users/:id`    – Lấy chi tiết user
- `POST   /api/admin/users`        – Tạo user
- `PUT    /api/admin/users/:id`    – Cập nhật user
- `DELETE /api/admin/users/:id`    – Xóa user
- `GET    /api/admin/activity-logs` – Danh sách activity log
- `GET    /api/admin/activity-logs/:id` – Lấy chi tiết log
- `GET    /api/admin/settings`     – Danh sách settings
- `GET    /api/admin/settings/:id` – Lấy chi tiết setting
- `POST   /api/admin/settings`     – Tạo setting
- `PUT    /api/admin/settings/:id` – Cập nhật setting
- `DELETE /api/admin/settings/:id` – Xóa setting

---

**Tất cả các API đều hỗ trợ phân trang (nếu là list), validate input, bảo vệ quyền truy cập (JWT, role), trả về dữ liệu thực tế từ DB.**

Nếu cần chi tiết request/response mẫu cho từng API, hãy yêu cầu thêm! 