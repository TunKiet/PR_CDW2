// src/components/CustomerDetailsModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { formatCurrency, getRankColor } from "../data/customerData";

/**
 * Props:
 * - customer: object returned from API (customer_id, name, phone, total_spent, points, rank)
 * - onClose: fn
 * - onSave: fn(updatedFields)  // should only receive { name, phone }
 */
const CustomerDetailsModal = ({ customer, onClose, onSave }) => {
  const [edited, setEdited] = useState({
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Only send fields we intend to update (avoid sending total_spent or points)
    const payload = {
      name: edited.name,
      phone: edited.phone,
    };
    onSave(payload);
  };

  const totalSpent = customer?.total_spent ?? customer?.totalSpent ?? 0;
  const points = customer?.points ?? 0;
  const rank = customer?.rank ?? (points >= 15000 ? "Kim Cương" : points >= 5000 ? "Vàng" : points >= 1500 ? "Bạc" : "Đồng");
  const rankColor = getRankColor(rank);

  return (
<div className="fixed inset-0 bg-gray-200/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6 px-4 py-4">
        <div className="flex justify-between items-center border-b mb-4">
          <h2 className="text-xl font-bold text-gray-800">Mã KH{customer.customer_id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
            <input type="text" name="name" value={edited.name} onChange={handleChange} className="w-full mt-1 border rounded-md p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input type="text" name="phone" value={edited.phone} onChange={handleChange} className="w-full mt-1 border rounded-md p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tổng chi tiêu</label>
            <input disabled value={formatCurrency(totalSpent)} className="w-full mt-1 border rounded-md p-2 bg-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Điểm tích lũy</label>
            <input disabled value={`${points} điểm`} className="w-full mt-1 border rounded-md p-2 bg-gray-100 text-orange-600 font-bold" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hạng thành viên</label>
            <div className="mt-2">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${rankColor}`}>
                {rank}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Hạng tự động dựa trên điểm tích lũy (1.000đ = 1 điểm).</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Đóng</button>
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
