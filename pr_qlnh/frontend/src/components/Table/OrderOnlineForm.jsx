import React, { useState } from "react";
import "./OrderOnlineForm.css";

export default function OrderOnlineForm({ cart, onClose, formatCurrency }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    payment_method: "COD",
    notes: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      customer_name: formData.customer_name,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      payment_method: formData.payment_method,
      total: total,
      items: cart.map((i) => ({
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        price: i.price,
      })),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/order-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Lỗi khi gửi đơn hàng");

      alert("🎉 Đặt hàng thành công!");
      onClose();
    } catch (err) {
      alert("❌ Gửi đơn hàng thất bại");
      console.error(err);
    }
  };

  return (
    <div className="orderonline-overlay" onClick={onClose}>
      <div className="orderonline-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="title">🛒 Đặt hàng Online</h2>

        <form onSubmit={handleSubmit}>
          <label>Họ và tên *</label>
          <input
            name="customer_name"
            required
            value={formData.customer_name}
            onChange={handleChange}
          />

          <label>Số điện thoại *</label>
          <input
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Địa chỉ giao hàng *</label>
          <input
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
          />

          <label>Phương thức thanh toán *</label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
          >
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="BANK">Chuyển khoản ngân hàng</option>
          </select>

          <label>Ghi chú</label>
          <textarea
            rows="3"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <h3 className="total">
            Tổng tiền: {formatCurrency(total)}
          </h3>

          <button type="submit" className="submit-btn">
            Xác nhận đơn hàng
          </button>
        </form>
      </div>
    </div>
  );
}
