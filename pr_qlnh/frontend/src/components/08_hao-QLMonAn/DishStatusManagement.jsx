// src/pages/Admin/DishStatusManagement.jsx (Trang Độc lập - Có Sidebar)
import React, { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar"; // Đã thêm Sidebar
import "./DishTable.css";

// === HÀM HỖ TRỢ VÀ DỮ LIỆU MẪU (Sử dụng lại) ===
const categoryMap = { /* ... */ };
const statusMap = { /* ... */ };
const formatCurrency = (amount) => { /* ... */ return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount); };

const dishesData = [
    // Món Chính (main)
    { id: 'MA001', image: 'https://placehold.co/40x40/4c4d50/ffffff?text=F', name: 'Phở Bò Đặc Biệt', categoryKey: 'main', price: 65000, statusKey: 'status_available', description: 'Món Phở truyền thống, nước dùng đậm đà, thịt bò tái/chín.' },
    { id: 'MA004', image: 'https://placehold.co/40x40/3b82f6/ffffff?text=R', name: 'Gỏi Cuốn Tôm Thịt', categoryKey: 'main', price: 45000, statusKey: 'status_available', description: 'Gỏi cuốn thanh mát với tôm, thịt ba rọi và bún tươi.' },
    { id: 'MA007', image: 'https://placehold.co/40x40/991b1b/ffffff?text=C', name: 'Cơm Gà Hải Nam', categoryKey: 'main', price: 79000, statusKey: 'status_available', description: 'Cơm nấu bằng nước gà béo, ăn kèm gà luộc và nước chấm.' },
    { id: 'MA010', image: 'https://placehold.co/40x40/4338ca/ffffff?text=M', name: 'Mì Ý Sốt Bò Băm', categoryKey: 'main', price: 85000, statusKey: 'status_unavailable', description: 'Mì Ý Spaghetti với sốt bò băm truyền thống.' },
    
    // Tráng Miệng (dessert)
    { id: 'MA002', image: 'https://placehold.co/40x40/facc15/000000?text=C', name: 'Kem Vani Tráng Miệng', categoryKey: 'dessert', price: 35000, statusKey: 'status_unavailable', description: 'Kem Vani mát lạnh, thơm béo, rắc hạt hạnh nhân.' },
    { id: 'MA006', image: 'https://placehold.co/40x40/10b981/ffffff?text=E', name: 'Bánh Flan Caramen', categoryKey: 'dessert', price: 20000, statusKey: 'status_available', description: 'Bánh flan caramen béo ngậy, mịn màng.' },
    { id: 'MA008', image: 'https://placehold.co/40x40/d946ef/ffffff?text=P', name: 'Panna Cotta Dâu', categoryKey: 'dessert', price: 45000, statusKey: 'status_available', description: 'Panna Cotta mềm mại vị sữa, ăn kèm sốt dâu tươi.' },
    { id: 'MA011', image: 'https://placehold.co/40x40/f97316/ffffff?text=T', name: 'Trái Cây Theo Mùa', categoryKey: 'dessert', price: 50000, statusKey: 'status_available', description: 'Các loại trái cây tươi ngon theo mùa.' },

    // Đồ Uống (drink)
    { id: 'MA003', image: 'https://placehold.co/40x40/ef4444/ffffff?text=J', name: 'Nước ép Cam Tươi', categoryKey: 'drink', price: 40000, statusKey: 'status_available', description: 'Nước ép cam nguyên chất 100%, không đường.' },
    { id: 'MA005', image: 'https://placehold.co/40x40/6b7280/ffffff?text=T', name: 'Trà Đá', categoryKey: 'drink', price: 5000, statusKey: 'status_available', description: 'Thức uống giải khát phổ thông, miễn phí.' },
    { id: 'MA009', image: 'https://placehold.co/40x40/22c55e/ffffff?text=S', name: 'Sinh Tố Bơ', categoryKey: 'drink', price: 55000, statusKey: 'status_unavailable', description: 'Sinh tố bơ tươi, sữa đặc và đá xay.' },
    { id: 'MA012', image: 'https://placehold.co/40x40/38bdf8/ffffff?text=L', name: 'Nước Lọc Chai', categoryKey: 'drink', price: 15000, statusKey: 'status_available', description: 'Nước lọc đóng chai 500ml.' },
];

