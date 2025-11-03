// src/components/DishModal.jsx

import React, { useState, useEffect } from 'react';

// Giả định các map từ DishTable.jsx
const categoryMap = {
    main: "Món Chính",
    dessert: "Tráng Miệng",
    drink: "Đồ Uống",
};

const statusMap = {
    status_available: "Còn hàng",
    status_unavailable: "Hết hàng",
};

export default function DishModal({ isVisible, onClose, onSave, dish }) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: 0,
        categoryKey: 'main',
        statusKey: 'status_available',
        description: '',
        image: '', // Thêm trường ảnh
    });

    const isEditMode = !!dish;
    const title = isEditMode ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới';

    // Dùng useEffect để điền dữ liệu vào form khi component được mount hoặc 'dish' thay đổi
    useEffect(() => {
        if (dish) {
            // Chế độ Chỉnh sửa
            setFormData(dish);
        } else {
            // Chế độ Thêm mới
            setFormData({
                id: '',
                name: '',
                price: 0,
                categoryKey: 'main',
                statusKey: 'status_available',
                description: '',
                image: 'https://placehold.co/40x40/e5e7eb/4b5563?text=N/A',
            });
        }
    }, [dish]);

    const handleChange = (e) => {
        const { id, value, type } = e.target;
        
        // Xử lý giá tiền (chỉ chấp nhận số)
        let finalValue = value;
        if (id === 'price') {
            finalValue = parseInt(value) >= 0 ? parseInt(value) : 0;
        }

        setFormData(prev => ({ 
            ...prev, 
            [id]: finalValue 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate cơ bản
        if (!formData.name || !formData.price || formData.price <= 0) {
            alert("Vui lòng nhập tên món và giá hợp lệ.");
            return;
        }
        
        onSave(formData);
    };

    if (!isVisible) return null;

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
            {/* Modal Content */}
            <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-2xl transform transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">{title}</h3>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    {/* ID (Chỉ hiển thị khi chỉnh sửa) */}
                    {isEditMode && (
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-gray-600">ID Món ăn</label>
                            <input type="text" id="id" className="dish-modal-input-readonly" value={formData.id} readOnly />
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Tên Món */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Tên Món ăn (*)</label>
                            <input type="text" id="name" required className="dish-modal-input" value={formData.name} onChange={handleChange} placeholder="Phở Bò, Lẩu Gà..." />
                        </div>

                        {/* Giá Bán */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-600">Giá Bán (VNĐ) (*)</label>
                            <input type="number" id="price" required min="1000" className="dish-modal-input" value={formData.price} onChange={handleChange} placeholder="50000" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Danh Mục */}
                        <div>
                            <label htmlFor="categoryKey" className="block text-sm font-medium text-gray-600">Danh Mục (*)</label>
                            <select id="categoryKey" required className="dish-modal-input" value={formData.categoryKey} onChange={handleChange}>
                                {Object.entries(categoryMap).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Trạng Thái */}
                        <div>
                            <label htmlFor="statusKey" className="block text-sm font-medium text-gray-600">Trạng Thái (*)</label>
                            <select id="statusKey" required className="dish-modal-input" value={formData.statusKey} onChange={handleChange}>
                                {Object.entries(statusMap).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* URL Hình ảnh */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-600">URL Hình ảnh (hoặc placeholder)</label>
                        <input type="text" id="image" className="dish-modal-input" value={formData.image} onChange={handleChange} placeholder="https://..." />
                        {/* Preview ảnh */}
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                            Preview: 
                            <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="h-8 w-8 object-cover rounded ml-2 border" 
                                onError={(e) => e.target.src = 'https://placehold.co/40x40/e5e7eb/4b5563?text=N/A'}
                            />
                        </div>
                    </div>
                    
                    {/* Mô tả */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-600">Mô Tả Chi Tiết</label>
                        <textarea id="description" rows="3" className="dish-modal-input" value={formData.description} onChange={handleChange} placeholder="Món ăn này có hương vị..." />
                    </div>

                    {/* Nút Thao tác */}
                    <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="dish-button-secondary">Hủy</button>
                        <button type="submit" className="dish-button-primary">
                            {isEditMode ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}