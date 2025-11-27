import React, { useState, useEffect } from "react";
import "./OrderOnlineForm.css";

// =============================
//   Cấu hình cửa hàng
// =============================
const STORE = {
  provinceID: 202, // TP HCM
  districtID: 1442, // Thủ Đức
  wardCode: "10009", // Ví dụ: Phường Linh Chiểu (anh sẽ set lại khi load API)
};

const SHIP_FEE = {
  sameWard: 10000,
  sameDistrict: 15000,
  otherDistrict: 25000,
};

export default function OrderOnlineForm({ cart, onClose, formatCurrency }) {
  const GHN_TOKEN = "904309ca-c68b-11f0-98a8-26ecb93cdd82"; // <-- THAY BẰNG TOKEN GHN CỦA EM

  // =============================
  // State dữ liệu địa chỉ từ API
  // =============================
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    payment_method: "cod",
  });

  const [shippingFee, setShippingFee] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [notes, setNotes] = useState({});

  // ================================
  // Tính tổng tiền
  // ================================
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingFee - discountAmount;

  // ================================
  // FORM CHANGE
  // ================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNoteChange = (id, text) => {
    setNotes({ ...notes, [id]: text });
  };

  // ================================
  // Load danh sách TỈNH
  // ================================
  useEffect(() => {
    fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
      headers: { Token: GHN_TOKEN },
    })
      .then((res) => res.json())
      .then((data) => setProvinces(data.data))
      .catch((err) => console.error("Province API Error:", err));
  }, []);

  // ================================
  // Load QUẬN theo TỈNH
  // ================================
  useEffect(() => {
    if (!formData.province) return;

    fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: GHN_TOKEN,
      },
      body: JSON.stringify({ province_id: Number(formData.province) }),
    })
      .then((res) => res.json())
      .then((data) => setDistricts(data.data))
      .catch((err) => console.error("District API Error:", err));
  }, [formData.province]);

  // ================================
  // Load PHƯỜNG theo QUẬN
  // ================================
  useEffect(() => {
    if (!formData.district) return;

    fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: GHN_TOKEN,
      },
      body: JSON.stringify({ district_id: Number(formData.district) }),
    })
      .then((res) => res.json())
      .then((data) => setWards(data.data))
      .catch((err) => console.error("Ward API Error:", err));
  }, [formData.district]);

  // ========================================================
  // Tính PHÍ SHIP theo TP HCM → Thủ Đức → Phường
  // ========================================================
  useEffect(() => {
    if (!formData.province || !formData.district) return;

    const p = Number(formData.province);
    const d = Number(formData.district);
    const w = formData.ward;

    if (p !== STORE.provinceID) {
      setShippingFee(50000); // Tỉnh khác
      return;
    }

    if (d === STORE.districtID) {
      // Cùng TP Thủ Đức
      if (w === STORE.wardCode) setShippingFee(SHIP_FEE.sameWard);
      else setShippingFee(SHIP_FEE.sameDistrict);
    } else {
      // Quận khác TP.HCM
      setShippingFee(SHIP_FEE.otherDistrict);
    }
  }, [formData.province, formData.district, formData.ward]);

  // ================================
  // Áp dụng mã giảm giá
  // ================================
  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase();

    if (code === "GIAM10") {
      setDiscountAmount(subtotal * 0.1);
      alert("Bạn được giảm 10%!");
    } else if (code === "FREESHIP") {
      setDiscountAmount(shippingFee);
      alert("Bạn đã được miễn phí ship!");
    } else if (code === "SALE50") {
      setDiscountAmount(50000);
      alert("Bạn được giảm 50.000đ!");
    } else {
      alert("❌ Mã giảm giá không tồn tại");
      setDiscountAmount(0);
    }
  };

  // ================================
  // Submit đơn hàng
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        customer_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        address_detail: formData.address,
        payment_method: formData.payment_method,
        ship_fee: shippingFee,
        discount: discountAmount,
        subtotal,
        total,
        items: cart.map(item => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            price: item.price,
            note: notes[item.menu_item_id] || null
        }))
    };

    try {
        const res = await fetch("http://127.0.0.1:8000/api/order-online", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("ORDER RESPONSE:", data);

        if (!res.ok) {
            alert("❌ Lỗi: " + JSON.stringify(data));
            return;
        }

        alert("🎉 Đặt hàng thành công!");
        onClose();

    } catch (error) {
        console.error("ORDER ERROR:", error);
        alert("❌ Không thể gửi đơn hàng (CORS hoặc server down)");
    }
};


  // Khóa scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // ================================
  // UI OUTPUT
  // ================================
  return (
    <div className="order-form-overlay" onClick={onClose}>
      <div className="order-form-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="title">Thông tin giao hàng</h2>

        <div className="order-grid">
          {/* ================= LEFT FORM ================= */}
          <form className="order-left" onSubmit={handleSubmit}>
            <input name="name" placeholder="Họ và tên" required onChange={handleChange} />
            <div className="row-2">
              <input name="email" placeholder="Email" onChange={handleChange} />
              <input name="phone" placeholder="Số điện thoại" required onChange={handleChange} />
            </div>

            <input name="address" placeholder="Địa chỉ (Số nhà, đường…)" required onChange={handleChange} />

            {/* Tỉnh */}
            <select name="province" value={formData.province} onChange={handleChange} required>
              <option value="">Chọn Tỉnh / Thành</option>
              {Array.isArray(provinces) && provinces.map((p) => (
                <option key={p.ProvinceID} value={p.ProvinceID}>
                  {p.ProvinceName}
                </option>
              ))}
            </select>

            {/* Quận */}
            <select name="district" value={formData.district} onChange={handleChange} required>
              <option value="">Chọn Quận / Huyện</option>
              {Array.isArray(districts) && districts.map((d) => (
                <option key={d.DistrictID} value={d.DistrictID}>
                  {d.DistrictName}
                </option>
              ))}
            </select>

            {/* Phường */}
            <select name="ward" value={formData.ward} onChange={handleChange} required>
              <option value="">Chọn Phường / Xã</option>
              {Array.isArray(wards) && wards.map((w) => (
                <option key={w.WardCode} value={w.WardCode}>
                  {w.WardName}
                </option>
              ))}
            </select>

            <h3 className="sub-title">Mã giảm giá</h3>
            <div className="row-2">
              <input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Nhập mã..." />
              <button type="button" className="apply-btn" onClick={applyDiscount}>Áp dụng</button>
            </div>

            <h3 className="section-title">Phương thức thanh toán</h3>

<div className="payment-methods">

  {/* COD */}
  <label className={`payment-option ${formData.payment_method === "cod" ? "active" : ""}`}>
    <input
      type="radio"
      name="payment_method"
      value="cod"
      checked={formData.payment_method === "cod"}
      onChange={handleChange}
    />

    <div className="payment-content">
      {/* <img src="/cod-icon.png" alt="COD" className="payment-icon" /> */}
      <span>Thanh toán khi giao hàng (COD)</span>
    </div>
  </label>

  {/* BANK TRANSFER */}
  <label className={`payment-option ${formData.payment_method === "bank" ? "active" : ""}`}>
    <input
      type="radio"
      name="payment_method"
      value="bank"
      checked={formData.payment_method === "bank"}
      onChange={handleChange}
    />

    <div className="payment-content">
      {/* <img src="/bank-icon.png" alt="BANK" className="payment-icon" /> */}
      <span>Chuyển khoản qua ngân hàng</span>
    </div>
  </label>

</div>


            <button type="submit" className="submit-order-btn">HOÀN TẤT ĐƠN HÀNG</button>
          </form>

          {/* ================= RIGHT CART ================= */}
          <div className="order-right">
            <h3 className="cart-title">Đơn hàng của bạn</h3>

            {cart.map((item) => (
              <div key={item.menu_item_id} className="cart-item">
                <img src={item.image_url} alt="" />

                <div className="item-info">
                  <p className="name">{item.menu_item_name}</p>
                  <p className="qty">{item.quantity} × {formatCurrency(item.price)}</p>

                  <textarea
                    className="note-box"
                    placeholder="Ghi chú món..."
                    value={notes[item.menu_item_id] || ""}
                    onChange={(e) => handleNoteChange(item.menu_item_id, e.target.value)}
                  />
                </div>

                <strong className="item-total">{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}

            <div className="total-line"><span>Tạm tính</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className="total-line"><span>Phí ship</span><strong>{formatCurrency(shippingFee)}</strong></div>
            <div className="total-line"><span>Giảm giá</span><strong>-{formatCurrency(discountAmount)}</strong></div>

            <div className="total-line total-final">
              <span>Tổng cộng</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
