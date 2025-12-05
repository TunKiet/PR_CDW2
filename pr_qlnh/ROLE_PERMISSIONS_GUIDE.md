# Hướng dẫn Gán Quyền cho Vai trò

## Tổng quan

Chức năng gán quyền (permissions) cho vai trò (roles) thông qua bảng trung gian `role_permissions`.

---

## Cấu trúc Database

### Bảng `roles`
```sql
- id (PK)
- name
- description
- created_at
- updated_at
```

### Bảng `permissions`
```sql
- id (PK)
- name
- description
- created_at
- updated_at
```

### Bảng `role_permissions` (Pivot Table)
```sql
- role_id (FK -> roles.id)
- permission_id (FK -> permissions.id)
- created_at
- updated_at

PRIMARY KEY (role_id, permission_id)
```

---

## Backend API

### 1. Lấy chi tiết vai trò với permissions
**Endpoint:** `GET /api/roles/{id}`

**Response:**
```json
{
  "id": 1,
  "name": "Admin",
  "description": "Quản trị viên",
  "permissions": [
    {
      "id": 1,
      "name": "create_user",
      "description": "Tạo người dùng mới"
    },
    {
      "id": 2,
      "name": "delete_user",
      "description": "Xóa người dùng"
    }
  ],
  "users": [...],
  "created_at": "2024-01-01",
  "updated_at": "2024-01-01"
}
```

### 2. Gán quyền cho vai trò
**Endpoint:** `POST /api/roles/{id}/permissions`

**Request:**
```json
{
  "permissions": [1, 2, 3, 5]
}
```

**Validation:**
- `permissions`: required, array
- `permissions.*`: exists:permissions,id

**Response:**
```json
{
  "message": "Gán quyền thành công!",
  "role": {
    "id": 1,
    "name": "Admin",
    "permissions": [...]
  }
}
```

**Backend Code:**
```php
public function assignPermissions(Request $request, $id)
{
    $role = Role::findOrFail($id);

    $request->validate([
        'permissions' => 'required|array',
        'permissions.*' => 'exists:permissions,id'
    ]);

    // sync() sẽ:
    // - Xóa tất cả permissions cũ
    // - Thêm permissions mới
    // - Tự động quản lý bảng role_permissions
    $role->permissions()->sync($request->permissions);

    return response()->json([
        'message' => 'Gán quyền thành công!',
        'role' => $role->load('permissions')
    ]);
}
```

---

## Frontend Implementation

### 1. RoleEditModal Component

**Features:**
- ✅ Hiển thị danh sách tất cả permissions
- ✅ Checkbox để chọn/bỏ chọn permissions
- ✅ Hiển thị permissions hiện tại của role
- ✅ Lưu permissions riêng biệt với thông tin role
- ✅ Loading state khi tải permissions
- ✅ Saving state khi lưu permissions

**State Management:**
```javascript
const [allPermissions, setAllPermissions] = useState([]);
const [selectedPermissions, setSelectedPermissions] = useState([]);
const [loadingPermissions, setLoadingPermissions] = useState(false);
const [savingPermissions, setSavingPermissions] = useState(false);
```

**Load Permissions:**
```javascript
const loadPermissions = async () => {
  setLoadingPermissions(true);
  try {
    // 1. Lấy tất cả permissions
    const allPerms = await getAllPermission();
    setAllPermissions(allPerms);

    // 2. Lấy permissions của role hiện tại
    const response = await axiosClient.get(`/roles/${role.id}`);
    const rolePermissions = response.data?.permissions || [];
    const permIds = rolePermissions.map(p => p.id);
    setSelectedPermissions(permIds);
  } catch (err) {
    console.error("Lỗi tải quyền:", err);
  } finally {
    setLoadingPermissions(false);
  }
};
```

