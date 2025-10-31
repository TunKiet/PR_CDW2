import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../Sidebar";
import "./DishTable.css"; 
// IMPORT DishModal (Giả định bạn đã tạo file này)
import DishModal from "./DishModal"; 


// === HÀM HỖ TRỢ VÀ DỮ LIỆU MẪU ===

const categoryMap = {
  main: "Món Chính",
  dessert: "Tráng Miệng",
  drink: "Đồ Uống",
};

const statusMap = {
  status_available: "Còn hàng",
  status_unavailable: "Hết hàng",
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
};

// Cập nhật dishesData với nội dung Đa ngôn ngữ (name_vi, description_vi, name_en, description_en)
const dishesData = [
  { 
    id: 'MA001', 
    image: 'https://placehold.co/40x40/4c4d50/ffffff?text=F', 
    categoryKey: 'main', 
    price: 65000, 
    statusKey: 'status_available', 
    name_vi: 'Phở Bò Đặc Biệt', 
    description_vi: 'Món Phở truyền thống, nước dùng đậm đà.', 
    name_en: 'Special Beef Noodle Soup (Pho)', 
    description_en: 'Traditional Pho dish, rich broth.', 
  },
  { 
    id: 'MA002', 
    image: 'https://placehold.co/40x40/facc15/000000?text=C', 
    categoryKey: 'dessert', 
    price: 35000, 
    statusKey: 'status_unavailable', 
    name_vi: 'Kem Vani Tráng Miệng', 
    description_vi: 'Kem vani mát lạnh, ăn sau bữa chính.', 
    name_en: 'Vanilla Ice Cream Dessert', 
    description_en: 'Cool vanilla ice cream, perfect after the main course.', 
  },
  { 
    id: 'MA003', 
    image: 'https://placehold.co/40x40/22c55e/ffffff?text=N', 
    categoryKey: 'drink', 
    price: 40000, 
    statusKey: 'status_available', 
    name_vi: 'Nước Cam Ép Tươi', 
    description_vi: 'Cam tươi nguyên chất, nhiều vitamin.', 
    name_en: 'Fresh Orange Juice', 
    description_en: 'Pure fresh orange, rich in vitamins.', 
  },
  { 
    id: 'MA004', 
    image: 'https://placehold.co/40x40/3b82f6/ffffff?text=G', 
    categoryKey: 'main', 
    price: 50000, 
    statusKey: 'status_available', 
    name_vi: 'Gỏi Cuốn Tôm Thịt (Khai vị)', 
    description_vi: 'Gỏi cuốn thanh mát, khai vị hoàn hảo.', 
    name_en: 'Shrimp and Pork Spring Rolls (Appetizer)', 
    description_en: 'Refreshing spring rolls, a perfect appetizer.', 
  },
  { 
    id: 'MA005', 
    image: 'https://placehold.co/40x40/ef4444/ffffff?text=L', 
    categoryKey: 'main', 
    price: 299000, 
    statusKey: 'status_available', 
    name_vi: 'Lẩu Hải Sản Cay', 
    description_vi: 'Lẩu hải sản thập cẩm, vị cay đậm đà.', 
    name_en: 'Spicy Seafood Hotpot', 
    description_en: 'Mixed seafood hotpot, rich and spicy flavor.', 
  },
  { 
    id: 'MA006', 
    image: 'https://placehold.co/40x40/9ca3af/ffffff?text=X', 
    categoryKey: 'main', 
    price: 45000, 
    statusKey: 'status_available', 
    name_vi: 'Xôi Gà', 
    description_vi: 'Xôi dẻo thơm, gà chiên giòn.', 
    name_en: 'Chicken Sticky Rice', 
    description_en: 'Fragrant sticky rice, crispy fried chicken.', 
  },
];

const ITEMS_PER_PAGE = 3; 

