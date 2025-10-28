import React, { useState, useEffect, useCallback } from 'react';
import './restaurant_infor_manage.css'; // Import CSS riêng
import Sidebar from "../../components/Sidebar";

// === HÀM HỖ TRỢ VÀ DỮ LIỆU MẪU BAN ĐẦU ===

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
};

const generateId = (prefix, dataArray) => {
    // Tìm ID cuối cùng
    const lastItem = [...dataArray].sort((a, b) => b.id.localeCompare(a.id)).find(item => item.id.startsWith(prefix));
    const lastIdNumber = lastItem ? parseInt(lastItem.id.substring(prefix.length)) : 0;
    const newIdNumber = lastIdNumber + 1;
    return prefix + newIdNumber.toString().padStart(3, '0');
};

const promotionsData_Init = [
    { id: 'KM001', title: 'Ưu đãi Giảm 20% Cho Thứ Ba Hàng Tuần', date: '2025-10-01', status: 'published', content: 'Giảm 20% tổng hóa đơn...', imageUrl: 'https://placehold.co/150x100/4f46e5/ffffff?text=20%25+OFF' },
    { id: 'KM002', title: 'Ra mắt Món mới: Bò Wagyu Hầm Rượu Vang', date: '2025-09-25', status: 'published', content: 'Khám phá hương vị thịt bò...', imageUrl: 'https://placehold.co/150x100/94a3b8/ffffff?text=Wagyu' },
    { id: 'KM003', title: 'Tặng Cocktail Miễn Phí Cho Nhóm 4 Người', date: '2025-09-10', status: 'draft', content: 'Khi đặt chỗ cho nhóm 4 người...', imageUrl: 'https://placehold.co/150x100/ef4444/ffffff?text=Cocktail' },
];

const dishList_Init = [
    { id: 'D001', name: 'Phở Bò Đặc Biệt', price: 65000, category: 'main', isFeatured: false },
    { id: 'D002', name: 'Gỏi Cuốn Tôm Thịt', price: 50000, category: 'appetizer', isFeatured: true },
    { id: 'D003', name: 'Cà Phê Sữa Đá', price: 25000, category: 'drink', isFeatured: false },
    { id: 'D004', name: 'Bánh Lava Socola', price: 120000, category: 'dessert', isFeatured: true },
    { id: 'D005', name: 'Lẩu Thái Tom Yum', price: 390000, category: 'hotpot', isFeatured: true },
    { id: 'D006', name: 'Bún Chả Hà Nội', price: 55000, category: 'main', isFeatured: false },
    { id: 'D007', name: 'Nước Ép Dứa Tươi', price: 45000, category: 'drink', isFeatured: false },
    { id: 'D008', name: 'Kem Vani Sốt Dâu', price: 35000, category: 'dessert', isFeatured: false },
];


// === 1. COMPONENT MODAL THÊM/SỬA TIN TỨC ===

