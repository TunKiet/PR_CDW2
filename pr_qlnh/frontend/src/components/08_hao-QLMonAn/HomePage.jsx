import React, { useState, useEffect } from "react";
// Import CSS files
import "./HomePage.css";
import "./ReservationForm.css";

// Hàm tiện ích để định dạng tiền tệ
const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

// ===================================================================
// ReservationForm Component
// ===================================================================

function ReservationForm({ cart, onClose, formatCurrency }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "19:00", // Giá trị mặc định
    guests: 1,
    seating_area: "",
    notes: "",
  });

  // Tính tổng tiền và tiền đặt cọc
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deposit = total * 0.5;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đặt bàn:", { ...formData, cart, total, deposit });
    alert("✅ Yêu cầu đặt bàn đã được gửi!");
    onClose(); // Đóng form sau khi gửi
  };

  // Khóa scroll khi form mở
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);
  
  // Thiết lập ngày tối thiểu là hôm nay
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="reservation-overlay" onClick={onClose}>
      <div
        className="reservation-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
            &times;
        </button>
        <h2 className="reservation-title">Đặt Bàn Ngay</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* ...Các trường input khác (giữ nguyên) ... */}
            <div>
              <label>Tên của bạn *</label>
              <input name="name" value={formData.name} onChange={handleChange} required placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label>Số điện thoại *</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="090 123 4567" />
            </div>
            <div className="full">
              <label>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" />
            </div>
            <div>
              <label>Ngày đặt *</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} required min={today} />
            </div>
            <div>
              <label>Giờ đặt *</label>
              <input name="time" type="time" value={formData.time} onChange={handleChange} required />
            </div>
            <div className="full">
              <label>Số lượng khách *</label>
              <input name="guests" type="number" min="1" value={formData.guests} onChange={handleChange} required />
            </div>
          </div>

          <fieldset className="seating">
            <legend>Khu vực chỗ ngồi *</legend>
            <div className="seating-options">
              {["Trong nhà", "Ngoài trời", "Phòng VIP"].map((area) => (
                <label key={area}>
                  <input type="radio" name="seating_area" value={area} checked={formData.seating_area === area} onChange={handleChange} required />
                  <span>{area}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Tóm tắt đặt món trước (nếu có) */}
          {cart.length > 0 && (
            <div className="preorder-summary">
              <h3>🍽️ Tóm Tắt Đặt Món Trước</h3>
              <p>Tổng giá trị đơn hàng: <strong>{formatCurrency(total)}</strong></p>
              <p>Cần thanh toán trước (50%): <strong className="text-red">{formatCurrency(deposit)}</strong></p>
            </div>
          )}

          <div className="notes">
            <label>Ghi chú</label>
            <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} placeholder="Ví dụ: Bàn yên tĩnh, cần ghế trẻ em..." />
          </div>

          <button type="submit" className="submit-btn">
            Gửi Yêu Cầu Đặt Bàn
          </button>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// HomePage Component
// ===================================================================

export default function HomePage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showReservation, setShowReservation] = useState(false); // State điều khiển form đặt bàn
  const [toast, setToast] = useState(null);

  const todayMenu = [
    { id: 1, name: "Phở Bò Đặc Biệt", price: 65000, img: "https://placehold.co/250x180/f87171/fff?text=Phở+Bò" },
    { id: 2, name: "Bún Chả Hà Nội", price: 55000, img: "https://placehold.co/250x180/60a5fa/fff?text=Bún+Chả" },
    { id: 3, name: "Cơm Tấm Sườn Nướng", price: 50000, img: "https://placehold.co/250x180/facc15/000?text=Cơm+Tấm" },
  ];
  
  // Dữ liệu Ưu đãi mẫu
  const promotions = [
    { id: 1, title: "Giảm 20% Cho Thứ Ba", desc: "Giảm 20% tổng hóa đơn cho khách đặt bàn qua website vào các ngày Thứ Ba hàng tuần.", color: "#3b82f6" },
    { id: 2, title: "Tặng Cocktail Đặc Trưng", desc: "Tặng ngay 1 ly cocktail 'Sunset Dream' đặc trưng khi đặt chỗ cho nhóm 4 người trở lên.", color: "#10b981" },
    { id: 3, title: "Miễn Phí Phòng VIP", desc: "Miễn phí phí sử dụng Phòng VIP cho hóa đơn trên 5.000.000 VNĐ. Thích hợp cho các buổi tiệc riêng tư.", color: "#f97316" },
  ];

  const addToCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...dish, quantity: 1 }];
      }
    });
    setToast(`✅ Đã thêm ${dish.name} vào giỏ hàng`);
    setTimeout(() => setToast(null), 2000);
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="home-header">
        <nav className="home-navbar">
          <div className="nav-logo">🍜 Nhà Hàng Nhóm D</div>
          <ul className="nav-links">
            <li><a href="#home">Trang chủ</a></li>
            <li><a href="#menu">Thực đơn</a></li>
            <li><a href="#promotions">Ưu đãi</a></li>
            <li><a href="#reservation" className="btn-nav">Đặt bàn</a></li>
          </ul>
          <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
            🛒 <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
        </nav>
      </header>

      {/* Banner */}
      <section id="home" className="home-banner">
        <div className="banner-content">
          <h1>Chào mừng đến với Nhà hàng Nhóm D</h1>
          <p>Thưởng thức ẩm thực Việt Nam với hương vị truyền thống</p>
          <a href="#menu" className="btn-primary">Xem thực đơn</a>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="menu-section">
        <h2>Thực Đơn Hôm Nay</h2>
        <div className="menu-grid">
          {todayMenu.map((dish) => (
            <div className="menu-item" key={dish.id}>
              <img src={dish.img} alt={dish.name} />
              <h3>{dish.name}</h3>
              <p>{formatCurrency(dish.price)}</p>
              <button className="btn-add" onClick={() => addToCart(dish)}>
                + Đặt món
              </button>
            </div>
          ))}
        </div>
      </section>
      
      {/* Promotions Section (Mẫu) */}
      <section id="promotions" className="promo-section">
        <h2>Ưu Đãi Đặc Biệt ✨</h2>
        <div className="promo-grid">
            {promotions.map(promo => (
                <div key={promo.id} className="promo-item" style={{borderTopColor: promo.color}}>
                    <h3>{promo.title}</h3>
                    <p>{promo.desc}</p>
                    <a href="#reservation" className="btn-promo">Đặt chỗ ngay</a>
                </div>
            ))}
        </div>
      </section>
      
      {/* Reservation Anchor (Phần neo đặt bàn) */}
      <section id="reservation" className="reservation-anchor">
        <h2>Sẵn sàng thưởng thức?</h2>
        <button 
            className="btn-primary"
            onClick={() => setShowReservation(true)}
        >
            Đặt Bàn Ngay! 
        </button>
      </section>

      {/* Giỏ hàng popup */}
      {showCart && (
        <div className="cart-popup">
          <div className="cart-box">
            <h3>🛍️ Giỏ hàng</h3>
            <button className="close-btn" onClick={() => setShowCart(false)}>&times;</button>
            {cart.length === 0 ? (
              <p>Chưa có món nào.</p>
            ) : (
              <>
                <ul>
                  {cart.map((item) => (
                    <li key={item.id}>
                      <span>{item.name}</span>
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="cart-total">Tổng cộng: {formatCurrency(totalAmount)}</p>
                <div className="cart-actions">
                  <button className="checkout-btn">Thanh toán</button>
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

      {/* Reservation Form Popup */}
      {showReservation && (
        <ReservationForm
          cart={cart}
          onClose={() => setShowReservation(false)}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Toast thông báo */}
      {toast && <div className="toast">{toast}</div>}

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2024 Nhà hàng Nhóm D. All rights reserved.</p>
      </footer>
    </div>
  );
}