// --- Component Modal Xem Chi Tiết (DetailModal) ---
// (Sử dụng tên món, mô tả theo ngôn ngữ hiện tại trong DetailModal nếu muốn dịch)
const DetailModal = ({ isVisible, onClose, dish, currentLanguage }) => { 
    if (!isVisible || !dish) return null;

    const statusClass = dish.statusKey === 'status_available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const statusText = statusMap[dish.statusKey];
    
    // Lấy tên và mô tả theo ngôn ngữ hiện tại
    const displayedName = dish[`name_${currentLanguage}`] || dish.name_vi;
    const displayedDescription = dish[`description_${currentLanguage}`] || dish.description_vi || '';

    return (
        <div id="view-dish-details-modal" className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">{currentLanguage === 'vi' ? 'Chi Tiết Món Ăn' : 'Dish Details'}</h3>
                <div id="dish-details-container" className="space-y-4">
                    <div className="flex items-center justify-center mb-4 border-b pb-4">
                        <img 
                            src={dish.image} 
                            onError={(e) => e.target.src = 'https://placehold.co/150x150/e5e7eb/4b5563?text=N/A'} 
                            alt={displayedName} 
                            className="h-32 w-32 object-cover rounded-xl shadow-lg border border-gray-200"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                        <p className="font-semibold text-gray-600">{currentLanguage === 'vi' ? 'ID Món:' : 'Dish ID:'}</p>
                        <p className="text-gray-900 font-mono">{dish.id}</p>
                        <p className="font-semibold text-gray-600">{currentLanguage === 'vi' ? 'Tên Món:' : 'Name:'}</p>
                        <p className="text-gray-900 font-bold">{displayedName}</p>
                        <p className="font-semibold text-gray-600">{currentLanguage === 'vi' ? 'Danh Mục:' : 'Category:'}</p>
                        <p className="text-gray-900">{categoryMap[dish.categoryKey]}</p>
                        <p className="font-semibold text-gray-600">{currentLanguage === 'vi' ? 'Giá Bán:' : 'Price:'}</p>
                        <p className="text-gray-900 font-bold text-lg text-emerald-600">{formatCurrency(dish.price)}</p>
                        <p className="font-semibold text-gray-600">{currentLanguage === 'vi' ? 'Trạng Thái:' : 'Status:'}</p>
                        <p className="text-gray-900">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}> 
                                {statusText}
                            </span>
                        </p>
                        <p className="font-semibold text-gray-600 col-span-2 mt-4 border-t pt-4">{currentLanguage === 'vi' ? 'Mô Tả Chi Tiết:' : 'Description:'}</p>
                        <p className="text-gray-700 col-span-2 text-sm">{displayedDescription || (currentLanguage === 'vi' ? 'Chưa có mô tả chi tiết.' : 'No detailed description.')}</p>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150">{currentLanguage === 'vi' ? 'Đóng' : 'Close'}</button>
                </div>
            </div>
        </div>
    );
};


// --- Component Chính (DishTable) ---

