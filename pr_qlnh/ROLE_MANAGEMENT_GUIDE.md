# Hướng dẫn Quản lý Vai trò

## Tổng quan

Hệ thống quản lý vai trò đã được cải thiện với giao diện mới, validation đầy đủ và xử lý lỗi tốt hơn.

---

## Tính năng

### ✅ 1. Xem danh sách vai trò
- Hiển thị tất cả vai trò trong hệ thống
- Thông tin: ID, Tên, Mô tả, Số người dùng, Ngày tạo, Ngày cập nhật
- Badge màu sắc cho số người dùng:
  - 🔵 Xanh: Có người dùng
  - ⚪ Xám: Không có người dùng

### ✅ 2. Thêm vai trò mới
**Cách sử dụng:**
1. Click nút **"+ Thêm vai trò"**
2. Nhập thông tin:
   - **Tên vai trò** (bắt buộc, tối đa 100 ký tự)
   - **Mô tả** (tùy chọn, tối đa 255 ký tự)
3. Click **"Thêm vai trò"**

**Validation:**
- ✅ Tên không được để trống
- ✅ Tên không được quá 100 ký tự
- ✅ Mô tả không được quá 255 ký tự
- ✅ Tên phải là duy nhất (backend check)

**Giao diện:**
- Modal màu xanh lá với icon Shield
- Auto-focus vào ô tên vai trò
- Hiển thị lỗi realtime khi nhập sai
- Thông báo thành công sau khi thêm

---

### ✅ 3. Sửa vai trò
**Cách sử dụng:**
1. Click vào icon **"⋮"** (More) ở hàng vai trò
2. Modal hiển thị thông tin:
   - Tên vai trò
   - Mô tả
   - Số người dùng
   - Số quyền hạn
3. Chỉnh sửa thông tin
4. Click **"Lưu thay đổi"**

**Validation:**
- ✅ Tên không được để trống
- ✅ Tên không được quá 100 ký tự
- ✅ Mô tả không được quá 255 ký tự

**Giao diện:**
- Modal màu indigo với icon Shield
- Hiển thị thống kê:
  - 👥 Số người dùng (badge xanh)
  - 🛡️ Số quyền hạn (badge xanh lá)
- Cảnh báo màu vàng nếu có người dùng
- Nút xóa disabled nếu có người dùng

---

### ✅ 4. Xóa vai trò
**Cách sử dụng:**
1. Click icon **🗑️** (Trash) ở hàng vai trò
2. Hoặc click **"Xóa"** trong modal sửa
3. Xác nhận xóa

**Ràng buộc:**
- ❌ **KHÔNG thể xóa** nếu vai trò đang có người dùng
- ✅ **Có thể xóa** nếu vai trò không có người dùng

**Giao diện:**
- Nút xóa màu đỏ khi có thể xóa
- Nút xóa màu xám (disabled) khi có người dùng
- Tooltip: "Không thể xóa - Có X người dùng"
- Confirm dialog hiển thị tên vai trò

**Thông báo:**
```
✅ Thành công: "Xóa vai trò thành công!"
❌ Có người dùng: "Không thể xóa vai trò này vì có X người dùng đang sử dụng!"
⚠️ Đã bị xóa: "Vai trò không tồn tại. Có thể đã bị xóa bởi người dùng khác."
```

---

## Xử lý Multi-Tab

### Scenario 1: Tab 1 xóa → Tab 2 xóa
- Tab 1: Xóa thành công ✅
- Tab 2: Thông báo "Đã bị xóa bởi người dùng khác" + Tự động reload

### Scenario 2: Tab 1 mở modal sửa → Tab 2 xóa → Tab 1 lưu
- Tab 1: Thông báo "Vui lòng tải lại trang" + Đóng modal + Reload

---

## Components

### 1. **RoleManager.jsx**
- Component chính quản lý state
- Xử lý API calls
- Xử lý lỗi và thông báo

### 2. **RoleTable.jsx**
- Hiển thị danh sách vai trò
- Badge số người dùng
- Nút xóa với visual feedback

### 3. **RoleAddModal.jsx** (MỚI)
- Modal thêm vai trò
- Validation form
- Giao diện màu xanh lá

### 4. **RoleEditModal.jsx** (MỚI)
- Modal sửa vai trò
- Hiển thị thống kê
- Nút xóa có điều kiện
- Cảnh báo khi có người dùng

