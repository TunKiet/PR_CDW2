import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./DishTable.css"; // file css riêng

export default function DishTable() {
  const [dishes, setDishes] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    status: "",
  });

  const categoryMap = {
    main: "Món Chính",
    dessert: "Tráng Miệng",
    drink: "Đồ Uống",
  };

  const statusMap = {
    status_available: "Còn hàng",
    status_unavailable: "Hết hàng",
  };

  useEffect(() => {
    setDishes([
      {
        id: "MA001",
        image: "https://placehold.co/40x40/4c4d50/ffffff?text=F",
        name: "Phở Bò Đặc Biệt",
        categoryKey: "main",
        price: 65000,
        statusKey: "status_available",
      },
      {
        id: "MA002",
        image: "https://placehold.co/40x40/facc15/000000?text=C",
        name: "Kem Vani Tráng Miệng",
        categoryKey: "dessert",
        price: 35000,
        statusKey: "status_unavailable",
      },
      {
        id: "MA003",
        image: "https://placehold.co/40x40/22c55e/ffffff?text=N",
        name: "Nước Cam Ép Tươi",
        categoryKey: "drink",
        price: 40000,
        statusKey: "status_available",
      },
    ]);
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const filteredDishes = dishes.filter((dish) => {
    const keyword = filters.keyword.toLowerCase();
    return (
      (keyword === "" ||
        dish.name.toLowerCase().includes(keyword) ||
        dish.id.toLowerCase().includes(keyword)) &&
      (filters.category === "" || dish.categoryKey === filters.category) &&
      (filters.status === "" || dish.statusKey === filters.status)
    );
  });

  return (
    <div className="dish-layout">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung chính */}
      <main className="dish-main">
        <div className="dish-container">
          <h2 className="dish-title">Quản Lý Món Ăn</h2>

          {/* Bộ lọc */}
          <div className="dish-filter">
            <h4 className="dish-filter-title">Tìm kiếm Nâng cao</h4>
            <div className="dish-filter-grid">
              <input
                type="text"
                placeholder="Nhập tên món hoặc ID..."
                className="dish-input"
                value={filters.keyword}
                onChange={(e) =>
                  setFilters({ ...filters, keyword: e.target.value })
                }
              />
              <select
                className="dish-input"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">Tất cả Danh mục</option>
                <option value="main">Món Chính</option>
                <option value="dessert">Tráng Miệng</option>
                <option value="drink">Đồ Uống</option>
              </select>
              <select
                className="dish-input"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">Tất cả Trạng thái</option>
                <option value="status_available">Còn hàng</option>
                <option value="status_unavailable">Hết hàng</option>
              </select>
            </div>
          </div>

          {/* Bảng món ăn */}
          <div className="dish-table-wrapper">
            <table className="dish-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Tên món ăn</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredDishes.length > 0 ? (
                  filteredDishes.map((dish) => (
                    <tr key={dish.id}>
                      <td>{dish.id}</td>
                      <td>
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="dish-img"
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/40x40/e5e7eb/4b5563?text=N/A")
                          }
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
                    <td colSpan={6} className="no-data">
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