export default function DishTable() {
  const [dishes, setDishes] = useState(dishesData); 
  const [filteredDishes, setFilteredDishes] = useState(dishesData);
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    status: "",
    minPrice: "",
    maxPrice: "",
  });
  
  // === STATE NGÔN NGỮ MỚI ===
  const [currentLanguage, setCurrentLanguage] = useState('vi'); // Mặc định Tiếng Việt
  // ==========================

  // === KHAI BÁO STATE CHO MODAL THÊM/SỬA (Giữ nguyên) ===
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null); 
  // ===========================================

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  // === ĐỊNH NGHĨA CÁC HÀM THAO TÁC MODAL (Giữ nguyên) ===
  const handleAddOrEdit = (dish = null) => {
      setEditingDish(dish); 
      setIsEditModalOpen(true); 
  };
  
  const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setEditingDish(null); 
  };

  const handleSaveDish = (newDishData) => {
      if (newDishData.id) {
          setDishes(prev => prev.map(d => d.id === newDishData.id ? newDishData : d));
      } else {
          // Logic tạo ID mới
          const newId = `MA${String(dishes.length + 1).padStart(3, '0')}`;
          setDishes(prev => [...prev, { ...newDishData, id: newId }]);
      }
      handleCloseEditModal();
  };
  // ============================================

  const handleDetailView = (dish) => {
      setSelectedDish(dish);
      setIsDetailModalOpen(true);
  };
  
  // === HÀM LOGIC LỌC (Cập nhật cho Đa ngôn ngữ) ===
  const applyFilters = useCallback(() => {
    const { keyword, category, status, minPrice, maxPrice } = filters;
    
    // Xác định các trường tìm kiếm theo ngôn ngữ hiện tại
    const nameField = `name_${currentLanguage}`;
    const descriptionField = `description_${currentLanguage}`;
    
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    const filteredData = dishes.filter(dish => {
        const term = keyword.toLowerCase().trim();
        
        // 1. Lọc theo Từ khóa: Tìm trong ID, Tên món (theo ngôn ngữ) HOẶC Mô tả (theo ngôn ngữ)
        const matchesSearch = term === "" || 
                              dish.id.toLowerCase().includes(term) || // ID vẫn là đơn ngữ
                              (dish[nameField] && dish[nameField].toLowerCase().includes(term)) || 
                              (dish[descriptionField] && dish[descriptionField].toLowerCase().includes(term));

        // 2. Lọc theo Danh mục (Giữ nguyên)
        const matchesCategory = category === "" || dish.categoryKey === category;
        
        // Lọc theo Trạng thái (Giữ nguyên)
        const matchesStatus = status === "" || dish.statusKey === status;
        
        // Lọc theo Giá (Giữ nguyên)
        const matchesPrice = dish.price >= min && dish.price <= max;
        
        // Kết hợp tất cả các bộ lọc
        return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });

    setFilteredDishes(filteredData);
    setCurrentPage(1); 
  }, [dishes, filters, currentLanguage]); // THÊM currentLanguage vào dependencies

  // === LOGIC LỌC TỰ ĐỘNG (Real-time Filtering) ===
  // Lọc lại khi: Dữ liệu món ăn, Từ khóa, Danh mục, Trạng thái, hoặc Ngôn ngữ thay đổi
  useEffect(() => {
      applyFilters();
  }, [dishes, filters.keyword, filters.category, filters.status, currentLanguage, applyFilters]); 
  
  const clearFilters = () => {
    setFilters({
        keyword: "",
        category: "",
        status: "",
        minPrice: "",
        maxPrice: "",
    });
    // Lọc lại sẽ tự động chạy
    setCurrentPage(1); 
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({
        ...prev,
        [id]: value
    }));
  };
  
  const switchLanguage = (lang) => {
    setCurrentLanguage(lang);
    // Reset từ khóa tìm kiếm khi chuyển ngôn ngữ để người dùng gõ từ mới
    setFilters(prev => ({...prev, keyword: ""})); 
    // Lọc lại sẽ tự động chạy
  };
  
  // Logic Phân Trang
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const dishesToShow = filteredDishes.slice(startIndex, endIndex);
  const totalPagesDisplay = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPagesDisplay }, (_, i) => i + 1);
  const displayStart = filteredDishes.length > 0 ? startIndex + 1 : 0;
  const displayEnd = Math.min(endIndex, filteredDishes.length);
  const paginationInfo = currentLanguage === 'vi' 
    ? `Hiển thị ${displayStart} đến ${displayEnd} trên ${filteredDishes.length} kết quả`
    : `Showing ${displayStart} to ${displayEnd} of ${filteredDishes.length} results`;

  // Hàm hỗ trợ hiển thị Tên Món theo ngôn ngữ
  const dishDisplayName = (dish) => dish[`name_${currentLanguage}`] || dish.name_vi; 

  // ====================================


  return (
    <div className="dish-layout"> 
      
      <Sidebar /> 

      <main className="dish-main">
        <div className="flex justify-between items-center mb-6">
          <h2 className="dish-title">{currentLanguage === 'vi' ? 'Quản Lý Món Ăn' : 'Dish Management'}</h2>
          
          {/* KHU VỰC CHUYỂN NGÔN NGỮ */}
          <div className="flex space-x-2 border rounded-lg p-1 bg-white shadow-sm">
            <button
                onClick={() => switchLanguage('vi')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition duration-150 ${currentLanguage === 'vi' ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
            >
                VI
            </button>
            <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition duration-150 ${currentLanguage === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
            >
                EN
            </button>
          </div>
        </div>

        <div className="dish-container">
          <div className="flex justify-between items-center mb-6">
          <button 
              onClick={() => handleAddOrEdit(null)} 
              className="flex items-center px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
            <span>{currentLanguage === 'vi' ? 'Thêm Món Ăn Mới' : 'Add New Dish'}</span>
          </button>
        </div>
          {/* Khung Tìm kiếm Nâng cao */}
          <div className="dish-filter">
              <h4 className="dish-filter-title">{currentLanguage === 'vi' ? 'Tìm kiếm Nâng cao' : 'Advanced Search'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                      {/* CẬP NHẬT LABEL ĐA NGÔN NGỮ */}
                      <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
                          {currentLanguage === 'vi' 
                            ? `Tên món/Mô tả (VI)` 
                            : `Dish Name/Description (EN)`
                          }
                      </label>
                      <input 
                        type="text" 
                        id="keyword" 
                        placeholder={currentLanguage === 'vi' ? "Nhập từ khóa tìm kiếm..." : "Enter search keyword..."}
                        className="dish-input" 
                        value={filters.keyword} 
                        onChange={handleChange} 
                      />
                  </div>
                  <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">{currentLanguage === 'vi' ? 'Danh mục' : 'Category'}</label>
                      <select id="category" className="dish-input" value={filters.category} onChange={handleChange}>
                          <option value="">{currentLanguage === 'vi' ? 'Tất cả Danh mục' : 'All Categories'}</option>
                          {/* categoryMap chỉ hiển thị Tiếng Việt, giữ nguyên cho đơn giản */}
                          {Object.entries(categoryMap).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">{currentLanguage === 'vi' ? 'Trạng thái' : 'Status'}</label>
                      <select id="status" className="dish-input" value={filters.status} onChange={handleChange}>
                          <option value="">{currentLanguage === 'vi' ? 'Tất cả Trạng thái' : 'All Statuses'}</option>
                          <option value="status_available">{statusMap.status_available}</option>
                          <option value="status_unavailable">{statusMap.status_unavailable}</option>
                      </select>
                  </div>
                  <div className="flex items-end">
                      {/* Giữ nút này để áp dụng cho Lọc Giá */}
                      <button onClick={applyFilters} className="w-full h-[42px] px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
                        {currentLanguage === 'vi' ? 'Áp dụng Lọc Giá' : 'Apply Price Filter'}
                      </button> 
                  </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                  <div>
                      <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">{currentLanguage === 'vi' ? 'Giá Tối thiểu (VNĐ)' : 'Min Price (VND)'}</label>
                      <input type="number" id="minPrice" min="0" placeholder="0" className="dish-input" value={filters.minPrice} onChange={handleChange} />
                  </div>
                  <div>
                      <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">{currentLanguage === 'vi' ? 'Giá Tối đa (VNĐ)' : 'Max Price (VND)'}</label>
                      <input type="number" id="maxPrice" min="0" placeholder={currentLanguage === 'vi' ? "Không giới hạn" : "Unlimited"} className="dish-input" value={filters.maxPrice} onChange={handleChange} />
                  </div>
                  <div className="flex items-end col-start-2 md:col-start-3 lg:col-start-4">
                      <button onClick={clearFilters} className="w-full h-[42px] px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-150">
                        {currentLanguage === 'vi' ? 'Xóa Lọc' : 'Clear Filters'}
                      </button>
                  </div>
              </div>
          </div>
          
          {/* Bảng Danh sách Món ăn */}
          <div className="dish-table-wrapper custom-scroll">
            <table className="dish-table divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">{currentLanguage === 'vi' ? 'Hình ảnh' : 'Image'}</th>
                  <th scope="col">{currentLanguage === 'vi' ? 'Tên món ăn' : 'Dish Name'}</th>
                  <th scope="col">{currentLanguage === 'vi' ? 'Danh mục' : 'Category'}</th>
                  <th scope="col">{currentLanguage === 'vi' ? 'Giá bán' : 'Price'}</th>
                  <th scope="col">{currentLanguage === 'vi' ? 'Trạng thái' : 'Status'}</th>
                  <th scope="col" className="text-right">{currentLanguage === 'vi' ? 'Thao tác' : 'Actions'}</th> 
                </tr>
              </thead>
              <tbody>
                {dishesToShow.length > 0 ? (
                  dishesToShow.map((dish) => (
                    <tr key={dish.id}>
                      <td>{dish.id}</td>
                      <td>
                        <img
                          src={dish.image}
                          alt={dishDisplayName(dish)}
                          className="dish-img"
                          onError={(e) => (e.target.src = "https://placehold.co/40x40/e5e7eb/4b5563?text=N/A")}
                        />
                      </td>
                      {/* HIỂN THỊ TÊN MÓN ĂN THEO NGÔN NGỮ */}
                      <td>{dishDisplayName(dish)}</td>
                      <td>{categoryMap[dish.categoryKey]}</td>
                      <td>{formatCurrency(dish.price)}</td>
                      <td>
                        <span
                          className={
                            dish.statusKey === "status_available"
                              ? "status-available"
                              : "status-unavailable"
                          }
                        >
                          {statusMap[dish.statusKey]}
                        </span>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center space-x-2">
                            <button onClick={() => handleDetailView(dish)} className="text-indigo-600 hover:text-indigo-900" title={currentLanguage === 'vi' ? 'Xem Chi Tiết' : 'View Details'}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                            </button>
                            <button onClick={() => handleAddOrEdit(dish)} className="text-blue-600 hover:text-blue-900" title={currentLanguage === 'vi' ? 'Sửa' : 'Edit'}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.111 10.155L5.793 17.207l1.414 1.414 4.685-4.685a2 2 0 00-2.828-2.828z" /></svg>
                            </button>
                            <button className="text-red-600 hover:text-red-900" title={currentLanguage === 'vi' ? 'Xóa' : 'Delete'}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            </button>
                        </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="no-data">
                      {currentLanguage === 'vi' ? 'Không có món ăn nào phù hợp.' : 'No dishes matching the criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* PHÂN TRANG (PAGINATION) */}
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                <span id="pagination-info">{paginationInfo}</span>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150" 
                        disabled={currentPage === 1}
                    >
                        {currentLanguage === 'vi' ? 'Trước' : 'Previous'}
                    </button>
                    
                    {pageNumbers.map(page => (
                        <button 
                            key={page} 
                            onClick={() => setCurrentPage(page)} 
                            className={`px-3 py-1 border border-gray-300 rounded-lg ${
                                page === currentPage ? 'bg-emerald-500 text-white' : 'hover:bg-gray-100'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPagesDisplay, prev + 1))} 
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                        disabled={currentPage === totalPagesDisplay || totalPagesDisplay === 0}
                    >
                        {currentLanguage === 'vi' ? 'Sau' : 'Next'}
                    </button>
                </div>
            </div>
            {/* KẾT THÚC PHÂN TRANG */}

        </div>
      </main>
      
      {/* Modal Xem Chi Tiết */}
      <DetailModal 
        isVisible={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        dish={selectedDish} 
        currentLanguage={currentLanguage} // Truyền ngôn ngữ để dịch nội dung modal
      />

      {/* Modal Thêm/Sửa (Giả định) */}
      <DishModal
          isVisible={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveDish} 
          dish={editingDish}
          currentLanguage={currentLanguage} // Truyền ngôn ngữ
      />
    </div>
  );
}