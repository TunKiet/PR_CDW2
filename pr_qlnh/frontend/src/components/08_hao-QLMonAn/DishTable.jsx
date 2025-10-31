import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./DishTable.css";

// ==== Modal xem chi tiết món ăn ====
function DetailModal({ isVisible, onClose, dish }) {
  if (!isVisible || !dish) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-5 relative">
        <h3 className="text-lg font-semibold mb-3">Chi tiết món ăn</h3>
        <img
          src={dish.image}
          alt={dish.name}
          className="w-24 h-24 object-cover rounded mx-auto mb-3"
        />
        <p><strong>ID:</strong> {dish.id}</p>
        <p><strong>Tên món:</strong> {dish.name}</p>
        <p><strong>Danh mục:</strong> {dish.categoryKey}</p>
        <p><strong>Giá:</strong> {dish.price.toLocaleString()}₫</p>
        <p><strong>Trạng thái:</strong> {dish.statusKey}</p>
        <button
          className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

export default function DishTable() {
  const [dishes, setDishes] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    status: "",
  });

  // 👉 Thêm state cho phân trang & modal
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [selectedDish, setSelectedDish] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
      {
        id: "MA004",
        image: "https://placehold.co/40x40/f97316/ffffff?text=B",
        name: "Bánh Flan Caramen",
        categoryKey: "dessert",
        price: 25000,
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

  // 👉 Phân trang
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDishes = filteredDishes.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const paginationInfo = `Trang ${currentPage}/${totalPages || 1}`;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // 👉 Xem chi tiết món
  const handleDetailView = (dish) => {
    setSelectedDish(dish);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="dish-layout">
      <Sidebar />

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
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentDishes.length > 0 ? (
                  currentDishes.map((dish) => (
                    <tr key={dish.id}>
                      <td>{dish.id}</td>
                      <td>
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="dish-img"
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
                      <td className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDetailView(dish)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Xem Chi Tiết"
                        >
                          👁
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          🗑
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

          {/* PHÂN TRANG */}
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
            <span id="pagination-info">{paginationInfo}</span>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                Trước
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border border-gray-300 rounded-lg ${
                    page === currentPage
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(totalPages, prev + 1)
                  )
                }
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal xem chi tiết */}
      <DetailModal
        isVisible={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        dish={selectedDish}
      />
    </div>
  );
}
