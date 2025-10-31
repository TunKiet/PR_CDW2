import React, { useState, useMemo, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar"; 
import "./DishTable.css"; 
import axios from 'axios'; 
import DishModal from "./DishModal"; 

// === CẤU HÌNH API ===
const API_URL = 'http://127.0.0.1:8000/api/dishes';

// === HÀM HỖ TRỢ VÀ MAPS ===

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
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
};

const mapApiDataToReact = (item) => ({
    id: item.menu_item_id,       
    categoryKey: String(item.category_id), 
    name: item.menu_item_name,   
    price: parseFloat(item.price),
    image: item.image_url,
    description: item.description,
    statusKey: item.status,      
});

const mapReactDataToApi = (dish) => ({
    category_id: dish.categoryKey,
    menu_item_name: dish.name,
    description: dish.description,
    price: dish.price,
    image_url: dish.image,
    status: dish.statusKey,
});

// ===================================================================

export default function DishCRUDTable() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Thêm minPrice và maxPrice vào state filters
  const [filters, setFilters] = useState({ keyword: "", category: "", status: "", minPrice: "", maxPrice: "" });
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleFilterChange = (e) => { 
      const { name, value } = e.target;
      setFilters(prevFilters => ({ 
          ...prevFilters, 
          // Chỉ giữ lại số cho giá, loại bỏ ký tự không phải số
          [name]: name === 'minPrice' || name === 'maxPrice' ? value.replace(/[^0-9]/g, '') : value
      })); 
      setCurrentPage(1); 
  };
  
  // HÀM: Xóa tất cả các điều kiện lọc
  const handleClearFilters = () => {
      setFilters({ keyword: "", category: "", status: "", minPrice: "", maxPrice: "" });
      setCurrentPage(1);
  };


  const fetchDishes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL); 
      
      if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          const mappedDishes = response.data.data.map(mapApiDataToReact); 
          setDishes(mappedDishes); 
      } else {
          setError("Dữ liệu API không hợp lệ hoặc thiếu trường 'data'.");
      }
      
    } catch (err) {
      console.error("Lỗi khi fetch data:", err.response || err);
      setError(err.response ? `Lỗi Server (${err.response.status}): ${err.message}` : "Lỗi kết nối API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]); 

  // Logic lọc
  const filteredDishes = useMemo(() => {
    let result = dishes;
    const lowercasedKeyword = filters.keyword.toLowerCase();
    const minPrice = parseFloat(filters.minPrice);
    const maxPrice = parseFloat(filters.maxPrice);

    if (lowercasedKeyword) { result = result.filter(dish => dish.name.toLowerCase().includes(lowercasedKeyword) || String(dish.id).includes(lowercasedKeyword)); }
    if (filters.category) { result = result.filter(dish => String(dish.categoryKey) === String(filters.category)); }
    if (filters.status) { result = result.filter(dish => dish.statusKey === filters.status); }
    
    // Logic lọc Giá
    if (!isNaN(minPrice) && filters.minPrice !== "") { result = result.filter(dish => dish.price >= minPrice); }
    if (!isNaN(maxPrice) && filters.maxPrice !== "") { result = result.filter(dish => dish.price <= maxPrice); }
    
    return result;
  }, [dishes, filters]);

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredDishes.slice(startIndex, startIndex + itemsPerPage);
  
  const pageNumbers = useMemo(() => {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
  }, [totalPages]);

  const handleOpenEditModal = (dish = null) => { setEditingDish(dish); setIsEditModalOpen(true); };
  const handleCloseEditModal = () => { setIsEditModalOpen(false); setEditingDish(null); };

  const handleDeleteDish = async (dishId, dishName) => { 
      if (!window.confirm(`Bạn có chắc chắn muốn xóa món ăn "${dishName}" (ID: ${dishId})?`)) { 
          return;
      }
      try {
          await axios.delete(`${API_URL}/${dishId}`);
          alert(`✅ Đã xóa món ăn ${dishName} thành công!`);
          fetchDishes(); 
      } catch (err) {
          console.error("Lỗi xóa món ăn:", err.response || err);
          alert(`❌ Lỗi: Không thể xóa món ăn. ${err.response?.data?.message || err.message}`);
      }
  };

  const handleSaveDish = async (dishToSave, isEditMode) => { 
      const apiData = mapReactDataToApi(dishToSave);
      
      try {
          if (isEditMode) {
              await axios.put(`${API_URL}/${dishToSave.id}`, apiData);
              alert(`✅ Đã cập nhật món ăn ${dishToSave.id} thành công!`);
          } else {
              const response = await axios.post(API_URL, apiData);
              alert(`✅ Đã thêm món ăn mới (ID: ${response.data.data.menu_item_id}) thành công!`);
          }
          
          handleCloseEditModal(); 
          fetchDishes(); 
      } catch (err) {
          console.error("Lỗi lưu món ăn:", err.response || err);
          const validationErrors = err.response?.data?.errors;
          let errorMessage = err.response?.data?.message || "Lỗi không xác định khi lưu món ăn.";
          
          if (validationErrors) {
              errorMessage += "\nChi tiết:\n";
              Object.values(validationErrors).forEach(messages => {
                  messages.forEach(msg => errorMessage += `- ${msg}\n`);
              });
          }
          alert(`❌ Lỗi: ${errorMessage}`);
      }
  };


  // Khối render cho trạng thái Loading
  if (loading) {
    return (
      <div className="dish-layout">
        <Sidebar />
        <main className="dish-main">
          <div className="dish-container text-center py-10 text-xl font-semibold text-indigo-600">Đang tải dữ liệu món ăn từ Server...</div>
        </main>
      </div>
    );
  }

  // Khối render cho trạng thái Error
  if (error) {
    return (
      <div className="dish-layout">
        <Sidebar />
        <main className="dish-main">
          <div className="dish-container text-center py-10 text-xl font-semibold text-red-600">
            {error} <br/>
            <button onClick={fetchDishes} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">Thử tải lại</button>
          </div>
        </main>
      </div>
    );
  }
  
  // === RENDER NỘI DUNG CHÍNH (PHẦN JSX) ===
  return (
    <div className="dish-layout">
        <Sidebar />
        <main className="dish-main">
            <div className="dish-container">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    📝 Quản Lý Thực Đơn (Đã kết nối Backend)
                </h1>
                
                {/* KHU VỰC LỌC, TÌM KIẾM, VÀ NÚT THÊM MỚI (SỬ DỤNG GRID CHO LAYOUT 2 HÀNG) */}
                <div className="mb-6 p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-semibold text-gray-700">Tìm kiếm Nâng cao</h2>
                         <button 
                            onClick={() => handleOpenEditModal(null)} 
                            className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition duration-150 whitespace-nowrap"
                        >
                            + Thêm Món Ăn Mới
                        </button>
                    </div>

                    {/* HÀNG 1: Tên/ID, Danh Mục, Trạng Thái, Áp dụng Lọc */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
                        
                        {/* 1. TÌM KIẾM THEO TÊN/ID */}
                        <div>
                            <label htmlFor="keyword" className="block text-sm font-medium text-gray-600">Tên món/ID</label>
                            <input
                                type="text"
                                id="keyword"
                                name="keyword"
                                placeholder="Nhập từ khóa tìm kiếm..."
                                value={filters.keyword}
                                onChange={handleFilterChange} 
                                className="dish-modal-input" 
                            />
                        </div>

                        {/* 2. LỌC THEO DANH MỤC */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-600">Danh mục</label>
                            <select
                                id="category"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange} 
                                className="dish-modal-input"
                            >
                                <option value="">Tất cả Danh mục</option>
                                {Object.entries(categoryMap).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. LỌC THEO TRẠNG THÁI */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-600">Trạng thái</label>
                            <select
                                id="status"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange} 
                                className="dish-modal-input"
                            >
                                <option value="">Tất cả Trạng thái</option>
                                {Object.entries(statusMap).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option> 
                                ))}
                            </select>
                        </div>
                        
                        {/* 4. NÚT ÁP DỤNG LỌC */}
                        <div className="flex justify-end">
                            {/* Nút này hiện tại không cần thiết vì lọc chạy theo onChange, nhưng giữ lại cho giao diện */}
                            <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 w-full md:w-auto">
                                Áp dụng Lọc
                            </button>
                        </div>
                    </div>

                    {/* HÀNG 2: Lọc Giá và Xóa Lọc */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        
                         {/* 5. Giá Tối Thiểu */}
                        <div>
                            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-600">Giá Tối Thiểu (VNĐ)</label>
                             <input
                                type="number"
                                id="minPrice"
                                name="minPrice"
                                placeholder="0"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                className="dish-modal-input" 
                            />
                        </div>
                        
                        {/* 6. Giá Tối Đa */}
                        <div>
                            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-600">Giá Tối Đa (VNĐ)</label>
                            <input
                                type="number"
                                id="maxPrice"
                                name="maxPrice"
                                placeholder="Không giới hạn"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                className="dish-modal-input" 
                            />
                        </div>

                        {/* 7. Nút Xóa Lọc */}
                        <div className="col-span-1">
                            <button 
                                onClick={handleClearFilters}
                                className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-150 w-full"
                            >
                                Xóa Lọc
                            </button>
                        </div>
                        {/* Cột còn lại trống */}
                        <div className="col-span-1"></div> 
                    </div>

                </div>
                
                {/* BẢNG MÓN ĂN */}
                <div className="dish-table-wrapper">
                    <table className="dish-table">
                    <thead>
                        <tr>
                            <th className="w-16">ID</th>
                            <th className="w-12">Ảnh</th>
                            <th className="w-64">Tên Món Ăn</th>
                            <th className="w-32">Danh Mục</th>
                            <th className="w-24">Giá Bán</th>
                            <th className="w-24">Trạng Thái</th>
                            <th className="w-32 text-center">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                        currentItems.map((dish) => (
                            <tr key={dish.id}>
                                <td>{dish.id}</td> 
                                <td><img src={dish.image} alt={dish.name} className="dish-img w-10 h-10 object-cover rounded-full" onError={(e) => (e.target.src = "https://placehold.co/40x40/e5e7eb/4b5563?text=N/A")}/></td>
                                <td>{dish.name}</td>
                                <td>{categoryMap[dish.categoryKey] || dish.categoryKey}</td> 
                                <td>{formatCurrency(dish.price)}</td>
                                <td>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${dish.statusKey === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {statusMap[dish.statusKey] || dish.statusKey}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                    <button className="text-indigo-600 hover:text-indigo-900 transition">Xem</button>
                                    <button onClick={() => handleOpenEditModal(dish)} className="text-yellow-600 hover:text-yellow-900 transition">Sửa</button>
                                    <button onClick={() => handleDeleteDish(dish.id, dish.name)} className="text-red-600 hover:text-red-900 transition">Xóa</button>
                                </td>
                            </tr>
                        ))
                        ) : (
                        <tr><td colSpan={7} className="text-center py-4 text-gray-500">Không có món ăn nào phù hợp với điều kiện lọc.</td></tr>
                        )}
                    </tbody>
                    </table>
                </div>

                {/* PHÂN TRANG */}
                <div className="pagination-controls mt-4 flex justify-between items-center">
                    <div className="flex space-x-1">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                            disabled={currentPage === 1}
                        >
                            Trước
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
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Sau
                        </button>
                    </div>
                </div>
                
                {/* Modal Thêm/Sửa */}
                <DishModal
                    isVisible={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveDish} 
                    dish={editingDish}
                />

            </div>
        </main>
    </div>
  );
}