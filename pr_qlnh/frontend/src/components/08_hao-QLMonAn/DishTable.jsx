import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./DishTable.css"; 
import DishModal from "./DishModal";

// IMPORT DishModal (GIẢ ĐỊNH) - Bạn cần tạo file DishModal.jsx


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
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const dishesData = [
  { id: 'MA001', image: 'https://placehold.co/40x40/4c4d50/ffffff?text=F', name: 'Phở Bò Đặc Biệt', categoryKey: 'main', price: 65000, statusKey: 'status_available', description: 'Món Phở truyền thống...' },
  { id: 'MA002', image: 'https://placehold.co/40x40/facc15/000000?text=C', name: 'Kem Vani Tráng Miệng', categoryKey: 'dessert', price: 35000, statusKey: 'status_unavailable', description: 'Kem vani mát lạnh...' },
  { id: 'MA003', image: 'https://placehold.co/40x40/22c55e/ffffff?text=N', name: 'Nước Cam Ép Tươi', categoryKey: 'drink', price: 40000, statusKey: 'status_available', description: 'Cam tươi nguyên chất...' },
  { id: 'MA004', image: 'https://placehold.co/40x40/3b82f6/ffffff?text=G', name: 'Gỏi Cuốn Tôm Thịt', categoryKey: 'main', price: 50000, statusKey: 'status_available', description: 'Gỏi cuốn thanh mát...' },
  { id: 'MA005', image: 'https://placehold.co/40x40/ef4444/ffffff?text=L', name: 'Lẩu Hải Sản Cay', categoryKey: 'main', price: 299000, statusKey: 'status_available', description: 'Lẩu hải sản thập cẩm...' },
  { id: 'MA006', image: 'https://placehold.co/40x40/9ca3af/ffffff?text=X', name: 'Xôi Gà', categoryKey: 'main', price: 45000, statusKey: 'status_available', description: 'Xôi dẻo thơm...' },
];

const ITEMS_PER_PAGE = 3; 

