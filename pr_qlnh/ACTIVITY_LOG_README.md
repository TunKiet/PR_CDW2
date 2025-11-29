# Chức năng Nhật ký Hoạt động (Activity Log)

## Mô tả
Chức năng nhật ký hoạt động cho phép lưu trữ và theo dõi các phiên đăng nhập/đăng xuất của người dùng, bao gồm:
- Thời gian đăng nhập
- Thời gian đăng xuất
- Địa chỉ IP
- Trạng thái (thành công, thất bại, đăng xuất)

## Cấu trúc Database

### Bảng: `login_logs`
```sql
- id: bigint (primary key)
- user_id: bigint (foreign key -> users.user_id)
- ip_address: varchar(45)
- status: varchar(10) (success, failed, logout)
- created_at: timestamp
- updated_at: timestamp
```

## Backend

### 1. Model: `LoginLog.php`
**Đường dẫn:** `backend/app/Models/LoginLog.php`

**Chức năng:**
- Quản lý dữ liệu login logs
- Tạo log mới
- Lấy danh sách logs theo user_id

**Methods:**
- `getLogsByUserId($userId, $limit)` - Lấy logs của user
- `createLog($userId, $ipAddress, $status)` - Tạo log mới

### 2. Controller: `LoginLogController.php`
**Đường dẫn:** `backend/app/Http/Controllers/LoginLogController.php`

**Endpoints:**
- `GET /api/login-logs` - Lấy logs của user hiện tại (cần JWT token)
- `GET /api/login-logs/{userId}` - Lấy logs của user cụ thể (admin)

### 3. Cập nhật `AuthController.php`
**Chức năng được thêm:**
- Lưu log khi đăng nhập thành công (có/không 2FA)
- Lưu log khi đăng nhập thất bại
- Lưu log khi đăng xuất
- Lưu địa chỉ IP của người dùng

### 4. Routes
**Đường dẫn:** `backend/routes/api.php`

```php
Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/login-logs', [LoginLogController::class, 'getUserLogs']);
});
```

## Frontend

### 1. Component: `ActivityLogSection.jsx`
**Đường dẫn:** `frontend/src/components/Settings/ActivityLogSection.jsx`

**Chức năng:**
- Hiển thị danh sách nhật ký hoạt động
- Nhóm logs theo phiên đăng nhập/đăng xuất
- Tính toán thời gian phiên
- Hiển thị thống kê (thành công, thất bại, tổng phiên)
- Làm mới dữ liệu

**Features:**
- ✅ Hiển thị thời gian đăng nhập/đăng xuất
- ✅ Hiển thị địa chỉ IP
- ✅ Tính thời gian phiên (duration)
- ✅ Phân biệt phiên đang hoạt động
- ✅ Thống kê trực quan
- ✅ Làm mới dữ liệu

### 2. Data Helper: `LoginLogData.js`
**Đường dẫn:** `frontend/src/data/LoginLogData.js`

**Functions:**
- `getUserLoginLogs(limit)` - Lấy logs của user hiện tại
- `getLoginLogsByUserId(userId)` - Lấy logs của user khác (admin)

### 3. Cập nhật `SystemSettings.jsx`
**Thêm tab mới:**
- Icon: History
- Tên: "Nhật ký hoạt động"
- Mô tả: "Xem lịch sử đăng nhập và hoạt động tài khoản"

## Cách sử dụng

### Backend Setup
1. Migration đã có sẵn: `2025_10_16_035048_create_login_logs_table.php`
2. Chạy migration (nếu chưa):
```bash
php artisan migrate
```

### Frontend Setup
1. Component đã được tích hợp vào SystemSettings
2. Truy cập: Cài đặt Hệ thống > Nhật ký hoạt động

### Kiểm tra hoạt động
1. Đăng nhập vào hệ thống
2. Vào "Cài đặt Hệ thống"
3. Chọn tab "Nhật ký hoạt động"
4. Xem danh sách các phiên đăng nhập

## Luồng hoạt động

### Đăng nhập thành công
1. User nhập thông tin đăng nhập
2. Backend xác thực thông tin
3. Lưu log với status = "success" và IP address
4. Trả về token JWT

### Đăng nhập thất bại
1. User nhập sai thông tin
2. Backend phát hiện lỗi
3. Lưu log với status = "failed" và IP address
4. Trả về lỗi 401

### Đăng xuất
1. User nhấn đăng xuất
2. Backend xác thực token
3. Lưu log với status = "logout" và IP address
4. Hủy token JWT

### Hiển thị logs
1. Frontend gọi API `/api/login-logs`
2. Backend trả về danh sách logs
3. Frontend nhóm logs theo phiên
4. Tính toán thời gian phiên
5. Hiển thị giao diện trực quan

## Bảo mật

### Backend
- ✅ Sử dụng JWT authentication
- ✅ Chỉ user được xem logs của chính mình
- ✅ Admin có thể xem logs của user khác
- ✅ Lưu IP address để theo dõi

### Frontend
- ✅ Token được lưu trong localStorage
- ✅ Gửi token qua Authorization header
- ✅ Xử lý lỗi khi token hết hạn

## Tính năng mở rộng (có thể thêm sau)

1. **Lọc và tìm kiếm:**
   - Lọc theo khoảng thời gian
   - Lọc theo trạng thái
   - Tìm kiếm theo IP

2. **Thông báo:**
   - Email khi có đăng nhập từ IP lạ
   - Cảnh báo đăng nhập thất bại nhiều lần

3. **Phân tích:**
   - Biểu đồ hoạt động theo thời gian
   - Thống kê IP thường xuyên
   - Phát hiện hành vi bất thường

4. **Export:**
   - Xuất logs ra CSV/PDF
   - Tải xuống lịch sử hoạt động

## Troubleshooting

### Lỗi: "Không thể tải nhật ký hoạt động"
- Kiểm tra token JWT còn hạn không
- Kiểm tra backend server đang chạy
- Kiểm tra route API đã được định nghĩa

### Không có dữ liệu hiển thị
- Đăng nhập/đăng xuất ít nhất 1 lần để tạo log
- Kiểm tra database có dữ liệu không
- Kiểm tra API response

### IP address hiển thị "127.0.0.1"
- Đây là IP local khi chạy trên localhost
- Khi deploy production, IP sẽ hiển thị đúng

## Liên hệ
Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.
