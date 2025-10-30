import React, { useState, useEffect } from 'react';
import CategoryModal from './CategoryModal'; // Import Modal
import './CategoryManager.css'; // Import CSS
import Sidebar from '../../components/Sidebar'; // Giả định Sidebar vẫn được import

// Dữ liệu mẫu ban đầu
const initialCategories = [
    { id: 'C001', name: 'Món Chính', slug: 'main', dishesCount: 15, isHidden: false },
    { id: 'C002', name: 'Tráng Miệng', slug: 'dessert', dishesCount: 8, isHidden: false },
    { id: 'C003', name: 'Đồ Uống', slug: 'drink', dishesCount: 12, isHidden: true },
    { id: 'C004', name: 'Khai Vị', slug: 'appetizer', dishesCount: 10, isHidden: false },
];

// Hàm hỗ trợ tạo ID mới
const generateId = (dataArray) => {
    const prefix = 'C';
    const lastItem = [...dataArray].sort((a, b) => b.id.localeCompare(a.id))[0];
    const lastIdNumber = lastItem ? parseInt(lastItem.id.substring(prefix.length)) : 0;
    const newIdNumber = lastIdNumber + 1;
    return prefix + newIdNumber.toString().padStart(3, '0');
};

export default function CategoryManager() {
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null); // Danh mục đang được sửa (hoặc null nếu là thêm mới)
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('settings'); // Giả định Sidebar

    // 1. Lọc Danh mục
    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cat.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Thao tác Modal
    const handleAddOrEdit = (category = null) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleSave = (newCategoryData) => {
        if (newCategoryData.id) {
            // Sửa
            setCategories(prev => prev.map(cat => 
                cat.id === newCategoryData.id ? newCategoryData : cat
            ));
            alert(`Đã cập nhật danh mục: ${newCategoryData.name}`);
        } else {
            // Thêm mới
            const newId = generateId(categories);
            const categoryWithId = { ...newCategoryData, id: newId, dishesCount: 0 };
            setCategories(prev => [...prev, categoryWithId]);
            alert(`Đã thêm danh mục mới: ${categoryWithId.name}`);
        }
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    // 3. Xóa Danh mục
    const handleDelete = (id, name) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" (ID: ${id}) không?`)) {
            setCategories(prev => prev.filter(cat => cat.id !== id));
            alert(`Đã xóa danh mục ${name}.`);
        }
    };
    
    // 4. Ẩn/Hiện Danh mục
    const handleToggleVisibility = (id, isHidden) => {
        setCategories(prev => prev.map(cat => 
            cat.id === id ? { ...cat, isHidden: !isHidden } : cat
        ));
        alert(`Đã ${isHidden ? 'HIỆN' : 'ẨN'} danh mục ID ${id}.`);
    };

    return (
        <div className="category-layout">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            <main className="category-main">
                <div className="category-header">
                    <h2 className="category-title">Quản Lý Danh Mục Thực Đơn</h2>
                </div>

                <div className="category-content-container">
                    {/* Thanh tìm kiếm */}
                    <div className="category-header">
                    <button 
                        onClick={() => handleAddOrEdit(null)} 
                        className="category-button-primary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        Thêm Danh Mục Mới
                    </button>
                </div>
                    <div className="category-search-bar">
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo ID hoặc Tên danh mục..." 
                            className="category-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Bảng Danh mục */}
                    <div className="category-table-wrapper custom-scroll">
                        <table className="category-table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Tên Danh mục</th>
                                    <th scope="col">Slug</th>
                                    <th scope="col">Số lượng Món ăn</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col" className="text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td className="font-mono">{cat.id}</td>
                                            <td className="font-semibold">{cat.name}</td>
                                            <td>{cat.slug}</td>
                                            <td className="text-center">{cat.dishesCount}</td>
                                            <td>
                                                <span className={cat.isHidden ? 'status-hidden' : 'status-visible'}>
                                                    {cat.isHidden ? 'Đã Ẩn' : 'Hiển Thị'}
                                                </span>
                                            </td>
                                            <td className="category-actions">
                                                <button onClick={() => handleAddOrEdit(cat)} className="text-blue-600 hover:text-blue-900" title="Sửa">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.111 10.155L5.793 17.207l1.414 1.414 4.685-4.685a2 2 0 00-2.828-2.828z" /></svg>
                                                </button>
                                                <button onClick={() => handleToggleVisibility(cat.id, cat.isHidden)} className={cat.isHidden ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'} title={cat.isHidden ? 'Hiện' : 'Ẩn'}>
                                                    {cat.isHidden ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.126 10.126 0 0010 18c-4.321 0-8.156-2.943-9.542-7a1.012 1.012 0 01.353-.618l2.47-2.47a5 5 0 017.388-1.503l-1.996-1.996zm10.745 6.444a5 5 0 01-1.554 2.872l1.473 1.473a10.126 10.126 0 002.306-4.047l-3.375-3.375zM10 9a1 1 0 000 2h.01a1 1 0 100-2H10z" clipRule="evenodd" /></svg>
                                                    )}
                                                </button>
                                                <button onClick={() => handleDelete(cat.id, cat.name)} className="text-red-600 hover:text-red-900" title="Xóa">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="category-no-data">Không tìm thấy danh mục nào phù hợp.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Thêm/Sửa */}
            <CategoryModal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                category={editingCategory}
            />
        </div>
    );
}