import React, { useState, useEffect } from 'react';

export default function CategoryModal({ isVisible, onClose, onSave, category }) {
    const [formData, setFormData] = useState({
        id: '', name: '', slug: '', isHidden: false
    });

    useEffect(() => {
        if (category) {
            // Chế độ Sửa
            setFormData(category);
        } else {
            // Chế độ Thêm mới
            setFormData({
                id: '', name: '', slug: '', isHidden: false
            });
        }
    }, [category]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ 
            ...prev, 
            [id.replace('cat-', '')]: finalValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.slug) {
            alert("Vui lòng điền đầy đủ Tên danh mục và Slug.");
            return;
        }
        onSave(formData);
    };

    const title = category ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới';

    if (!isVisible) return null;

    return (
        <div id="category-edit-modal" className="modal is-active">
            <div className="modal-content" id="cat-modal-content">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">{title}</h3>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {formData.id && (
                        <div>
                            <label htmlFor="cat-id" className="block text-sm font-medium text-gray-700">ID Danh mục</label>
                            <input type="text" id="cat-id" className="modal-input-readonly" value={formData.id} readOnly />
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700">Tên Danh mục (*)</label>
                        <input type="text" id="cat-name" required className="modal-input" value={formData.name} onChange={handleChange} />
                    </div>

                    <div>
                        <label htmlFor="cat-slug" className="block text-sm font-medium text-gray-700">Slug (Đường dẫn thân thiện) (*)</label>
                        <input type="text" id="cat-slug" required className="modal-input" value={formData.slug} onChange={handleChange} />
                    </div>

                    <div className="flex items-center">
                        <input 
                            id="cat-isHidden" 
                            type="checkbox" 
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                            checked={formData.isHidden}
                            onChange={handleChange}
                        />
                        <label htmlFor="cat-isHidden" className="ml-2 block text-sm text-gray-900">Ẩn danh mục này trên trang người dùng</label>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="category-button-secondary">Hủy</button>
                        <button type="submit" className="category-button-primary">Lưu Danh mục</button>
                    </div>
                </form>
            </div>
        </div>
    );
}