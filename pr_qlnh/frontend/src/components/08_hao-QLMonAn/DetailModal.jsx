// src/components/DetailModal.jsx

import React from 'react';
// === DRAFT.JS IMPORTS ===
// Cần draftjs-to-html để chuyển JSON thành HTML
import draftToHtml from 'draftjs-to-html';
// Cần convertFromRaw để chuyển đổi RawContentState JSON thành ContentState
// import { convertFromRaw } from 'draft-js'; 

// ========================

// Status map
const statusMap = {
  active: "Còn hàng",
  inactive: "Hết hàng",
  draft: "Nháp/Ẩn",
};

// Map danh mục (Bạn cần lấy dữ liệu categories từ API và truyền xuống DetailModal)
// Giả định categories là một mảng object có cấu trúc { category_id, category_name }
const categoryMap = {
  1: "Món Chính",
  2: "Tráng Miệng",
  3: "Đồ Uống",
}; // (Hãy điều chỉnh map này nếu categories của bạn khác)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function DetailModal({ isVisible, onClose, dish, categories }) {
    if (!isVisible || !dish) return null;

    console.log("Dữ liệu Mô tả (dish.description):", dish.description);
    let htmlDescription = 'Không có mô tả chi tiết.';
    
    // Tìm tên danh mục nếu categories được truyền vào
    const categoryName = categories?.find(cat => String(cat.category_id) === String(dish.categoryKey))?.category_name || categoryMap[dish.categoryKey] || 'N/A';
    
    // === LOGIC XỬ LÝ CHUYỂN ĐỔI JSON MÔ TẢ THÀNH HTML (Draft.js -> HTML) ===
    if (dish.description) {
        try {
            // 1. Thử parse chuỗi JSON từ Draft.js
            const rawContentState = JSON.parse(dish.description);
            
            // Kiểm tra xem có đúng định dạng Draft.js RawContentState không
            if (rawContentState.blocks && Array.isArray(rawContentState.blocks)) {
                // 2. Chuyển RawContentState object thành ContentState
                // const contentState = convertFromRaw(rawContentState); 
                // 3. Chuyển ContentState thành HTML để hiển thị
                htmlDescription = draftToHtml(rawContentState);
                // console.log("HTML được tạo ra:", htmlDescription);
            } else {
                // Nếu JSON không đúng cấu trúc Draft.js, hiển thị nội dung thô
                htmlDescription = dish.description;
            }
        } catch (e) {
            // 4. Trường hợp lỗi parse JSON (dữ liệu cũ là text/HTML), hiển thị nội dung thô
            console.warn(`Lỗi khi tải description cũ: ${e.name}: ${e.message}. Chuyển đổi từ text/HTML.`);
            htmlDescription = dish.description;
        }
    }
    // ===================================================================

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl transform transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                    Chi Tiết Món Ăn: {dish.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cột 1: Ảnh và ID */}
                    <div className="md:col-span-1 space-y-4">
                        <img 
                            src={dish.image} 
                            alt={dish.name} 
                            className="w-full h-auto object-cover rounded-lg shadow-md border"
                            onError={(e) => (e.target.src = "https://placehold.co/300x200/e5e7eb/4b5563?text=N/A")}
                        />
                        <p className="text-sm text-gray-500">
                            <strong>ID:</strong> {dish.id}
                        </p>
                    </div>

                    {/* Cột 2 & 3: Thông tin chi tiết */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-gray-700">
                            <p>
                                <strong>Danh Mục:</strong> {categoryName}
                            </p>
                            <p>
                                <strong>Giá Bán:</strong> <span className="text-xl font-semibold text-emerald-600">{formatCurrency(dish.price)}</span>
                            </p>
                            <p>
                                <strong>Trạng Thái:</strong>
                                <span className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${
                                    dish.statusKey === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}>
                                    {statusMap[dish.statusKey] || 'N/A'}
                                </span>
                            </p>
                            <p>
                                <strong>Tên Món:</strong> {dish.name}
                            </p>
                        </div>
                        
                        {/* Mô tả Chi tiết */}
                        <div className="mt-4 border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mô Tả Chi Tiết</h4>
                            <div 
                                className="p-3 border rounded-lg bg-gray-50 text-gray-600"
                                // SỬ DỤNG dangerouslySetInnerHTML để render HTML đã chuyển đổi
                                dangerouslySetInnerHTML={{ __html: htmlDescription }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Nút Đóng */}
                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-150"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}