// ===================================================================

export default function DishStatusManagement() {
  const [dishes, setDishes] = useState(dishesData);
  const [filters, setFilters] = useState({ keyword: "", category: "", status: "", });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredDishes = useMemo(() => {
    let result = dishes;
    const lowercasedKeyword = filters.keyword.toLowerCase();
    if (lowercasedKeyword) { result = result.filter(dish => dish.name.toLowerCase().includes(lowercasedKeyword)); }
    if (filters.category) { result = result.filter(dish => dish.categoryKey === filters.category); }
    if (filters.status) { result = result.filter(dish => dish.statusKey === filters.status); }
    return result;
  }, [dishes, filters]);

  // const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredDishes.slice(startIndex, startIndex + itemsPerPage);

  const toggleStatus = (dishId) => {
    setDishes(prevDishes => prevDishes.map(dish => {
      if (dish.id === dishId) {
        const newStatus = dish.statusKey === 'status_available' ? 'status_unavailable' : 'status_available';
        console.log(`[ACTION] Cập nhật món ${dish.id} sang trạng thái: ${statusMap[newStatus]}`);
        return { ...dish, statusKey: newStatus };
      }
      return dish;
    }));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1); 
  };


  return (
    <div className="dish-layout">
      <Sidebar />
      <main className="dish-main">
        <div className="dish-container">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                ⚡ Quản Lý Tình Trạng Món Ăn (Status Toggle)
            </h1>

            {/* KHU VỰC LỌC VÀ TÌM KIẾM */}
            <div className="dish-controls">
                <input type="text" name="keyword" placeholder="Tìm kiếm theo Tên món ăn..." value={filters.keyword} onChange={handleFilterChange} className="dish-input max-w-sm"/>
                <select name="category" value={filters.category} onChange={handleFilterChange} className="dish-input">
                    <option value="">Tất cả Danh mục</option>
                    {Object.keys(categoryMap).map(key => (<option key={key} value={key}>{categoryMap[key]}</option>))}
                </select>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="dish-input">
                    <option value="">Tất cả Trạng thái</option>
                    {Object.keys(statusMap).map(key => (<option key={key} value={key}>{statusMap[key]}</option>))}
                </select>
                {/* Giữ khoảng trắng để căn chỉnh */}
                <div className="w-[170px]"></div> 
            </div>

            {/* BẢNG QUẢN LÝ TÌNH TRẠNG */}
            <div className="dish-table-wrapper mt-4">
                <table className="dish-table">
                  <thead>
                    <tr>
                      <th className="w-1/12">ID</th>
                      <th className="w-2/12">Ảnh</th>
                      <th className="w-4/12">Tên Món Ăn</th>
                      <th className="w-1/12">Loại</th>
                      <th className="w-1/12">Giá</th>
                      <th className="w-1/12 text-center">Tình Trạng</th>
                      <th className="w-2/12 text-center">Thao tác Nhanh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                    currentItems.map((dish) => (
                      <tr key={dish.id}>
                        <td>{dish.id}</td>
                        <td><img src={dish.image} alt={dish.name} className="dish-img" onError={(e) => (e.target.src = "https://placehold.co/40x40/e5e7eb/4b5563?text=N/A")}/></td>
                        <td>{dish.name}</td>
                        <td>{categoryMap[dish.categoryKey]}</td>
                        <td>{formatCurrency(dish.price)}</td>
                        <td className="text-center">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${dish.statusKey === "status_available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {statusMap[dish.statusKey]}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => toggleStatus(dish.id)}
                            className={`px-3 py-1 text-sm font-semibold rounded-lg transition duration-150 w-full max-w-[120px] ${
                              dish.statusKey === "status_available"
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {dish.statusKey === "status_available" ? 'Hết hàng' : 'Còn hàng'}
                          </button>
                        </td>
                      </tr>
                    ))
                    ) : (
                    <tr><td colSpan={7} className="no-data">Không có món ăn nào phù hợp với điều kiện lọc.</td></tr>
                    )}
                  </tbody>
                </table>
            </div>
            
            {/* PHÂN TRANG */}
            <div className="dish-pagination-wrapper">
                {/* ... Logic phân trang tương tự DishCRUDTable ... */}
            </div>
        </div>
      </main>
    </div>
  );
}