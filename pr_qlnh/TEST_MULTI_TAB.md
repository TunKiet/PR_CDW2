# Hướng dẫn Test Chức năng Multi-Tab cho Vai trò & Quyền

## Mục đích
Kiểm tra xử lý xung đột khi có nhiều tab cùng thao tác trên cùng một bản ghi.

## Tình huống Test

### 🧪 Test 1: Xóa Vai trò ở 2 tab

**Bước 1:** Mở 2 tab trình duyệt, cả 2 vào trang **Quản lý Vai trò**

**Bước 2:** Chọn 1 vai trò không có người dùng (ví dụ: vai trò test)

**Bước 3:** 
- **Tab 1:** Click nút xóa vai trò → Confirm → Xóa thành công ✅
- **Tab 2:** Click nút xóa cùng vai trò đó → Nhận thông báo:
  ```
  ⚠️ Vai trò không tồn tại. Có thể đã bị xóa bởi người dùng khác.
  
  Dữ liệu đã được cập nhật.
  ```
- **Tab 2:** Danh sách tự động reload, vai trò đã biến mất

**Kết quả mong đợi:**
- ✅ Tab 1: Xóa thành công
- ✅ Tab 2: Hiển thị cảnh báo và tự động reload
- ✅ Không có lỗi 500 hoặc crash

---

### 🧪 Test 2: Sửa Vai trò đã bị xóa

**Bước 1:** Mở 2 tab, cả 2 vào trang **Quản lý Vai trò**

**Bước 2:** 
- **Tab 1:** Click vào 1 vai trò để xem chi tiết
- **Tab 2:** Xóa vai trò đó

**Bước 3:**
- **Tab 1:** Sửa thông tin và click "Lưu" → Nhận thông báo:
  ```
  ⚠️ Vai trò không tồn tại. Có thể đã bị xóa bởi người dùng khác.
  
  Vui lòng tải lại trang để cập nhật dữ liệu mới nhất.
  ```
- **Tab 1:** Modal đóng lại, danh sách tự động reload

**Kết quả mong đợi:**
- ✅ Hiển thị cảnh báo rõ ràng
- ✅ Tự động reload danh sách
- ✅ Không lưu dữ liệu sai

---

### 🧪 Test 3: Xóa Quyền ở 2 tab

**Bước 1:** Mở 2 tab, cả 2 vào trang **Quản lý Quyền**

**Bước 2:** Chọn 1 quyền không được sử dụng bởi vai trò nào

**Bước 3:**
- **Tab 1:** Xóa quyền → Thành công ✅
- **Tab 2:** Xóa cùng quyền đó → Nhận thông báo:
  ```
  ⚠️ Quyền không tồn tại. Có thể đã bị xóa bởi người dùng khác.
  
  Dữ liệu đã được cập nhật.
  ```

**Kết quả mong đợi:**
- ✅ Tab 1: Xóa thành công
- ✅ Tab 2: Cảnh báo và reload
- ✅ Không có lỗi

---

### 🧪 Test 4: Xóa Quyền đang được sử dụng

**Bước 1:** Tạo 1 quyền mới và gán cho 1 vai trò

**Bước 2:** Thử xóa quyền đó

**Kết quả mong đợi:**
```
❌ Không thể xóa quyền này vì có 1 vai trò đang sử dụng!

Số vai trò: 1
```

**Giao diện:**
- ✅ Nút xóa màu xám (disabled style)
- ✅ Tooltip: "Không thể xóa - Có 1 vai trò"
- ✅ Badge hiển thị số vai trò

---

### 🧪 Test 5: Xóa Vai trò đang có người dùng

**Bước 1:** Chọn vai trò đang có người dùng (ví dụ: Admin, Manager)

**Bước 2:** Click xóa

**Kết quả mong đợi:**
```
❌ Không thể xóa vai trò này vì có X người dùng đang sử dụng!

Số người dùng: X
```

**Giao diện:**
- ✅ Nút xóa màu xám
- ✅ Tooltip: "Không thể xóa - Có X người dùng"
- ✅ Badge hiển thị số người dùng

---

## Checklist Tổng hợp

### Backend
- [x] Kiểm tra bản ghi tồn tại trước khi update/delete
- [x] Trả về 404 với flag `deleted: true` nếu không tồn tại
- [x] Trả về 400 nếu có ràng buộc (users/roles đang sử dụng)
- [x] Message rõ ràng, có thông tin chi tiết

### Frontend
- [x] Xử lý lỗi 404 → Hiển thị cảnh báo + reload
- [x] Xử lý lỗi 400 → Hiển thị số lượng ràng buộc
- [x] Hiển thị badge số người dùng/vai trò
- [x] Nút xóa disabled khi có ràng buộc
- [x] Tooltip thông báo lý do không thể xóa
- [x] Tự động reload sau khi phát hiện xung đột

### UX
- [x] Thông báo dễ hiểu cho người dùng
- [x] Không crash hoặc lỗi 500
- [x] Dữ liệu luôn đồng bộ giữa các tab
- [x] Confirm dialog hiển thị tên bản ghi

---

## Lưu ý

1. **Không dùng `findOrFail()`** - Sẽ throw exception 500
2. **Dùng `find()`** - Trả về null nếu không tìm thấy
3. **Kiểm tra null** - Trả về 404 với message phù hợp
4. **Reload sau xung đột** - Đảm bảo dữ liệu mới nhất
5. **Badge màu sắc** - Xanh nếu có ràng buộc, xám nếu không

---

## Kết luận

Hệ thống đã được cải thiện để:
- ✅ Phát hiện xung đột multi-tab
- ✅ Thông báo rõ ràng cho người dùng
- ✅ Tự động đồng bộ dữ liệu
- ✅ Ngăn chặn xóa khi có ràng buộc
- ✅ UX tốt với visual feedback
