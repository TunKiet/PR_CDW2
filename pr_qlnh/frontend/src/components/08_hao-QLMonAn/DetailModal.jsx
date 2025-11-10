// src/components/DetailModal.jsx

import React from 'react';

// Dùng lại các hàm hỗ trợ
const statusMap = {
  'active': "Còn hàng",
  'inactive': "Hết hàng",
  'draft': "Nháp/Ẩn",
};

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND', 
      minimumFractionDigits: 0 
    }).format(amount);
};


export default function DetailModal({ isVisible, onClose, dish, categories }) {
    if (!isVisible || !dish) return null;

    // Hàm hỗ trợ lấy tên danh mục
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => String(cat.category_id) === String(categoryId));
        return category ? category.category_name : 'N/A';
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                
                {/* Header */}
                <div className="dish-modal-header pb-4 border-b border-gray-200 mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Chi Tiết Món Ăn: {dish.name}
                    </h3>
                    <button onClick={onClose} className="dish-modal-close-btn" title="Đóng">
                        &times;
                    </button>
                </div>

                {/* Body - Dùng Grid layout để hiển thị chi tiết */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    
                    {/* Cột 1 */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-600">ID Món Ăn</label>
                        <p className="dish-modal-input-readonly">{dish.id}</p>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-600">Giá Bán</label>
                        <p className="dish-modal-input-readonly font-semibold text-emerald-600">
                            {formatCurrency(dish.price)}
                        </p>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-600">Danh Mục</label>
                        <p className="dish-modal-input-readonly">
                            {getCategoryName(dish.categoryKey)}
                        </p>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-600">Trạng Thái</label>
                        <p className={`dish-modal-input-readonly ${dish.statusKey === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                            {statusMap[dish.statusKey] || 'N/A'}
                        </p>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-600">Mô Tả Chi Tiết</label>
                        <p className="dish-modal-input-readonly h-20 overflow-y-auto">
                            {dish.description || 'Không có mô tả.'}
                        </p>
                    </div>
                    
                    {/* Cột 2 (Hình ảnh) */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Hình Ảnh</label>
                        <img 
                            src={dish.image} 
                            alt={`Hình ảnh của ${dish.name}`} 
                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                            onError={(e) => e.target.src = 'https://placehold.co/400x192/e5e7eb/4b5563?text=Image+N/A'}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                    <button type="button" onClick={onClose} className="dish-button-secondary dish-button-base">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}