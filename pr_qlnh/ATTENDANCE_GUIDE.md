# 📋 Hướng Dẫn Hệ Thống Chấm Công

## 🎯 Tổng Quan

Hệ thống chấm công tự động với các tính năng:
- ✅ Chấm công vào/ra bằng User ID
- ✅ Tự động tính giờ làm việc (trừ giờ nghỉ trưa)
- ✅ Phát hiện đi muộn, về sớm, thiếu giờ
- ✅ Quản lý và báo cáo chi tiết
- ✅ Lịch tháng trực quan

## ⏰ Quy Định Chấm Công

### Giờ Làm Việc
- **Giờ vào:** 8:00 AM
- **Giờ ra:** 5:30 PM
- **Nghỉ trưa:** 12:00 PM - 1:00 PM (1 giờ)
- **Tổng giờ làm:** 8 giờ/ngày

### Quy Tắc
1. **Đi muộn:** Sau 8:15 AM → Trạng thái "late"
2. **Về sớm:** Trước 5:15 PM (>15 phút) → Trạng thái "half_day"
3. **Thiếu giờ:** < 8 giờ → Ghi chú số giờ thiếu
4. **Tối thiểu:** Phải làm ít nhất 4 giờ mới được chấm công ra

### Khung Giờ Chấm Công
- **Chấm vào:** 6:00 AM - 12:00 PM
- **Chấm ra:** Sau khi làm đủ 4 giờ

## 🚀 Hướng Dẫn Sử Dụng

### Cho Nhân Viên

#### 1. Chấm Công Vào
```
1. Truy cập: /attendance
2. Nhập User ID của bạn
3. Nhấn nút "Chấm Vào"
4. Hệ thống hiển thị:
   - Thông tin nhân viên
   - Giờ chấm công
   - Trạng thái (Đúng giờ/Đi muộn)
```

#### 2. Chấm Công Ra
```
1. Nhập User ID
2. Nhấn nút "Chấm Ra"
3. Hệ thống tính toán:
   - Tổng giờ làm việc
   - Tự động trừ 1 giờ nghỉ trưa
   - Kiểm tra về sớm/thiếu giờ
```

### Cho Admin/Manager

#### 1. Xem Lịch Chấm Công
```
1. Truy cập: /attendance-management
2. Chọn tab "Lịch"
3. Nhập User ID nhân viên
4. Chọn tháng/năm
5. Xem lịch với:
   - Ngày làm việc
   - Giờ vào/ra từng ngày
   - Tổng giờ làm trong tháng
```

#### 2. Xem Danh Sách
```
1. Chọn tab "Danh sách"
2. Xem tất cả chấm công theo tháng
3. Lọc theo:
   - Nhân viên
   - Ngày
   - Trạng thái
```

#### 3. Xem Báo Cáo
```
1. Chọn tab "Báo cáo"
2. Chọn tháng/năm
3. Xem báo cáo tổng hợp:
   - Tất cả nhân viên
   - Tổng giờ làm
   - Số ngày làm việc
   - Trung bình giờ/ngày
```

## 🔧 Cấu Hình

File cấu hình: `backend/config/attendance.php`

```php
'work_hours' => [
    'start_time' => '08:00:00',          // Giờ bắt đầu
    'end_time' => '17:30:00',            // Giờ kết thúc
    'late_threshold' => '08:15:00',      // Ngưỡng đi muộn
    'early_leave_threshold' => 15,       // Phút về sớm cho phép
],

'lunch_break' => [
    'start_time' => '12:00:00',
    'end_time' => '13:00:00',
    'duration_hours' => 1,
],

'hours' => [
    'standard_work_hours' => 8,          // Giờ làm tiêu chuẩn
    'minimum_work_hours' => 4,           // Giờ làm tối thiểu
],
```

## 📊 Trạng Thái Chấm Công

| Trạng thái | Mô tả | Màu sắc |
|-----------|-------|---------|
| `present` | Đúng giờ, đủ giờ | 🟢 Xanh lá |
| `late` | Đi muộn | 🟡 Vàng |
| `half_day` | Về sớm, thiếu giờ | 🟠 Cam |
| `absent` | Vắng mặt | 🔴 Đỏ |

## 💡 Ví Dụ Tính Giờ

### Trường hợp 1: Làm việc đầy đủ
```
Vào: 8:00 AM
Ra: 5:30 PM
Nghỉ trưa: 12:00 - 1:00 PM (tự động trừ)
→ Tổng: 8.5 giờ - 1 giờ = 7.5 giờ
→ Trạng thái: present
```

### Trường hợp 2: Đi muộn
```
Vào: 8:30 AM (muộn 30 phút)
Ra: 5:30 PM
→ Tổng: 8 giờ - 1 giờ = 7 giờ
→ Trạng thái: late
→ Ghi chú: "Đi muộn 30 phút | Thiếu 1 giờ"
```

### Trường hợp 3: Về sớm
```
Vào: 8:00 AM
Ra: 4:00 PM (sớm 1.5 giờ)
→ Tổng: 7 giờ - 1 giờ = 6 giờ
→ Trạng thái: half_day
→ Ghi chú: "Về sớm 90 phút | Thiếu 2 giờ"
```

## 🔒 Bảo Mật

- Mỗi nhân viên chỉ chấm công bằng User ID của mình
- Mỗi ngày chỉ được chấm công vào/ra một lần
- Admin/Manager có quyền xem và quản lý tất cả

## 📱 API Endpoints

### Nhân viên
```
POST /api/attendance/check-in        # Chấm công vào
POST /api/attendance/check-out       # Chấm công ra
POST /api/attendance/today-status    # Trạng thái hôm nay
GET  /api/attendance/monthly         # Chấm công theo tháng
GET  /api/attendance/weekly          # Tổng giờ theo tuần
```

### Admin/Manager
```
GET    /api/attendance               # Lấy tất cả
GET    /api/attendance/{id}          # Chi tiết
POST   /api/attendance               # Tạo mới
PUT    /api/attendance/{id}          # Cập nhật
DELETE /api/attendance/{id}          # Xóa
GET    /api/attendance/report        # Báo cáo tổng hợp
```

## 🐛 Xử Lý Lỗi

### Lỗi thường gặp:

1. **"Chưa đến giờ chấm công"**
   - Chỉ được chấm công từ 6:00 AM

2. **"Đã quá giờ chấm công vào"**
   - Phải chấm công trước 12:00 PM

3. **"Chưa đủ thời gian làm việc tối thiểu"**
   - Phải làm ít nhất 4 giờ

4. **"Bạn đã chấm công vào/ra hôm nay rồi"**
   - Mỗi ngày chỉ chấm công một lần

## 📞 Hỗ Trợ

Nếu có vấn đề, liên hệ:
- Admin hệ thống
- Email: support@company.com
- Hotline: 1900-xxxx