const PromoEditModal = ({ isVisible, onClose, onSave, promotion, promoId, setPromoId }) => {
    const [formData, setFormData] = useState({
        id: '', title: '', content: '', date: new Date().toISOString().slice(0, 10), status: 'draft', imageUrl: ''
    });

    useEffect(() => {
        if (promotion) {
            setFormData(promotion);
        } else {
            setFormData({
                id: '', title: '', content: '', date: new Date().toISOString().slice(0, 10), status: 'draft', imageUrl: ''
            });
        }
    }, [promotion]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id.replace('promo-', '')]: value }));
    };

    const handleSave = () => {
        if (!formData.title || !formData.content || !formData.date) {
            alert("Vui lòng điền đầy đủ Tiêu đề, Nội dung và Ngày đăng.");
            return;
        }
        onSave(formData);
    };

    const title = promotion ? 'Chỉnh sửa Tin tức/Ưu đãi' : 'Thêm Tin tức/Ưu đãi Mới';

    return (
        <div id="promo-edit-modal" className={`modal ${isVisible ? 'is-active' : ''}`}>
            <div className={`bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} id="promo-modal-content">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3" id="promo-modal-title">{title}</h3>

                <form className="space-y-4">
                    <input type="hidden" id="promo-id" value={formData.id} readOnly />

                    <div>
                        <label htmlFor="promo-title" className="block text-sm font-medium text-gray-700">Tiêu đề (*)</label>
                        <input type="text" id="promo-title" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={formData.title} onChange={handleChange} />
                    </div>

                    <div>
                        <label htmlFor="promo-content" className="block text-sm font-medium text-gray-700">Nội dung chi tiết (*)</label>
                        <textarea id="promo-content" rows="4" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={formData.content} onChange={handleChange}></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="promo-date" className="block text-sm font-medium text-gray-700">Ngày đăng (*)</label>
                            <input type="date" id="promo-date" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={formData.date} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="promo-status" className="block text-sm font-medium text-gray-700">Trạng thái (*)</label>
                            <select id="promo-status" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white" value={formData.status} onChange={handleChange}>
                                <option value="draft">Bản nháp</option>
                                <option value="published">Đã xuất bản</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="promo-image-url" className="block text-sm font-medium text-gray-700">URL Hình ảnh Thumbnail</label>
                        <input type="url" id="promo-image-url" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={formData.imageUrl} onChange={handleChange} />
                    </div>
                </form>

                <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150">Hủy</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition duration-150 shadow-md">Lưu Bài viết</button>
                </div>
            </div>
        </div>
    );
};

// === 2. COMPONENT MODAL CHỌN MÓN ĂN NỔI BẬT ===

const DishSelectorModal = ({ isVisible, onClose, dishList, setDishList, onSave }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Tạo bản sao của danh sách để thao tác trong modal mà không ảnh hưởng state gốc
    const [localDishList, setLocalDishList] = useState(dishList);

    // Đồng bộ danh sách khi modal mở
    useEffect(() => {
        if (isVisible) {
            setLocalDishList(dishList);
            setSearchTerm('');
        }
    }, [isVisible, dishList]);

    const toggleFeaturedDish = (dishId) => {
        setLocalDishList(prevList => {
            const newList = prevList.map(dish => {
                if (dish.id === dishId) {
                    const currentFeaturedCount = prevList.filter(d => d.isFeatured).length;
                    
                    if (dish.isFeatured) {
                        return { ...dish, isFeatured: false }; // Bỏ chọn
                    } else if (currentFeaturedCount < 3) {
                        return { ...dish, isFeatured: true }; // Chọn
                    } else {
                        alert("Chỉ được chọn tối đa 3 món ăn nổi bật.");
                        return dish; // Giữ nguyên nếu đã đủ 3
                    }
                }
                return dish;
            });
            return newList;
        });
    };

    const handleSave = () => {
        const featuredCount = localDishList.filter(d => d.isFeatured).length;
        if (featuredCount === 0) {
             alert("Vui lòng chọn ít nhất 1 món ăn nổi bật.");
             return;
        }
        onSave(localDishList); // Gửi danh sách đã cập nhật lên component cha
    };

    const filteredDishes = localDishList.filter(dish => 
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        dish.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const selectedCount = localDishList.filter(d => d.isFeatured).length;

    return (
        <div id="dish-selector-modal" className={`modal ${isVisible ? 'is-active' : ''}`}>
            <div className={`bg-white p-6 rounded-xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} id="dish-selector-modal-content">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">Chọn Món ăn Nổi bật (Tối đa 3)</h3>

                <div className="mb-4">
                    <input type="text" id="dish-search" placeholder="Tìm kiếm món ăn..." className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                <div id="available-dishes-list" className="grid grid-cols-3 gap-4 h-96 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                    {filteredDishes.map(dish => {
                        const isSelected = dish.isFeatured;
                        const cardClass = isSelected ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100';
                        const checkIcon = isSelected ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 absolute top-2 right-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        ) : '';

                        return (
                            <div 
                                key={dish.id} 
                                data-id={dish.id} 
                                className={`relative p-3 rounded-lg shadow-sm cursor-pointer ${cardClass}`} 
                                onClick={() => toggleFeaturedDish(dish.id)}
                            >
                                {checkIcon}
                                <h4 className="font-bold text-base">{dish.name}</h4>
                                <p className="text-xs text-gray-600 mt-1">{formatCurrency(dish.price)}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">Đã chọn: <span id="selected-dish-count" className="font-bold text-indigo-600">{selectedCount}</span>/3</p>
                    <div className="space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150">Hủy</button>
                        <button type="button" onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition duration-150 shadow-md">Lưu Món nổi bật</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === 3. COMPONENT CHÍNH (QUẢN LÝ TRANG THÔNG TIN) ===

export default function QuanLyTrangThongTin() {
    // State cho Sidebar và Tab
    const [activeView, setActiveView] = useState('settings');
    const [activeTab, setActiveTab] = useState('promotions');

    // State cho Data
    const [promotions, setPromotions] = useState(promotionsData_Init);
    const [dishList, setDishList] = useState(dishList_Init);
    
    // State cho Modals
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [isDishSelectorModalOpen, setIsDishSelectorModalOpen] = useState(false);
    
    // State cho Search/Filter
    const [promoSearchTerm, setPromoSearchTerm] = useState('');

    // Hàm chuyển Tab
    const changeContentTab = (tabName) => {
        setActiveTab(tabName);
    };

    // === Logic Quản lý Tin tức/Ưu đãi (Promotions) ===

    const openPromoModal = (promoId = null) => {
        if (promoId) {
            const item = promotions.find(p => p.id === promoId);
            setEditingPromotion(item);
        } else {
            setEditingPromotion(null);
        }
        setIsPromoModalOpen(true);
    };

    const closePromoModal = () => {
        setIsPromoModalOpen(false);
        setEditingPromotion(null);
    };
    
    const savePromotion = (newPromo) => {
        if (newPromo.id) {
            // Cập nhật
            setPromotions(prev => prev.map(p => p.id === newPromo.id ? newPromo : p));
            alert(`Đã cập nhật tin tức: ${newPromo.title}.`);
        } else {
            // Thêm mới
            const newId = generateId('KM', promotions);
            const promoWithId = { ...newPromo, id: newId };
            setPromotions(prev => [...prev, promoWithId]);
            alert(`Đã thêm tin tức mới: ${newPromo.title}.`);
        }
        closePromoModal();
    };
    
    const deletePromotion = (promoId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa tin tức ${promoId} không?`)) {
            setPromotions(prev => prev.filter(p => p.id !== promoId));
            alert(`Đã xóa tin tức ${promoId}.`);
        }
    };
    
    const filteredPromotions = promotions.filter(item => 
        item.title.toLowerCase().includes(promoSearchTerm.toLowerCase()) || 
        item.id.toLowerCase().includes(promoSearchTerm.toLowerCase())
    );

    // === Logic Món ăn Nổi bật (Featured Dishes) ===

    const openDishSelectorModal = () => {
        setIsDishSelectorModalOpen(true);
    };
    
    const closeDishSelectorModal = () => {
        setIsDishSelectorModalOpen(false);
    };
    
    const saveFeaturedDishes = (updatedDishList) => {
        setDishList(updatedDishList);
        const featuredCount = updatedDishList.filter(d => d.isFeatured).length;
        alert(`Đã lưu ${featuredCount} món ăn làm nổi bật.`);
        closeDishSelectorModal();
    };
    
    const featuredDishes = dishList.filter(dish => dish.isFeatured);


    return (
        // body class 'overflow-hidden' + 'display: flex' + 'height: 100vh' được thay bằng .app-layout
        <div className="dish-layout"> 
      
      {/* Sidebar giả lập (Cần import component thực tế) */}
            <Sidebar />
            {/* Main content container */}
            {/* Sử dụng .main-content-area thay thế cho .flex-grow.h-full.main-container */}
            <div className="dish-main">
                
                {/* Khu vực Quản lý Nội dung (Settings View) */}
                {activeView === 'settings' && (
                    <div id="settings-view" className="content-wrapper">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Quản Lý Trang Thông Tin Nhà Hàng</h1>
                        
                        {/* Tab Navigation */}
                        <div className="flex space-x-6 border-b border-gray-200 mb-6">
                            <button 
                                onClick={() => changeContentTab('promotions')} 
                                className={`py-2 px-1 text-lg text-gray-500 hover:text-indigo-600 transition duration-150 ${activeTab === 'promotions' ? 'tab-active' : ''}`}
                            >
                                Quản lý Tin tức/Ưu đãi
                            </button>
                            <button 
                                onClick={() => changeContentTab('featured')} 
                                className={`py-2 px-1 text-lg text-gray-500 hover:text-indigo-600 transition duration-150 ${activeTab === 'featured' ? 'tab-active' : ''}`}
                            >
                                Món ăn Nổi bật
                            </button>
                            <button 
                                onClick={() => changeContentTab('basic')} 
                                className={`py-2 px-1 text-lg text-gray-500 hover:text-indigo-600 transition duration-150 ${activeTab === 'basic' ? 'tab-active' : ''}`}
                            >
                                Thông tin cơ bản
                            </button>
                        </div>

                        {/* Tab Content: 1. Quản lý Tin tức/Ưu đãi */}
                        {activeTab === 'promotions' && (
                            <div id="promotions-tab" className="content-tab">
                                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                    <input 
                                        type="text" 
                                        id="promotion-search" 
                                        placeholder="Tìm kiếm theo Tiêu đề" 
                                        className="w-1/3 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        value={promoSearchTerm}
                                        onChange={(e) => setPromoSearchTerm(e.target.value)}
                                    />
                                    <button 
                                        onClick={() => openPromoModal(null)} 
                                        className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Thêm Tin tức/Ưu đãi
                                    </button>
                                </div>

                                {/* Bảng Tin tức/Ưu đãi */}
                                {/* Dùng .table-scroll-container thay thế cho overflow-y-auto h-full */}
                                <div className="table-scroll-container"> 
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Tin</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredPromotions.map(item => {
                                                const statusClass = item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                                                const statusText = item.status === 'published' ? 'Đã xuất bản' : 'Bản nháp';
                                                return (
                                                    <tr key={item.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{item.title}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                             <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                                                                {statusText}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                            <button onClick={() => openPromoModal(item.id)} className="text-indigo-600 hover:text-indigo-900 p-1" title="Chỉnh sửa">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.111 10.155L5.793 17.207l1.414 1.414 4.685-4.685a2 2 0 00-2.828-2.828z" /></svg>
                                                            </button>
                                                            <button onClick={() => deletePromotion(item.id)} className="text-red-600 hover:text-red-900 p-1" title="Xóa">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: 2. Món ăn Nổi bật */}
                        {activeTab === 'featured' && (
                            <div id="featured-tab" className="content-tab flex-grow p-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Chọn Món ăn Nổi bật (Hiển thị 3 món trên Trang chủ)</h3>
                                <div id="featured-dishes-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {featuredDishes.length === 0 ? (
                                        <p className="col-span-3 text-center text-gray-500 italic py-6">Chưa có món ăn nổi bật nào được chọn.</p>
                                    ) : (
                                        featuredDishes.map(dish => (
                                            <div key={dish.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-indigo-500">
                                                <h4 className="font-bold text-lg text-gray-800">{dish.name}</h4>
                                                <p className="text-sm text-indigo-600 font-semibold">{formatCurrency(dish.price)}</p>
                                                <p className="text-xs text-gray-500 mt-1">Mã: {dish.id} | Danh mục: {dish.category}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-6">
                                    <button 
                                        onClick={openDishSelectorModal} 
                                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150"
                                    >
                                        Thêm/Thay đổi Món nổi bật
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Tab Content: 3. Thông tin cơ bản */}
                        {activeTab === 'basic' && (
                            <div id="basic-tab" className="content-tab flex-grow p-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Cập nhật Thông tin Nhà hàng</h3>
                                <form className="space-y-4 max-w-lg">
                                    <div>
                                        <label htmlFor="restaurant-name" className="block text-sm font-medium text-gray-700">Tên Nhà hàng</label>
                                        <input type="text" id="restaurant-name" defaultValue="Sunset Restaurant" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="restaurant-address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                        <input type="text" id="restaurant-address" defaultValue="123 Đường Lãng Mạn, TP.HCM" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="restaurant-phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                        <input type="tel" id="restaurant-phone" defaultValue="(028) 1234 5678" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <button type="button" onClick={() => alert('Đã lưu thông tin cơ bản.')} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150">
                                        Lưu Thông tin
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Các View khác (Chỉ là placeholder, cần tạo component riêng trong ứng dụng thực tế) */}
                {activeView !== 'settings' && <div className="p-6 text-gray-500">Nội dung cho {sidebarItems.find(i => i.id === activeView)?.label}</div>}

            </div>

            {/* Modal Thêm/Sửa Tin tức/Ưu đãi */}
            <PromoEditModal 
                isVisible={isPromoModalOpen}
                onClose={closePromoModal}
                onSave={savePromotion}
                promotion={editingPromotion}
            />
            
            {/* Modal Chọn Món ăn Nổi bật */}
            <DishSelectorModal 
                isVisible={isDishSelectorModalOpen}
                onClose={closeDishSelectorModal}
                dishList={dishList}
                setDishList={setDishList} // Truyền setter để modal có thể sửa đổi list tạm thời
                onSave={saveFeaturedDishes}
            />

        </div>
    );
}

// Lưu ý: Để component hoạt động hoàn chỉnh, cần chạy lệnh cài đặt Tailwind CSS và import nó vào file entry point của ứng dụng React.