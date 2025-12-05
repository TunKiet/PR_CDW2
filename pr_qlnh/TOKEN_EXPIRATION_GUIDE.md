# Hướng dẫn Xử lý Token Expired

## Vấn đề

Khi JWT token hết hạn, API trả về lỗi:
```json
{
  "message": "Token has expired",
  "status": 401
}
```

Nếu không xử lý đúng, user sẽ thấy lỗi khó hiểu và không biết phải làm gì.

---

## Giải pháp

### 1. Axios Interceptor

**File:** `frontend/src/api/axiosClient.js`

**Chức năng:**
- Bắt tất cả lỗi 401 (Unauthorized)
- Kiểm tra message có chứa "expired" không
- Nếu có → Xóa token → Alert → Redirect về login

**Code:**
```javascript
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("🚨 API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || "";
      
      // Kiểm tra nếu token expired
      if (errorMessage.includes("expired") || errorMessage.includes("Token has expired")) {
        console.log("⚠️ Token đã hết hạn — đăng xuất và chuyển sang login");
        
        // Xóa token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Hiển thị thông báo
        alert("⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        
        // Redirect về login
        window.location.href = "/";
      } else {
        console.log("⚠️ Không có quyền truy cập");
      }
    }

    throw error;
  }
);
```

---

## Workflow

### Khi Token Expired

```
User thực hiện action (VD: Load roles)
  ↓
Frontend gửi request với token cũ
  ↓
Backend kiểm tra token → Token expired
  ↓
Backend trả về 401 + "Token has expired"
  ↓
Axios interceptor bắt lỗi 401
  ↓
Kiểm tra message có "expired"?
  ↓ YES
Xóa token & user từ localStorage
  ↓
Alert: "Phiên đăng nhập đã hết hạn"
  ↓
Redirect về "/" (LoginPage)
  ↓
User đăng nhập lại
  ↓
Nhận token mới
  ↓
Tiếp tục sử dụng app
```

---

## Xử lý ở Component

### Tránh Duplicate Alert

**Vấn đề:**
- Interceptor đã alert
- Component cũng alert
- User thấy 2 alert liên tiếp

**Giải pháp:**
```javascript
const loadRole = async () => {
  setLoading(true);
  try {
    const res = await getAllRole();
    setRole(res);
  } catch (err) {
    console.error("❌ Lỗi tải vai trò:", err);
    
    // Không alert nếu là token expired (đã xử lý ở interceptor)
    const errorMessage = err.response?.data?.message || err.message;
    if (!errorMessage.includes("expired") && !errorMessage.includes("Token has expired")) {
      alert(`Lỗi tải vai trò: ${errorMessage}`);
    }
  } finally {
    setLoading(false);
  }
};
```

---

## Backend JWT Configuration

### Laravel JWT-Auth

**File:** `config/jwt.php`

**Token TTL (Time To Live):**
```php
'ttl' => env('JWT_TTL', 60), // 60 phút
```

**Refresh TTL:**
```php
'refresh_ttl' => env('JWT_REFRESH_TTL', 20160), // 2 tuần
```

**Blacklist Enabled:**
```php
'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
```

### Tăng thời gian token

**File:** `.env`
```env
JWT_TTL=1440  # 24 giờ
JWT_REFRESH_TTL=43200  # 30 ngày
```

---

## Refresh Token Strategy

### Option 1: Manual Refresh

**Frontend:**
```javascript
const refreshToken = async () => {
  try {
    const response = await axiosClient.post('/auth/refresh');
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (err) {
    // Không refresh được → Logout
    localStorage.removeItem('token');
    window.location.href = '/';
  }
};
```

**Backend:**
```php
public function refresh()
{
    try {
        $newToken = auth()->refresh();
        return response()->json(['token' => $newToken]);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Token refresh failed'], 401);
    }
}
```

### Option 2: Auto Refresh trong Interceptor