**Toggle Permission:**
```javascript
const togglePermission = (permissionId) => {
  setSelectedPermissions(prev => {
    if (prev.includes(permissionId)) {
      // Bỏ chọn
      return prev.filter(id => id !== permissionId);
    } else {
      // Chọn
      return [...prev, permissionId];
    }
  });
};
```

**Save Permissions:**
```javascript
const handleSavePermissions = async () => {
  setSavingPermissions(true);
  try {
    await axiosClient.post(`/roles/${role.id}/permissions`, {
      permissions: selectedPermissions
    });
    alert("✅ Cập nhật quyền thành công!");
    await loadPermissions(); // Reload để cập nhật
  } catch (err) {
    console.error("Lỗi cập nhật quyền:", err);
    alert(`Lỗi: ${err.response?.data?.message}`);
  } finally {
    setSavingPermissions(false);
  }
};
```

---

## UI/UX Design

### Giao diện Modal

```
┌─────────────────────────────────────────────┐
│  🛡️ Chỉnh sửa vai trò                    ✕  │
│  ID: 1                                       │
├─────────────────────────────────────────────┤
│                                              │
│  👥 Người dùng    🛡️ Quyền hạn              │
│      5                10                     │
│                                              │
│  Tên vai trò: [Admin              ]         │
│  Mô tả:       [Quản trị viên...   ]         │
│                                              │
│  ⚠️ Vai trò này đang được sử dụng bởi 5     │
│     người dùng. Không thể xóa.              │
│                                              │
├─────────────────────────────────────────────┤
│  🛡️ Quyền hạn              [Lưu quyền]      │
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │ ☑ create_user                         │  │
│  │   Tạo người dùng mới                  │  │
│  ├───────────────────────────────────────┤  │
│  │ ☑ delete_user                         │  │
│  │   Xóa người dùng                      │  │
│  ├───────────────────────────────────────┤  │
│  │ ☐ view_reports                        │  │
│  │   Xem báo cáo                         │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  Đã chọn: 2 / 10 quyền                      │
│                                              │
├─────────────────────────────────────────────┤
│  [Xóa]          [Hủy]  [Lưu thay đổi]      │
└─────────────────────────────────────────────┘
```

### Màu sắc & Icons

- **Header:** Indigo với icon Shield
- **Stats:** 
  - Người dùng: Blue badge
  - Quyền hạn: Green badge
- **Permissions list:**
  - Checkbox: Indigo khi checked
  - Hover: Light gray background
  - Selected: Check icon overlay
- **Buttons:**
  - Lưu quyền: Green
  - Lưu thay đổi: Indigo
  - Xóa: Red (disabled nếu có users)
  - Hủy: Gray

---

## Workflow

### 1. Mở modal sửa vai trò
```
User clicks "⋮" → RoleEditModal opens
  ↓
Load all permissions (GET /api/permissions)
  ↓
Load role details (GET /api/roles/{id})
  ↓
Extract permission IDs from role.permissions
  ↓
Set selectedPermissions state
  ↓
Render checkboxes with correct checked state
```

### 2. Chọn/bỏ chọn quyền
```
User clicks checkbox
  ↓
togglePermission(permissionId)
  ↓
Update selectedPermissions state
  ↓
UI updates immediately (optimistic update)
```

### 3. Lưu quyền
```
User clicks "Lưu quyền"
  ↓
handleSavePermissions()
  ↓
POST /api/roles/{id}/permissions
  ↓
Backend sync() permissions
  ↓
Success: Alert + Reload permissions
  ↓
Error: Alert error message
```

### 4. Lưu thông tin vai trò
```
User clicks "Lưu thay đổi"
  ↓
handleSave()
  ↓
PUT /api/roles/{id}
  ↓
Update name & description
  ↓
Close modal + Reload role list
```

---

## Laravel Eloquent Relationships

### Role Model
```php
class Role extends Model
{
    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'role_permissions',  // Pivot table
            'role_id',           // Foreign key on pivot
            'permission_id'      // Related key on pivot
        )->withTimestamps();
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles');
    }
}
```

