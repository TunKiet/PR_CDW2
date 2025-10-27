import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./DishTable.css"; 

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

// Dữ liệu mẫu (Đã mở rộng lên 6 món ăn để kiểm tra phân trang)
const dishesData = [
  { id: 'MA001', image: 'https://placehold.co/40x40/4c4d50/ffffff?text=F', name: 'Phở Bò Đặc Biệt', categoryKey: 'main', price: 65000, statusKey: 'status_available', description: 'Món Phở truyền thống...' },
  { id: 'MA002', image: 'https://placehold.co/40x40/facc15/000000?text=C', name: 'Kem Vani Tráng Miệng', categoryKey: 'dessert', price: 35000, statusKey: 'status_unavailable', description: 'Kem vani mát lạnh...' },
  { id: 'MA003', image: 'https://placehold.co/40x40/22c55e/ffffff?text=N', name: 'Nước Cam Ép Tươi', categoryKey: 'drink', price: 40000, statusKey: 'status_available', description: 'Cam tươi nguyên chất...' },
  { id: 'MA004', image: 'https://placehold.co/40x40/3b82f6/ffffff?text=G', name: 'Gỏi Cuốn Tôm Thịt', categoryKey: 'main', price: 50000, statusKey: 'status_available', description: 'Gỏi cuốn thanh mát...' },
  { id: 'MA005', image: 'https://placehold.co/40x40/ef4444/ffffff?text=L', name: 'Lẩu Hải Sản Cay', categoryKey: 'main', price: 299000, statusKey: 'status_available', description: 'Lẩu hải sản thập cẩm...' },
  { id: 'MA006', image: 'https://placehold.co/40x40/9ca3af/ffffff?text=X', name: 'Xôi Gà', categoryKey: 'main', price: 45000, statusKey: 'status_available', description: 'Xôi dẻo thơm...' },
];

const ITEMS_PER_PAGE = 3; // Giới hạn 5 món ăn mỗi trang

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
  
  // === STATE PHÂN TRANG MỚI ===
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  // ============================

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  // Hàm mở modal chi tiết
  const handleDetailView = (dish) => {
      setSelectedDish(dish);
      setIsDetailModalOpen(true);
  };
  
  // Hàm Logic Lọc
  const applyFilters = () => {
    const { keyword, category, status, minPrice, maxPrice } = filters;
    
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    const filteredData = dishesData.filter(dish => {
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
    setCurrentPage(1); // Reset về trang 1 sau khi lọc
  };
  
  // Hàm Xóa Lọc
  const clearFilters = () => {
    setFilters({
        keyword: "",
        category: "",
        status: "",
        minPrice: "",
        maxPrice: "",
    });
    setFilteredDishes(dishesData);
    setCurrentPage(1); // Reset về trang 1
  };

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
  
  // === LOGIC PHÂN TRANG MỚI ===
  
  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const dishesToShow = filteredDishes.slice(startIndex, endIndex);

  // Tạo mảng các số trang
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Thông tin hiển thị phân trang
  const displayStart = filteredDishes.length > 0 ? startIndex + 1 : 0;
  const displayEnd = Math.min(endIndex, filteredDishes.length);
  const paginationInfo = `Hiển thị ${displayStart} đến ${displayEnd} trên ${filteredDishes.length} kết quả`;

  // ============================


  return (
    <div className="dish-layout"> 
      
      {/* Sidebar giả lập (Cần import component thực tế) */}
      <Sidebar /> 

      <main className="dish-main">
        <div className="flex justify-between items-center mb-6">
          <h2 className="dish-title">Quản Lý Món Ăn</h2>
        </div>

        <div className="dish-container">
          <div className="flex justify-between items-center mb-6">
          <button className="flex items-center px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition duration-150">
            {/* ... Icon Thêm ... */}
            <span>Thêm Món Ăn Mới</span>
          </button>
        </div>
          {/* Khung Tìm kiếm Nâng cao (Giữ nguyên) */}
          <div className="dish-filter">
              <h4 className="dish-filter-title">Tìm kiếm Nâng cao</h4>
              
              {/* Hàng 1: ... */}
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
              
              {/* Hàng 2: ... */}
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
                {/* HIỂN THỊ DỮ LIỆU ĐÃ PHÂN TRANG */}
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
                                {/* ... Icon Con mắt ... */}
                            </button>
                            <button className="text-blue-600 hover:text-blue-900" title="Sửa">
                                {/* ... Icon Sửa ... */}
                            </button>
                            <button className="text-red-600 hover:text-red-900" title="Xóa">
                                {/* ... Icon Xóa ... */}
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
          
          {/* PHÂN TRANG (PAGINATION) MỚI */}
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                <span id="pagination-info">{paginationInfo}</span>
                <div className="flex space-x-2">
                    {/* Nút TRƯỚC */}
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150" 
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>
                    
                    {/* Các Nút SỐ TRANG */}
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
                    
                    {/* Nút SAU */}
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
      <DetailModal 
        isVisible={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        dish={selectedDish} 
      />
    </div>
  );
}