```javascript
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const response = await axios.post('http://127.0.0.1:8000/api/auth/refresh', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const newToken = response.data.token;
        localStorage.setItem('token', newToken);

        // Retry request với token mới
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed → Logout
        localStorage.removeItem('token');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Testing

### Test 1: Token Expired
1. Login → Lấy token
2. Đợi token hết hạn (hoặc set TTL = 1 phút)
3. Thực hiện action (VD: Load roles)
4. **Expect:**
   - Alert: "Phiên đăng nhập đã hết hạn"
   - Redirect về login
   - Token đã bị xóa khỏi localStorage

### Test 2: Invalid Token
1. Set token = "invalid_token_string"
2. Thực hiện action
3. **Expect:**
   - Alert: "Phiên đăng nhập đã hết hạn"
   - Redirect về login

### Test 3: No Token
1. Xóa token khỏi localStorage
2. Truy cập trang cần auth
3. **Expect:**
   - Lỗi 401
   - Redirect về login

### Test 4: Valid Token
1. Login → Token còn hạn
2. Thực hiện action
3. **Expect:**
   - Action thành công
   - Không có alert
   - Không redirect

---

## Best Practices

### ✅ DO

1. **Xử lý tập trung ở interceptor**
   - Tất cả API calls đều qua axiosClient
   - Không cần xử lý ở từng component

2. **Xóa token khi expired**
   - Tránh gửi token cũ liên tục
   - Giảm số request không cần thiết

3. **Thông báo rõ ràng**
   - User hiểu tại sao bị logout
   - Biết phải làm gì tiếp theo

4. **Redirect về login**
   - Tự động chuyển trang
   - Không để user bị stuck

5. **Log errors**
   - Console.error để debug
   - Không log sensitive data

### ❌ DON'T

1. **Không alert nhiều lần**
   - Chỉ alert 1 lần ở interceptor
   - Component không alert lại

2. **Không hardcode routes**
   - Dùng constant hoặc config
   - Dễ maintain sau này

3. **Không skip validation**
   - Luôn check token trước khi gửi
   - Backend cũng phải validate

4. **Không lưu token ở cookie nếu dùng JWT**
   - localStorage hoặc sessionStorage
   - Tránh CSRF attacks

5. **Không set TTL quá dài**
   - Balance giữa UX và security
   - 24h là hợp lý cho web app

---

## Security Considerations

### 1. Token Storage

**localStorage:**
- ✅ Dễ implement
- ❌ Dễ bị XSS attack
- ✅ Không bị CSRF
- **Use case:** Web app thông thường

**sessionStorage:**
- ✅ Tự động xóa khi đóng tab
- ❌ Vẫn dễ bị XSS
- ✅ An toàn hơn localStorage một chút
- **Use case:** App cần security cao

**httpOnly Cookie:**
- ✅ Không thể access từ JS → Tránh XSS
- ❌ Dễ bị CSRF
- ✅ Cần CSRF token
- **Use case:** Enterprise app

### 2. Token Blacklist

**Khi logout:**
```php
public function logout()
{
    auth()->logout(); // Thêm token vào blacklist
    return response()->json(['message' => 'Logged out successfully']);
}
```

**Khi token expired:**
- Token tự động invalid
- Không cần blacklist

### 3. HTTPS Only

**Production:**
```javascript
// Chỉ gửi token qua HTTPS
if (window.location.protocol !== 'https:') {
  console.warn('⚠️ Token should only be sent over HTTPS');
}
```

---

## Troubleshooting

### Lỗi: "Token has expired" ngay sau khi login

**Nguyên nhân:**
- Server time khác client time
- JWT TTL quá ngắn

**Giải pháp:**
```bash
# Sync server time
sudo ntpdate -s time.nist.gov

# Tăng JWT TTL
JWT_TTL=1440  # 24h
```

### Lỗi: Redirect loop

**Nguyên nhân:**
- Login page cũng gọi API cần auth
- Interceptor redirect về login → Loop

**Giải pháp:**
```javascript
// Chỉ redirect nếu không phải ở login page
if (window.location.pathname !== '/') {
  window.location.href = '/';
}
```

### Lỗi: Token không bị xóa

**Nguyên nhân:**
- Có nhiều key trong localStorage
- Xóa sai key

**Giải pháp:**
```javascript
// Xóa tất cả auth data
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('refreshToken');
```

---

## Kết luận

Xử lý token expired đúng cách giúp:
- ✅ UX tốt hơn
- ✅ Security cao hơn
- ✅ Code clean hơn
- ✅ Dễ maintain
- ✅ Ít bug hơn

**Checklist:**
- [x] Interceptor bắt lỗi 401
- [x] Kiểm tra message "expired"
- [x] Xóa token & user
- [x] Alert thông báo
- [x] Redirect về login
- [x] Tránh duplicate alert
- [x] Log errors để debug