// --- Component Modal Xem Chi Tiết (Giữ nguyên) ---
const DetailModal = ({ isVisible, onClose, dish }) => {
    // ... (Giữ nguyên nội dung DetailModal)
    if (!isVisible || !dish) return null;

    const statusClass = dish.statusKey === 'status_available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const statusText = statusMap[dish.statusKey];

    return (
        <div id="view-dish-details-modal" className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Chi Tiết Món Ăn</h3>
                <div id="dish-details-container" className="space-y-4">
                    <div className="flex items-center justify-center mb-4 border-b pb-4">
                        <img 
                            src={dish.image} 
                            onError={(e) => e.target.src = 'https://placehold.co/150x150/e5e7eb/4b5563?text=Không+có+ảnh'} 
                            alt={dish.name} 
                            className="h-32 w-32 object-cover rounded-xl shadow-lg border border-gray-200"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                        <p className="font-semibold text-gray-600">ID Món:</p>
                        <p className="text-gray-900 font-mono">{dish.id}</p>
                        <p className="font-semibold text-gray-600">Tên Món:</p>
                        <p className="text-gray-900 font-bold">{dish.name}</p>
                        <p className="font-semibold text-gray-600">Danh Mục:</p>
                        <p className="text-gray-900">{categoryMap[dish.categoryKey]}</p>
                        <p className="font-semibold text-gray-600">Giá Bán:</p>
                        <p className="text-gray-900 font-bold text-lg text-emerald-600">{formatCurrency(dish.price)}</p>
                        <p className="font-semibold text-gray-600">Trạng Thái:</p>
                        <p className="text-gray-900">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}> 
                                {statusMap[dish.statusKey]}
                            </span>
                        </p>
                        <p className="font-semibold text-gray-600 col-span-2 mt-4 border-t pt-4">Mô Tả Chi Tiết:</p>
                        <p className="text-gray-700 col-span-2 text-sm">{dish.description || 'Chưa có mô tả chi tiết cho món ăn này.'}</p>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150">Đóng</button>
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
  
  // === 1. KHAI BÁO STATE CHO MODAL THÊM/SỬA ===
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null); // Lưu món ăn đang sửa (null = Thêm mới)
  // ===========================================

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  // === 2. ĐỊNH NGHĨA CÁC HÀM THAO TÁC MODAL ===
  
  // Hàm mở Modal cho Thêm mới (dish = null) hoặc Sửa (dish = object)
  const handleAddOrEdit = (dish = null) => {
      setEditingDish(dish); 
      setIsEditModalOpen(true); // Mở Modal Thêm/Sửa
  };
  
  // Hàm đóng Modal Thêm/Sửa
  const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setEditingDish(null); // Reset trạng thái chỉnh sửa
  };

  // Hàm xử lý lưu dữ liệu (Thêm mới/Cập nhật)
  const handleSaveDish = (newDishData) => {
      if (newDishData.id) {
          // Logic Cập nhật (giả định)
          setDishes(prev => prev.map(d => d.id === newDishData.id ? newDishData : d));
      } else {
          // Logic Thêm mới (giả định)
          const newId = `MA${String(dishes.length + 1).padStart(3, '0')}`;
          setDishes(prev => [...prev, { ...newDishData, id: newId }]);
      }
      handleCloseEditModal();
      // Yêu cầu lọc lại để hiển thị món mới/sửa đổi
      applyFilters(); 
  };
  // ============================================

  // Hàm mở modal chi tiết (Giữ nguyên)
  const handleDetailView = (dish) => {
      setSelectedDish(dish);
      setIsDetailModalOpen(true);
  };
  
  // Hàm Logic Lọc (Giữ nguyên)
  const applyFilters = () => {
    // ... (logic lọc giữ nguyên)
    const { keyword, category, status, minPrice, maxPrice } = filters;
    
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    const filteredData = dishes.filter(dish => {
        const term = keyword.toLowerCase().trim();
        
        const matchesSearch = term === "" || 
                              dish.name.toLowerCase().includes(term) || 
                              dish.id.toLowerCase().includes(term);

        const matchesCategory = category === "" || dish.categoryKey === category;
        const matchesStatus = status === "" || dish.statusKey === status;
        const matchesPrice = dish.price >= min && dish.price <= max;
        
        return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });

    setFilteredDishes(filteredData);
    setCurrentPage(1); 
  };
  
  // ... (clearFilters và useEffect giữ nguyên) ...
  const clearFilters = () => {
    setFilters({
        keyword: "",
        category: "",
        status: "",
        minPrice: "",
        maxPrice: "",
    });
    // setFilteredDishes(dishesData); // Sử dụng dishes thay vì dishesData để đồng bộ với state
    // Gọi lại applyFilters để dùng state dishes mới nhất
    applyFilters(); 
    setCurrentPage(1); 
  };

  useEffect(() => {
      // Khi data dishes thay đổi (thêm/sửa), cần lọc lại.
      applyFilters();
  }, [dishes]); 

  useEffect(() => {
      // Khi filter category/status thay đổi, tự động lọc
      applyFilters();
  }, [filters.category, filters.status]); 
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({
        ...prev,
        [id]: value
    }));
  };
  
  // === LOGIC PHÂN TRANG (Giữ nguyên) ===
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const dishesToShow = filteredDishes.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const displayStart = filteredDishes.length > 0 ? startIndex + 1 : 0;
  const displayEnd = Math.min(endIndex, filteredDishes.length);
  const paginationInfo = `Hiển thị ${displayStart} đến ${displayEnd} trên ${filteredDishes.length} kết quả`;

  // ====================================


  return (
    <div className="dish-layout"> 
      
      <Sidebar /> 

      <main className="dish-main">
        <div className="flex justify-between items-center mb-6">
          <h2 className="dish-title">Quản Lý Món Ăn</h2>
        </div>

        <div className="dish-container">
          <div className="flex justify-between items-center mb-6">
          {/* 3. GẮN onClick VÀO NÚT "Thêm Món Ăn Mới" */}
          <button 
              onClick={() => handleAddOrEdit(null)} // Thao tác thêm mới, truyền null
              className="flex items-center px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition duration-150"
          >
            {/* Thêm Icon cho đẹp mắt */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
            <span>Thêm Món Ăn Mới</span>
          </button>
        </div>
          {/* Khung Tìm kiếm Nâng cao (Giữ nguyên) */}
          <div className="dish-filter">
              <h4 className="dish-filter-title">Tìm kiếm Nâng cao</h4>
              {/* ... (Nội dung filter giữ nguyên) ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                      <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">Tên món/ID</label>
                      <input type="text" id="keyword" placeholder="Nhập từ khóa tìm kiếm..." className="dish-input" value={filters.keyword} onChange={handleChange} />
                  </div>
                  <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh mục</label>
                      <select id="category" className="dish-input" value={filters.category} onChange={handleChange}>
                          <option value="">Tất cả Danh mục</option>
                          {Object.entries(categoryMap).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <select id="status" className="dish-input" value={filters.status} onChange={handleChange}>
                          <option value="">Tất cả Trạng thái</option>
                          <option value="status_available">Còn hàng</option>
                          <option value="status_unavailable">Hết hàng</option>
                      </select>
                  </div>
                  <div className="flex items-end">
                      <button onClick={applyFilters} className="w-full h-[42px] px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">Áp dụng Lọc</button>
                  </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                  <div>
                      <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Giá Tối thiểu (VNĐ)</label>
                      <input type="number" id="minPrice" min="0" placeholder="0" className="dish-input" value={filters.minPrice} onChange={handleChange} />
                  </div>
                  <div>
                      <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Giá Tối đa (VNĐ)</label>
                      <input type="number" id="maxPrice" min="0" placeholder="Không giới hạn" className="dish-input" value={filters.maxPrice} onChange={handleChange} />
                  </div>
                  <div className="flex items-end col-start-2 md:col-start-3 lg:col-start-4">
                      <button onClick={clearFilters} className="w-full h-[42px] px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-150">Xóa Lọc</button>
                  </div>
              </div>
          </div>
          
          {/* Bảng Danh sách Món ăn */}
          <div className="dish-table-wrapper custom-scroll">
            <table className="dish-table divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Hình ảnh</th>
                  <th scope="col">Tên món ăn</th>
                  <th scope="col">Danh mục</th>
                  <th scope="col">Giá bán</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col" className="text-right">Thao tác</th> 
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
                          alt={dish.name}
                          className="dish-img"
                          onError={(e) => (e.target.src = "https://placehold.co/40x40/e5e7eb/4b5563?text=N/A")}
                        />
                      </td>
                      <td>{dish.name}</td>
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
                            <button onClick={() => handleDetailView(dish)} className="text-indigo-600 hover:text-indigo-900" title="Xem Chi Tiết">
                                {/* Icon Con mắt */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                            </button>
                            {/* Nút Sửa: gọi handleAddOrEdit(dish) */}
                            <button onClick={() => handleAddOrEdit(dish)} className="text-blue-600 hover:text-blue-900" title="Sửa">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.111 10.155L5.793 17.207l1.414 1.414 4.685-4.685a2 2 0 00-2.828-2.828z" /></svg>
                            </button>
                            <button className="text-red-600 hover:text-red-900" title="Xóa">
                                {/* Icon Xóa */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            </button>
                        </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="no-data">
                      Không có món ăn nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* PHÂN TRANG (PAGINATION) MỚI (Giữ nguyên) */}
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                <span id="pagination-info">{paginationInfo}</span>
                <div className="flex space-x-2">
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
            {/* KẾT THÚC PHÂN TRANG */}

        </div>
      </main>
      
      {/* Modal Xem Chi Tiết */}
      {/* Modal Xem Chi Tiết */}
      <DetailModal 
        isVisible={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        dish={selectedDish} 
      />

      {/* Modal Thêm/Sửa đã import */}
      <DishModal
          isVisible={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveDish} // Hàm này sẽ xử lý logic lưu data thực tế
          dish={editingDish}
      />
    </div>
  );
}