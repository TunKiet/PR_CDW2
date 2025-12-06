# Hướng dẫn cập nhật chức năng chấm công

## Các thay đổi đã thực hiện

### 1. Lưu thời gian chấm công chính xác
- **Trước**: Chỉ lưu giờ:phút:giây (time)
- **Sau**: Lưu đầy đủ ngày giờ:phút:giây (datetime)
- **Lợi ích**: Ghi nhận chính xác thời điểm nhân viên chấm công vào/ra

### 2. Thông báo lỗi rõ ràng hơn
- **Trước**: "Không tìm thấy nhân viên"
- **Sau**: "Chưa có mã nhân viên này trong hệ thống"
- **Lợi ích**: Người dùng hiểu rõ hơn lý do lỗi

## Các file đã thay đổi

### Backend
1. **`backend/app/Models/Attendance.php`**
   - Dòng 99: Lưu `check_in` dưới dạng datetime đầy đủ
   - Dòng 195: Lưu `check_out` dưới dạng datetime đầy đủ

2. **`backend/app/Http/Controllers/AttendanceController.php`**
   - Dòng 36, 69, 100: Cập nhật thông báo lỗi thành "Chưa có mã nhân viên này trong hệ thống"

3. **`backend/database/migrations/2025_12_06_000000_update_attendances_check_times_to_datetime.php`** (MỚI)
   - Migration để thay đổi cột `check_in` và `check_out` từ `time` sang `datetime`

### Frontend
4. **`frontend/src/components/AttendanceCheckIn.jsx`**
   - Dòng 54, 82: Cải thiện xử lý hiển thị thông báo lỗi

## Hướng dẫn triển khai

### Bước 1: Chạy migration
```bash
cd backend
php artisan migrate
```

### Bước 2: Kiểm tra kết quả
1. Mở trang chấm công
2. Thử nhập một User ID không tồn tại
3. Kiểm tra thông báo: "Chưa có mã nhân viên này trong hệ thống"
4. Thử chấm công với User ID hợp lệ
5. Kiểm tra trong database, cột `check_in` và `check_out` sẽ lưu đầy đủ datetime

### Bước 3: Kiểm tra dữ liệu cũ (nếu có)
- Dữ liệu chấm công cũ (chỉ có time) vẫn hoạt động bình thường
- Dữ liệu mới sẽ được lưu đầy đủ datetime

## Lưu ý quan trọng

### 1. Thời gian chấm công
- Hệ thống sẽ lưu **chính xác thời điểm** nhân viên nhấn nút chấm công
- Không còn làm tròn hoặc điều chỉnh thời gian
- Ví dụ: Nhân viên chấm vào lúc 8:05:23 AM → Lưu đúng 8:05:23 AM

### 2. Tìm kiếm nhân viên
- Khi nhập User ID không tồn tại → Hiển thị: "Chưa có mã nhân viên này trong hệ thống"
- Giúp người dùng biết rõ cần kiểm tra lại mã nhân viên

### 3. Tương thích ngược
- Migration sử dụng `->change()` để cập nhật cột
- Đảm bảo dữ liệu cũ không bị mất
- Nếu cần rollback: `php artisan migrate:rollback`

## Kiểm tra chi tiết

### Kiểm tra database
```sql
-- Xem cấu trúc bảng attendances
DESCRIBE attendances;

-- Kiểm tra dữ liệu mới nhất
SELECT * FROM attendances ORDER BY created_at DESC LIMIT 5;
```

### Kiểm tra chức năng
1. **Chấm công vào**:
   - Nhập User ID hợp lệ
   - Nhấn "Chấm Vào"
   - Kiểm tra thời gian được lưu chính xác

2. **Chấm công ra**:
   - Nhấn "Chấm Ra"
   - Kiểm tra thời gian được lưu chính xác
   - Kiểm tra số giờ làm việc được tính đúng

3. **Lỗi mã nhân viên**:
   - Nhập User ID không tồn tại (ví dụ: 99999)
   - Kiểm tra thông báo: "Chưa có mã nhân viên này trong hệ thống"

## Hỗ trợ

Nếu gặp vấn đề khi triển khai, vui lòng kiểm tra:
1. Laravel version có hỗ trợ `->change()` không (cần doctrine/dbal)
2. Database có quyền ALTER TABLE không
3. Log file: `storage/logs/laravel.log`
