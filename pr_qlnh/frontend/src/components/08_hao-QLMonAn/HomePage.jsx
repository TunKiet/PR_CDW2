import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import "./ReservationForm.css";
import MenuItemModal from "../MenuItemModal";
import OrderOnlineForm from "../OrderOnlineForm"; // <-- đảm bảo đường dẫn đúng
import UserChat from "../Chat/UserChat"

// =========================
// FORMAT TIỀN
// =========================
const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

// ===================================================================
// ReservationForm Component
// ===================================================================
function ReservationForm({ cart, onClose, formatCurrency }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "19:00",
    guests: 1,
    seating_area: "",
    notes: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deposit = total * 0.5;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Yêu cầu đặt bàn đã được gửi!");
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="reservation-overlay" onClick={onClose}>
      <div className="reservation-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="reservation-title">Đặt Bàn Ngay</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Tên *</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label>Số điện thoại *</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="full">
              <label>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div>
              <label>Ngày *</label>
              <input type="date" min={today} name="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div>
              <label>Giờ *</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>

            <div className="full">
              <label>Số lượng khách *</label>
              <input type="number" min="1" name="guests" value={formData.guests} onChange={handleChange} required />
            </div>
          </div>

          <fieldset className="seating">
            <legend>Khu vực chỗ ngồi *</legend>
            <div className="seating-options">
              {["Trong nhà", "Ngoài trời", "Phòng VIP"].map((area) => (
                <label key={area}>
                  <input
                    type="radio"
                    name="seating_area"
                    value={area}
                    checked={formData.seating_area === area}
                    onChange={handleChange}
                    required
                  />
                  <span>{area}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {cart.length > 0 && (
            <div className="preorder-summary">
              <h3>🍽️ Tóm Tắt Đặt Món Trước</h3>
              <p>Tổng: <strong>{formatCurrency(total)}</strong></p>
              <p>Cọc 50%: <strong className="text-red">{formatCurrency(deposit)}</strong></p>
            </div>
          )}

          <div className="notes">
            <label>Ghi chú</label>
            <textarea rows="3" name="notes" value={formData.notes} onChange={handleChange} />
          </div>

          <button type="submit" className="submit-btn">Gửi Yêu Cầu Đặt Bàn</button>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// HomePage Component
// ===================================================================
export default function HomePage() {
  const navigate = useNavigate();
  
  // User state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Cart
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showOrderOnline, setShowOrderOnline] = useState(false);
  const [toast, setToast] = useState(null);

  // Menu Items
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);
  
  // Logout handler
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
      setUser(null);
      setIsLoggedIn(false);
      alert("Đã đăng xuất thành công!");
      navigate("/");
    }
  };

  // ================= FETCH DATA =================
  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/menu-items")
    .then((res) => res.json())
    .then((data) => {
      const items = Array.isArray(data) ? data : data.data ?? [];
      setMenuItems(items);
      setFilteredItems(items);
    })
    .catch((err) => console.error("Lỗi tải menu:", err));
}, []);

  // ================= FILTER BY CATEGORY =================
  const filterByCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((i) => i.category_id === cat));
    }
    setCurrentPage(1);
  };

  // ================= PAGINATION =================
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredItems.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // ================= CART =================
  const onAddToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((x) => x.menu_item_id === item.menu_item_id);
      if (exists) {
        return prev.map((x) =>
          x.menu_item_id === item.menu_item_id
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    setToast(`Đã thêm ${item.menu_item_name} vào giỏ`);
    setTimeout(() => setToast(null), 1500);
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.menu_item_id === id
            ? { ...i, quantity: i.quantity + amount }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <div className="home-container">

      {/* Header */}
      <header className="home-header">
        <nav className="home-navbar">
          <div className="nav-logo">🍜 Nhà Hàng Nhóm D</div>
          <ul className="nav-links">
            <li><a href="#home">Trang chủ</a></li>
            <li><a href="#menu">Thực đơn</a></li>
            <li><a href="#promotions">Ưu đãi</a></li>
            <li><a href="#reservation">Đặt bàn</a></li>
          </ul>

          <div className="flex items-center gap-4">
            {isLoggedIn && user && (
              <div className="flex items-center gap-3">
                <div className="user-dropdown-container relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition text-sm font-medium text-gray-700"
                  >
                    <span>👤</span>
                    <span>{user.full_name || user.username || "Khách"}</span>
                    <span className="text-xs">{showUserDropdown ? '▲' : '▼'}</span>
                  </button>
                  
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.full_name || user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate('/settings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span>👤</span>
                        <span>Thông tin cá nhân</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate('/activity-log');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span>📋</span>
                        <span>Nhật ký hoạt động</span>
                      </button>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <span>🚪</span>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!isLoggedIn && (
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium"
              >
                Đăng nhập
              </button>
            )}
            <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
              🛒 <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Banner */}
      <section id="home" className="home-banner">
        <div className="banner-content">
          <h1>Chào mừng đến với Nhà hàng Nhóm D</h1>
          <p>Thưởng thức ẩm thực Việt Nam với hương vị truyền thống</p>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="menu-section">
        <h2 className="text-2xl font-bold text-center mb-6">🍽️ Danh Sách Món</h2>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {[
            { id: "all", name: "Tất cả" },
            { id: 1, name: "Món chính" },
            { id: 2, name: "Món phụ" },
            { id: 3, name: "Món khai vị" },
            { id: 4, name: "Đồ uống" },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => filterByCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 px-2 py-4">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
  key={item.menu_item_id}
  className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-gray-100 hover:border-indigo-400 transition"
>

  {/* CLICK VÀO HÌNH → MỞ MODAL */}
  {item.image_url && (
    <img
      src={item.image_url}
      alt={item.menu_item_name}
      onClick={() => {
        setSelectedItem(item);
        setShowModal(true);
      }}
      className="rounded-xl mb-3 w-full h-36 object-cover cursor-pointer"
    />
  )}

  {/* CLICK VÀO TÊN → MỞ MODAL */}
  <h5
    className="font-semibold text-gray-800 truncate cursor-pointer"
    onClick={() => {
      setSelectedItem(item);
      setShowModal(true);
    }}
  >
    {item.menu_item_name}
  </h5>

  {/* GIÁ */}
  <p className="text-indigo-600 font-semibold mt-1">
    {new Intl.NumberFormat("vi-VN").format(item.price)}đ
  </p>

  {/* NÚT THÊM VÀO GIỎ HÀNG */}
  <button
    onClick={() => onAddToCart(item)}
    className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
  >
    ➕ Thêm vào giỏ hàng
  </button>

</div>

            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full py-10">
              Không tìm thấy món nào.
            </p>
          )}
        </div>
        <UserChat />

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            }`}
          >
            ◀ Trang trước
          </button>

          <span className="font-semibold text-lg">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            }`}
          >
            Trang sau ▶
          </button>
        </div>
      </section>

      {/* Promotion Section */}
      <section id="promotions" className="promo-section">
        <h2 className="text-2xl font-bold mb-4 text-center">🎁 Ưu Đãi Đặc Biệt</h2>

        <div className="promo-grid">
          {[
            { id: 1, title: "Giảm 20% Thứ Ba", desc: "Áp dụng cho đặt bàn online.", color: "#3b82f6" },
            { id: 2, title: "Tặng Cocktail", desc: "Cho nhóm từ 4 người trở lên.", color: "#10b981" },
            { id: 3, title: "Miễn phí phòng VIP", desc: "Cho hóa đơn từ 5.000.000đ.", color: "#f97316" },
          ].map((promo) => (
            <div key={promo.id} className="promo-item" style={{ borderTopColor: promo.color }}>
              <h3>{promo.title}</h3>
              <p>{promo.desc}</p>
              <a href="#reservation" className="btn-promo">Đặt ngay</a>
            </div>
          ))}
        </div>
      </section>

      {/* Reservation Section */}
      <section id="reservation" className="reservation-anchor mt-10">
        <h2 className="text-2xl font-bold text-center mb-3">Sẵn sàng thưởng thức?</h2>
        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg text-lg transition"
            onClick={() => setShowReservation(true)}
          >
            Đặt bàn ngay 🍽️
          </button>
        </div>
      </section>

      {/* Cart */}
      {showCart && (
        <div className="cart-popup">
          <div className="cart-box">
            <h3>🛍️ Giỏ hàng</h3>
            <button className="close-btn" onClick={() => setShowCart(false)}>
              &times;
            </button>

            {cart.length === 0 ? (
              <p>Chưa có món nào.</p>
            ) : (
              <>
                <ul>
                  {cart.map((item) => (
                    <li key={item.menu_item_id}>
                      <span>{item.menu_item_name}</span>

                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.menu_item_id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.menu_item_id, +1)}>+</button>
                      </div>

                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <p className="cart-total">
                  Tổng cộng: {formatCurrency(totalAmount)}
                </p>

                <div className="cart-actions">
                  <button
  className="checkout-btn"
  onClick={() => {
    setShowCart(false);
    setShowOrderOnline(true);
  }}
>
  Thanh toán
</button>



                  
                </div>
              </>
            )}
          </div>
        </div>
      )}

      
{showModal && (
  <MenuItemModal
    item={selectedItem}
    onClose={() => setShowModal(false)}
    onAddToCart={onAddToCart}   // <-- thêm dòng này
  />
)}
      {/* Form đặt bàn */}
      {showReservation && (
        <ReservationForm
          cart={cart}
          onClose={() => setShowReservation(false)}
          formatCurrency={formatCurrency}
        />
      )}
       {/* Form đặt hàng online */}
      {showOrderOnline && (
  <div className="order-online-overlay" onClick={() => setShowOrderOnline(false)}>
    <div className="order-online-box" onClick={(e) => e.stopPropagation()}>
      <OrderOnlineForm
        cart={cart}
        onClose={() => setShowOrderOnline(false)}
        formatCurrency={formatCurrency}
      />
    </div>
  </div>
)}

      
      




      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2024 Nhà hàng Nhóm D. All rights reserved.</p>
      </footer>
    </div>
  );
}
