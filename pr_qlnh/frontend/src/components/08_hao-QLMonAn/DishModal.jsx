// src/components/DishModal.jsx

import React, { useState, useEffect } from 'react';

// === ĐÃ ĐỒNG BỘ MAPS VỚI DishCRUDTable.jsx (Key phải là số/chuỗi API) ===
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
// =========================================================================

export default function DishModal({ isVisible, onClose, onSave, dish }) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: 0,
        categoryKey: '1', // Sửa default key thành '1'
        statusKey: 'active', // Sửa default key thành 'active'
        description: '',
        image: '',
    });

    const isEditMode = !!dish;
    const title = isEditMode ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới';

    useEffect(() => {
        if (dish) {
            setFormData(dish);
        } else {
            setFormData({
                id: '',
                name: '',
                price: 0,
                categoryKey: '1',
                statusKey: 'active',
                description: '',
                image: 'https://placehold.co/40x40/e5e7eb/4b5563?text=N/A',
            });
        }
    }, [dish]);

    const handleChange = (e) => {
        // [SỬA LỖI LINTER] Xóa 'type' khỏi destructuring (nếu bạn dùng eslint)
        const { id, value } = e.target;
        
        let finalValue = value;
        if (id === 'price') {
            const numValue = parseInt(value);
            finalValue = (value === '' || isNaN(numValue) || numValue < 0) ? 0 : numValue;
        }

        setFormData(prev => ({ 
            ...prev, 
            [id]: finalValue 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || formData.price <= 0) {
            alert("Vui lòng nhập tên món và giá hợp lệ.");
            return;
        }
        
        // Truyền thêm isEditMode để DishCRUDTable biết nên gọi POST hay PUT
        onSave(formData, isEditMode);
    };

    if (!isVisible) return null;

    return (
        // Modal Overlay (fixed, full screen)
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
            
            {/* 1. SỬA LỖI GIAO DIỆN: Thêm flex-col, max-h, và loại bỏ padding khỏi wrapper */}
            <div className="bg-white rounded-xl w-full max-w-xl shadow-2xl transform transition-all duration-300 flex flex-col max-h-[95vh]"> 
                
                {/* Header (Thêm padding) */}
                <div className="dish-modal-header p-6 pb-3 border-b"> 
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="dish-modal-close-btn">&times;</button>
                </div>

                {/* 2. SỬA LỖI GIAO DIỆN: Thêm overflow-y-auto và flex-1 cho Form/Content */}
                <form onSubmit={handleSubmit} className="space-y-4 p-6 overflow-y-auto flex-1">
                    
                    {isEditMode && (
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-gray-600">ID Món Ăn</label>
                            <input id="id" className="dish-modal-input-readonly" value={formData.id} readOnly />
                        </div>
                    )}
                   
                    {/* Các trường form khác (giữ nguyên) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Tên Món Ăn (*)</label>
                            <input id="name" type="text" className="dish-modal-input" value={formData.name} onChange={handleChange} required placeholder="Phở Bò Đặc Biệt" />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-600">Giá Bán (VNĐ) (*)</label>
                            <input type="number" id="price" className="dish-modal-input" value={formData.price} onChange={handleChange} required min="0" placeholder="65000" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="categoryKey" className="block text-sm font-medium text-gray-600">Danh Mục (*)</label>
                            <select id="categoryKey" className="dish-modal-input" value={formData.categoryKey} onChange={handleChange} required>
                                {Object.entries(categoryMap).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="statusKey" className="block text-sm font-medium text-gray-600">Trạng Thái (*)</label>
                            <select id="statusKey" className="dish-modal-input" value={formData.statusKey} onChange={handleChange} required>
                                {Object.entries(statusMap).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-600">URL Hình Ảnh</label>
                        <input type="text" id="image" className="dish-modal-input" value={formData.image} onChange={handleChange} placeholder="http://example.com/image.jpg" />
                         <div className="mt-2 text-xs text-gray-500 flex items-center">
                            Preview: 
                            <img src={formData.image} alt="Preview" className="h-8 w-8 object-cover rounded ml-2 border" onError={(e) => e.target.src = 'https://placehold.co/40x40/e5e7eb/4b5563?text=N/A'}/>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-600">Mô Tả Chi Tiết</label>
                        <textarea id="description" rows="3" className="dish-modal-input" value={formData.description} onChange={handleChange} placeholder="Món ăn này có hương vị..." />
                    </div>
                    
                    {/* Phần footer được đưa ra ngoài form */}
                </form>
                
                {/* 3. SỬA LỖI GIAO DIỆN: Footer cố định */}
                <div className="p-4 border-t flex justify-end space-x-3 bg-white sticky bottom-0">
                    <button type="button" onClick={onClose} className="dish-button-secondary">Hủy</button>
                    <button type="submit" className="dish-button-primary">
                        {isEditMode ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn'}
                    </button>
                </div>
                
            </div>
        </div>
    );
}