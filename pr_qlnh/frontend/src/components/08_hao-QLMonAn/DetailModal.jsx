// src/components/DetailModal.jsx

import React from 'react';

// === HÀM HỖ TRỢ VÀ MAPS (Đồng bộ với DishCRUDTable.jsx) ===
const categoryMap = {
    '1': "Món Chính",
    '2': "Tráng Miệng",
    '3': "Đồ Uống",
};

const statusMap = {
    'active': "Còn hàng",
    'inactive': "Hết hàng",
    'draft': "Nháp/Ẩn",
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND', 
        minimumFractionDigits: 0 
    }).format(amount);
};
// ============================================================

export default function DetailModal({ isVisible, onClose, dish }) {
    if (!isVisible || !dish) return null;

    // Lấy thông tin đã map
    const categoryName = categoryMap[dish.categoryKey] || 'Chưa phân loại';
    const statusName = statusMap[dish.statusKey] || 'N/A';
    const priceFormatted = formatCurrency(dish.price);

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
            
            {/* Modal Content */}
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800">Chi Tiết Món Ăn: {dish.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>

                {/* Body Content (Có thể cuộn) */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    
                    {/* Hình ảnh */}
                    <div className="flex justify-center mb-4">
                        <img 
                            src={dish.image} 
                            alt={dish.name} 
                            className="w-full max-h-64 object-cover rounded-lg border shadow-md"
                            onError={(e) => e.target.src = 'https://placehold.co/400x200/e5e7eb/4b5563?text=No+Image'}
                        />
                    </div>

                    {/* Chi tiết */}
                    <DetailItem label="ID Món Ăn" value={dish.id} />
                    <DetailItem label="Giá Bán" value={priceFormatted} highlight={true} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Danh Mục" value={categoryName} />
                        <DetailItem label="Trạng Thái" value={statusName} status={dish.statusKey} />
                    </div>
                    
                    <div className="pt-4 border-t mt-4">
                        <DetailItem label="Mô Tả Chi Tiết" value={dish.description || "Không có mô tả."} fullWidth={true} />
                    </div>
                    
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t flex justify-end">
                    <button onClick={onClose} className="dish-button-secondary dish-button-base">Đóng</button>
                </div>
            </div>
        </div>
    );
}

// Sub-component cho các item chi tiết
function DetailItem({ label, value, highlight = false, fullWidth = false, status = null }) {
    const statusClasses = status === 'active' 
        ? 'bg-green-100 text-green-800' 
        : status === 'inactive' 
        ? 'bg-red-100 text-red-800' 
        : status === 'draft'
        ? 'bg-yellow-100 text-yellow-800'
        : 'text-gray-900';
    
    return (
        <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-1/2'}`}>
            <span className="text-sm font-medium text-gray-500">{label}</span>
            {status ? (
                 <span className={`mt-1 px-2 py-0.5 inline-flex text-sm font-semibold rounded ${statusClasses}`}>
                    {value}
                </span>
            ) : (
                <span className={`text-lg font-semibold ${highlight ? 'text-emerald-600' : 'text-gray-900'}`}>{value}</span>
            )}
        </div>
    );
}