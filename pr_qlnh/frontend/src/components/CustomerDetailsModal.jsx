import React, { useState } from "react";
import { X } from "lucide-react";
import { formatCurrency, getRankColor } from "../data/customerData";

const CustomerDetailsModal = ({ customer, onClose, onSave }) => {
  const [edited, setEdited] = useState({
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });

  // ============================
  // VALIDATION RULES
  // ============================
  const validateName = (value) => {
    if (value.length > 32) return "Tên tối đa 32 ký tự.";
    return "";
  };

  const validatePhone = (value) => {
    if (value.length < 10 || value.length > 11)
      return "Số điện thoại phải từ 10–11 số.";
    return "";
  };

  // ============================
  // HANDLE CHANGE
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ====== VALIDATE NAME ======
    if (name === "name") {
  // Giữ tối đa 32 ký tự
  let filtered = value.slice(0, 32);

  setEdited((prev) => ({ ...prev, name: filtered }));

  // Không cần báo lỗi vì không còn validate
  setErrors((prev) => ({ ...prev, name: "" }));
}





    // ====== VALIDATE PHONE ======
    if (name === "phone") {
      // Chỉ giữ số
      let digits = value.replace(/\D/g, "");

      // Giới hạn tối đa 11 số
      if (digits.length > 11) digits = digits.slice(0, 11);

      setEdited((prev) => ({ ...prev, phone: digits }));

      setErrors((prev) => ({ ...prev, phone: validatePhone(digits) }));
    }
  };

  // ============================
  // HANDLE SAVE
  // ============================
  const handleSave = () => {
    const nameError = validateName(edited.name);
    const phoneError = validatePhone(edited.phone);

    if (nameError || phoneError) {
      setErrors({ name: nameError, phone: phoneError });
      return;
    }

    onSave({
      name: edited.name,
      phone: edited.phone,
    });
  };

  const totalSpent = customer?.total_spent ?? customer?.totalSpent ?? 0;
  const points = customer?.points ?? 0;
  const rank =
    customer?.rank ??
    (points >= 15000
      ? "Kim Cương"
      : points >= 5000
      ? "Vàng"
      : points >= 1500
      ? "Bạc"
      : "Đồng");

  const rankColor = getRankColor(rank);

  return (
    <div className="fixed inset-0 bg-gray-200/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6 px-4 py-4">

        <div className="flex justify-between items-center border-b mb-4">
          <h2 className="text-xl font-bold text-gray-800">Mã KH {customer.customer_id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
            <input
              type="text"
              name="name"
              value={edited.name}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 
                ${errors.name ? "border-red-500 shadow-sm shadow-red-300" : "border-gray-300"}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={edited.phone}
              onChange={handleChange}
              className={`w-full mt-1 border rounded-md p-2 
                ${errors.phone ? "border-red-500 shadow-sm shadow-red-300" : "border-gray-300"}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* TOTAL SPENT */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tổng chi tiêu</label>
            <input
              disabled
              value={formatCurrency(totalSpent)}
              className="w-full mt-1 border rounded-md p-2 bg-gray-100"
            />
          </div>

          {/* POINTS */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Điểm tích lũy</label>
            <input
              disabled
              value={`${points} điểm`}
              className="w-full mt-1 border rounded-md p-2 bg-gray-100 text-orange-600 font-bold"
            />
          </div>

          {/* RANK */}
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
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
