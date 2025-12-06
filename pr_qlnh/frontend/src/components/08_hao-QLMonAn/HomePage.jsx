import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import "./ReservationForm.css";
import MenuItemModal from "../MenuItemModal";
import OrderOnlineForm from "../OrderOnlineForm"; // <-- đảm bảo đường dẫn đúng
import UserChat from "../Chat/UserChat";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Format tiền
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
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Số điện thoại *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="full">
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
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
  
  // Modal & Cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showOrderOnline, setShowOrderOnline] = useState(false);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Data từ API
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  // Filter & Pagination
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Loading states
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);

  // ================= CHECK LOGIN =================
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
    // Fetch Featured Dishes
    fetch(`${API_BASE_URL}/v1/featured-dishes`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setFeaturedDishes(data.data);
        }
      })
      .catch((err) => console.error("Lỗi tải món nổi bật:", err))
      .finally(() => setIsLoadingFeatured(false));

    // Fetch Categories
     fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // ✅ Chỉ lấy categories KHÔNG bị ẩn
          const visibleCategories = data.data.filter(cat => cat.is_hidden !== 1);
          setCategories(visibleCategories);
        }
      })
      .catch((err) => console.error("Lỗi tải danh mục:", err))
      .finally(() => setIsLoadingCategories(false));
    // Fetch Active Promotions
    fetch(`${API_BASE_URL}/v1/active-promotions`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPromotions(data.data);
        }
      })
      .catch((err) => console.error("Lỗi tải ưu đãi:", err))
      .finally(() => setIsLoadingPromotions(false));

    // Fetch All Menu Items
    fetch(`${API_BASE_URL}/menu-items`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMenuItems(data);
          setFilteredItems(data);
        } else if (data.success === true && Array.isArray(data.data)) {
          setMenuItems(data.data);
          setFilteredItems(data.data);
        } else {
          console.error("API response không đúng format:", data);
          setMenuItems([]);
          setFilteredItems([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi tải menu:", err);
        setMenuItems([]);
        setFilteredItems([]);
      });
  }, []);

  // ================= FILTER BY CATEGORY =================
  const filterByCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((i) => i.category_id === catId));
    }
    setCurrentPage(1);
  };

  // ================= PAGINATION =================
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = Array.isArray(filteredItems)
    ? filteredItems.slice(firstIndex, lastIndex)
    : [];
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // ================= CART FUNCTIONS =================
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
            <li><a href="#featured">Món nổi bật</a></li>
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

      {/* ===== FEATURED DISHES SECTION ===== */}
      <section id="featured" className="featured-section py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">
          ⭐ Món Ăn Nổi Bật
        </h2>

        {isLoadingFeatured ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : featuredDishes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Chưa có món nổi bật nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
            {featuredDishes.map((dish) => (
              <div
                key={dish.menu_item_id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={dish.image_url || "https://placehold.co/600x400"}
                    alt={dish.menu_item_name}
                    className="w-full h-full object-cover cursor-pointer hover:scale-110 transition duration-300"
                    onClick={() => {
                      setSelectedItem(dish);
                      setShowModal(true);
                    }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {dish.menu_item_name}
                    </h3>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      ⭐ Nổi bật
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {dish.description || "Món ăn đặc biệt của nhà hàng"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(dish.price)}
                    </span>
                    <button
                      onClick={() => onAddToCart(dish)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                  {dish.category && (
                    <div className="mt-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {dish.category.category_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== MENU SECTION ===== */}
      <section id="menu" className="menu-section py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          🍽️ Thực Đơn Đầy Đủ
        </h2>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 px-4">
          <button
            className={`px-5 py-2 rounded-full transition ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => filterByCategory("all")}
          >
            Tất cả
          </button>

          {isLoadingCategories ? (
            <span className="text-gray-500">Đang tải danh mục...</span>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.category_id}
                className={`px-5 py-2 rounded-full transition ${
                  selectedCategory === cat.category_id
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => filterByCategory(cat.category_id)}
              >
                {cat.category_name}
              </button>
            ))
          )}
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 px-4 max-w-7xl mx-auto">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
                key={item.menu_item_id}
                className="bg-white rounded-2xl p-4 shadow-lg border hover:border-indigo-400 transition"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.menu_item_name}
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                    className="rounded-xl mb-3 w-full h-36 object-cover cursor-pointer hover:opacity-90 transition"
                  />
                )}
                <h5
                  className="font-semibold text-gray-800 truncate cursor-pointer hover:text-indigo-600 transition"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowModal(true);
                  }}
                >
                  {item.menu_item_name}
                </h5>
                <p className="text-indigo-600 font-semibold mt-1">
                  {formatCurrency(item.price)}
                </p>
                <button
                  onClick={() => onAddToCart(item)}
                  className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                  ➕ Thêm vào giỏ
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full py-10">
              Không tìm thấy món nào.
            </p>
          )}
        </div>

        {/* UserChat Component */}
        <UserChat />

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              ◀ Trước
            </button>
            <span className="font-semibold text-lg">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Sau ▶
            </button>
          </div>
        )}
      </section>

      {/* ===== PROMOTIONS SECTION ===== */}
      <section
        id="promotions"
        className="promo-section py-12 bg-gradient-to-r from-purple-50 to-pink-50"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          🎁 Ưu Đãi Đặc Biệt
        </h2>

        {isLoadingPromotions ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải ưu đãi...</p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Hiện chưa có ưu đãi nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
            {promotions.map((promo) => (
              <div
                key={promo.promotion_id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border-t-4"
                style={{ borderTopColor: "#3b82f6" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                    {promo.discount_type === "percent"
                      ? `-${promo.discount_value}%`
                      : `-${formatCurrency(promo.discount_value)}`}
                  </span>
                  <span className="text-xs text-gray-500">
                    Mã: {promo.code}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {promo.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {promo.description}
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  {promo.expired_at && (
                    <p>
                      ⏰ Hết hạn:{" "}
                      {new Date(promo.expired_at).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                  {promo.max_uses > 0 && (
                    <p>📊 Còn: {promo.max_uses - promo.used_count} lượt</p>
                  )}
                </div>
                <a
                  href="#reservation"
                  className="block text-center py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Đặt ngay
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reservation Section */}
      <section id="reservation" className="reservation-anchor py-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          Sẵn sàng thưởng thức?
        </h2>
        <div className="flex justify-center">
          <button
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg text-xl transition transform hover:scale-105"
            onClick={() => setShowReservation(true)}
          >
            Đặt bàn ngay 🍽️
          </button>
        </div>
      </section>

      {/* Cart Popup */}
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
                    Đặt hàng online
                  </button>
                  <button
                    className="book-btn"
                    onClick={() => {
                      setShowCart(false);
                      setShowReservation(true);
                    }}
                  >
                    Đặt bàn
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setShowModal(false)}
          onAddToCart={onAddToCart}
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