### 5. **RoleDetailsModal.jsx** (CŨ - Không dùng)
- File cũ dành cho User
- Đã được thay thế bởi RoleEditModal

---

## API Endpoints

### GET `/api/roles`
**Response:**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "description": "Quản trị viên hệ thống",
    "permissions_count": 10,
    "users_count": 2,
    "permissions": ["create_user", "delete_user"],
    "created_at": "2024-01-01",
    "updated_at": "2024-01-01"
  }
]
```

### POST `/api/roles`
**Request:**
```json
{
  "name": "Manager",
  "description": "Quản lý nhân viên"
}
```

### PUT `/api/roles/{id}`
**Request:**
```json
{
  "name": "Manager Updated",
  "description": "Quản lý nhân viên và dự án"
}
```

**Response (404 - Đã bị xóa):**
```json
{
  "message": "Vai trò không tồn tại. Có thể đã bị xóa bởi người dùng khác.",
  "deleted": true
}
```

### DELETE `/api/roles/{id}`
**Response (400 - Có người dùng):**
```json
{
  "message": "Không thể xóa vai trò này vì có 5 người dùng đang sử dụng!",
  "users_count": 5
}
```

**Response (404 - Đã bị xóa):**
```json
{
  "message": "Vai trò không tồn tại. Có thể đã bị xóa bởi người dùng khác.",
  "deleted": true
}
```

---

## Validation Rules

### Backend (Laravel)
```php
'name' => 'required|unique:roles,name|max:100',
'description' => 'nullable|string|max:255'
```

### Frontend (React)
- Tên: Required, max 100 ký tự
- Mô tả: Optional, max 255 ký tự
- Realtime validation khi nhập
- Hiển thị lỗi dưới input

---

## Error Handling

### 1. **404 - Not Found**
```javascript
if (err.response?.status === 404 && err.response?.data?.deleted) {
  alert("⚠️ Vai trò không tồn tại. Có thể đã bị xóa bởi người dùng khác.\n\nVui lòng tải lại trang.");
  await loadRole(); // Auto reload
}
```

### 2. **400 - Bad Request**
```javascript
if (err.response?.status === 400) {
  const errorData = err.response.data;
  alert(`❌ ${errorData.message}\n\nSố người dùng: ${errorData.users_count}`);
}
```

### 3. **422 - Validation Error**
```javascript
// Backend trả về validation errors
{
  "message": "The name has already been taken.",
  "errors": {
    "name": ["The name has already been taken."]
  }
}
```

---

## UI/UX Improvements

### ✅ Visual Feedback
- Badge màu sắc cho số người dùng
- Nút xóa disabled khi có ràng buộc
- Tooltip giải thích lý do không thể xóa
- Loading state khi đang tải dữ liệu

### ✅ User Experience
- Auto-focus vào input khi mở modal
- Confirm dialog với tên vai trò
- Thông báo rõ ràng, dễ hiểu
- Tự động reload sau khi thêm/sửa/xóa
- Xử lý xung đột multi-tab

### ✅ Accessibility
- Keyboard navigation
- Screen reader friendly
- Clear error messages
- Consistent button placement

---

## Testing Checklist

### Thêm vai trò
- [ ] Thêm với tên hợp lệ
- [ ] Thêm với tên trùng (expect error)
- [ ] Thêm với tên quá dài (expect error)
- [ ] Thêm với tên rỗng (expect error)
- [ ] Thêm với mô tả quá dài (expect error)

### Sửa vai trò
- [ ] Sửa tên và mô tả
- [ ] Sửa thành tên trùng (expect error)
- [ ] Sửa vai trò đã bị xóa (expect 404)
- [ ] Validation realtime

### Xóa vai trò
- [ ] Xóa vai trò không có người dùng (success)
- [ ] Xóa vai trò có người dùng (expect 400)
- [ ] Xóa vai trò đã bị xóa (expect 404)
- [ ] Visual feedback (disabled button)

### Multi-tab
- [ ] Tab 1 xóa → Tab 2 xóa (expect 404)
- [ ] Tab 1 sửa → Tab 2 xóa → Tab 1 lưu (expect 404)
- [ ] Auto reload sau xung đột

---

## Kết luận

Hệ thống quản lý vai trò đã được cải thiện toàn diện:
- ✅ Giao diện đẹp, hiện đại
- ✅ Validation đầy đủ
- ✅ Xử lý lỗi tốt
- ✅ Hỗ trợ multi-tab
- ✅ UX thân thiện
- ✅ Code clean, dễ maintain