### Permission Model
```php
class Permission extends Model
{
    public function roles()
    {
        return $this->belongsToMany(
            Role::class,
            'role_permissions',
            'permission_id',
            'role_id'
        )->withTimestamps();
    }
}
```

### Sync Method
```php
// Xóa tất cả permissions cũ và thêm mới
$role->permissions()->sync([1, 2, 3]);

// Chỉ thêm, không xóa
$role->permissions()->attach([4, 5]);

// Chỉ xóa
$role->permissions()->detach([1, 2]);

// Xóa tất cả
$role->permissions()->detach();
```

---

## Testing Scenarios

### ✅ Test 1: Load permissions
1. Mở modal sửa vai trò
2. Kiểm tra tất cả permissions hiển thị
3. Kiểm tra permissions của role được checked đúng

### ✅ Test 2: Chọn/bỏ chọn permissions
1. Click checkbox để chọn permission
2. Kiểm tra UI update ngay lập tức
3. Click lại để bỏ chọn
4. Kiểm tra counter "Đã chọn: X / Y"

### ✅ Test 3: Lưu permissions
1. Chọn một số permissions
2. Click "Lưu quyền"
3. Kiểm tra alert thành công
4. Reload modal → Kiểm tra permissions đã lưu

### ✅ Test 4: Validation
1. Gửi array rỗng: `permissions: []`
2. Gửi permission ID không tồn tại
3. Kiểm tra backend trả về lỗi validation

### ✅ Test 5: Concurrent updates
1. Mở 2 tab
2. Tab 1: Gán permissions A, B, C
3. Tab 2: Gán permissions D, E, F
4. Tab 2 lưu sau → Chỉ có D, E, F (sync overwrites)

---

## Error Handling

### 1. Permission không tồn tại
```json
{
  "message": "The selected permissions.0 is invalid.",
  "errors": {
    "permissions.0": ["The selected permissions.0 is invalid."]
  }
}
```

### 2. Role không tồn tại
```json
{
  "message": "Vai trò không tồn tại. Có thể đã bị xóa bởi người dùng khác.",
  "deleted": true
}
```

### 3. Network error
```javascript
catch (err) {
  if (!err.response) {
    alert("Lỗi kết nối. Vui lòng kiểm tra mạng.");
  }
}
```

---

## Best Practices

### ✅ DO
- Sử dụng `sync()` để đồng bộ permissions
- Load permissions mỗi khi mở modal
- Hiển thị loading state
- Validate permissions trước khi lưu
- Hiển thị số lượng permissions đã chọn
- Sử dụng optimistic updates cho UX tốt

### ❌ DON'T
- Không dùng `attach()` mà không `detach()` trước
- Không lưu permissions cùng với role info
- Không quên reload sau khi lưu
- Không skip validation
- Không hardcode permission IDs

---

## Performance Optimization

### 1. Eager Loading
```php
// ✅ Good
$role = Role::with('permissions')->find($id);

// ❌ Bad (N+1 query)
$role = Role::find($id);
$permissions = $role->permissions; // Separate query
```

### 2. Caching
```php
// Cache danh sách permissions (ít thay đổi)
$permissions = Cache::remember('all_permissions', 3600, function() {
    return Permission::all();
});
```

### 3. Batch Operations
```php
// ✅ Good - 1 query
$role->permissions()->sync([1, 2, 3, 4, 5]);

// ❌ Bad - 5 queries
foreach ($permissionIds as $id) {
    $role->permissions()->attach($id);
}
```

---

## Kết luận

Hệ thống gán quyền cho vai trò đã hoàn chỉnh với:
- ✅ UI/UX thân thiện
- ✅ Realtime updates
- ✅ Error handling đầy đủ
- ✅ Validation chặt chẽ
- ✅ Performance tối ưu
- ✅ Code clean, maintainable
