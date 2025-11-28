import React, { useState, useMemo, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import "./DishTable.css";
import axios from "axios";
import DishModal from "./DishModal";
import DetailModal from "./DetailModal"; // KHAI BÁO MỚI: Cần file này

// === CẤU HÌNH API ===
const API_URL = "http://127.0.0.1:8000/api/dishes";
const CATEGORY_API_URL = "http://127.0.0.1:8000/api/categories";

// === HÀM HỖ TRỢ VÀ MAPS ===
const statusMap = {
  active: "Còn hàng",
  inactive: "Hết hàng",
  draft: "Nháp/Ẩn",
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Hàm ánh xạ dữ liệu API sang React
const mapApiDataToReact = (item) => ({
  id: item.menu_item_id,
  categoryKey: String(item.category_id),
  name: item.menu_item_name,
  price: parseFloat(item.price),
  image: item.image_url,
  description: item.description,
  statusKey: item.status,
});
export default function DishCRUDTable() {
  // === STATES DỮ LIỆU ===
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // === STATES LỌC & PHÂN TRANG ===
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const itemsPerPage = 10;

  // === STATES MODAL ===
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // STATE CÓ VẤN ĐỀ
  const [selectedDish, setSelectedDish] = useState(null);

  // =========================================================
  // 1. FETCH DỮ LIỆU
  // =========================================================
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      setCategories(response.data.data);
    } catch (err) {
      console.error("Lỗi khi fetch danh mục:", err);
    }
  }, []);

  const fetchDishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      const mappedData = response.data.data.map(mapApiDataToReact);
      setDishes(mappedData);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi fetch data:", err);
      setError(
        "Không thể tải dữ liệu món ăn. Vui lòng kiểm tra Server Backend."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchDishes();
  }, [fetchCategories, fetchDishes]);

  // =========================================================
  // 2. LOGIC CRUD & HỖ TRỢ
  // =========================================================

  const handleSaveDish = async (formData, dishId) => { // formData bây giờ là đối tượng FormData
        try {
            
            if (dishId) {
                // CHẾ ĐỘ CHỈNH SỬA: SỬ DỤNG ID và formData
                // Axios sẽ tự động gửi dưới dạng multipart/form-data
                await axios.post(`${API_URL}/${dishId}`, formData); // Dùng POST cho PUT với _method
                alert(`✅ Cập nhật món ăn thành công!`);
            } else {
                // CHẾ ĐỘ THÊM MỚI: SỬ DỤNG formData
                await axios.post(API_URL, formData);
                alert(`✅ Thêm món ăn thành công!`);
            }
            
            handleCloseEditModal();
            fetchDishes();

        } catch (err) {
            console.error("Lỗi khi lưu món ăn:", err.response ? err.response.data : err.message);
            
            let detailedError = "Không thể lưu món ăn. Vui lòng kiểm tra console để biết chi tiết.";

            if (err.response && err.response.status === 422) {
                const errors = err.response.data.errors;
                if (errors) {
                    detailedError = "Lỗi Validation: ";
                    for (const key in errors) {
                        detailedError += `[${key}]: ${errors[key].join(', ')} | `;
                    }
                    detailedError = detailedError.trim().slice(0, -1); 
                }
            } else if (err.response?.data?.message) {
                 detailedError = err.response.data.message;
            }
            
            alert(`Lỗi: ${detailedError}`);
        }
    };

  const handleDeleteDish = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa món ăn "${name}" không?`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      alert(`✅ Xóa món ăn "${name}" thành công!`);
      fetchDishes();
    } catch (err) {
      console.error(
        "Lỗi khi xóa món ăn:",
        err.response ? err.response.data : err.message
      );
      alert(`Lỗi: ${err.response?.data?.message || "Không thể xóa món ăn."}`);
    }
  };

  const getCategoryName = useCallback(
    (categoryId) => {
      const category = categories.find(
        (cat) => String(cat.category_id) === String(categoryId)
      );
      return category ? category.category_name : "N/A";
    },
    [categories]
  );

  // =========================================================
  // 3. LOGIC LỌC VÀ PHÂN TRANG
  // =========================================================

  // HÀM MỚI: XÓA TẤT CẢ BỘ LỌC
  const handleClearFilters = () => {
    setSearchText("");
    setFilterCategory("");
    setFilterStatus("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  // Lọc và Tìm kiếm (Memoized)
  const filteredDishes = useMemo(() => {
    let currentDishes = dishes;
    const minP = minPrice ? parseFloat(minPrice) : null;
    const maxP = maxPrice ? parseFloat(maxPrice) : null;

    // 1. Lọc theo Danh mục
    if (filterCategory) {
      currentDishes = currentDishes.filter(
        (dish) => dish.categoryKey === filterCategory
      );
    }

    // 2. Lọc theo Trạng thái
    if (filterStatus) {
      currentDishes = currentDishes.filter(
        (dish) => dish.statusKey === filterStatus
      );
    }

    // 3. Lọc theo Khoảng Giá
    if (minP !== null && !isNaN(minP)) {
      currentDishes = currentDishes.filter((dish) => dish.price >= minP);
    }
    if (maxP !== null && !isNaN(maxP)) {
      currentDishes = currentDishes.filter((dish) => dish.price <= maxP);
    }

    // 4. Tìm kiếm theo Tên/Mô tả (Keyword)
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      currentDishes = currentDishes.filter(
        (dish) =>
          dish.name.toLowerCase().includes(lowerSearchText) ||
          (dish.description &&
            dish.description.toLowerCase().includes(lowerSearchText))
      );
    }

    return currentDishes;
  }, [dishes, searchText, filterCategory, filterStatus, minPrice, maxPrice]);

  // Phân trang
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredDishes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Tạo danh sách số trang (Giữ nguyên)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages, currentPage]);

  // =========================================================
  // 4. LOGIC MODAL
  // =========================================================

  const handleAddDish = () => {
    setEditingDish(null);
    setIsEditModalOpen(true);
  };

  const handleEditDish = (dish) => {
    setEditingDish(dish);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingDish(null);
  };

  // HÀM MỚI: Mở Modal Xem Chi Tiết
  const handleViewDetail = (dish) => {
    setSelectedDish(dish);
    setIsDetailModalOpen(true);
  };

  // HÀM MỚI: Đóng Modal Xem Chi Tiết
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDish(null);
  };

  // =========================================================
  // 5. HIỂN THỊ (JSX)
  // =========================================================
  return (
    <div className="dish-layout">
      <Sidebar />
      <main className="dish-main">
        <div className="dish-container p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Quản Lý Món Ăn (Dish CRUD)
          </h2>

          {/* Thanh công cụ tìm kiếm và lọc */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Hàng 1: Tìm kiếm (Keyword) & Nút Thêm */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* 1. Thanh tìm kiếm (Keyword) */}
              <input
                type="text"
                placeholder="Tìm kiếm tên/mô tả (Keyword)..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
              />

              {/* Nút Thêm Món */}
              <button
                onClick={handleAddDish}
                className="dish-button-primary dish-button-base flex items-center gap-1 min-w-[150px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Thêm Món Ăn
              </button>
            </div>

            {/* Hàng 2: Bộ lọc Category, Status, Price & Nút Xóa Lọc */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 2. Lọc Danh mục */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 flex-1 min-w-[150px]"
              >
                <option value="">Tất cả Danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={String(cat.category_id)}>
                    {cat.category_name}
                  </option>
                ))}
              </select>

              {/* 3. Lọc Trạng thái */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 flex-1 min-w-[150px]"
              >
                <option value="">Tất cả Trạng thái</option>
                {Object.entries(statusMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>

              {/* 4. Giá tối thiểu */}
              <input
                type="number"
                placeholder="Giá Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 flex-1 min-w-[120px]"
                min="0"
              />

              {/* 5. Giá tối đa */}
              <input
                type="number"
                placeholder="Giá Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 flex-1 min-w-[120px]"
                min="0"
              />

              {/* 6. Nút Xóa Lọc */}
              {(searchText ||
                filterCategory ||
                filterStatus ||
                minPrice ||
                maxPrice) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 text-red-600 transition duration-150 min-w-[100px]"
                  title="Xóa tất cả các điều kiện lọc"
                >
                  Xóa Lọc
                </button>
              )}
            </div>
          </div>
          {/* HẾT Thanh công cụ tìm kiếm và lọc */}

          {/* Hiển thị lỗi hoặc Loading */}
          {isLoading && (
            <div className="text-center py-4 text-emerald-600">
              Đang tải dữ liệu món ăn...
            </div>
          )}
          {error && (
            <div className="text-center py-4 text-red-600 border border-red-300 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Bảng Món Ăn */}
          {!isLoading && !error && (
            <div className="dish-table-wrapper overflow-x-auto shadow-lg rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Ảnh & Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Danh Mục
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.length > 0 ? (
                    currentData.map((dish, index) => (
                      <tr
                        key={dish.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {dish.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={dish.image}
                                alt={dish.name}
                                onError={(e) =>
                                  (e.target.src =
                                    "https://placehold.co/40x40/e5e7eb/4b5563?text=N/A")
                                }
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {dish.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {getCategoryName(dish.categoryKey)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                          {formatCurrency(dish.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${
                                              dish.statusKey === "active"
                                                ? "bg-green-100 text-green-800"
                                                : dish.statusKey === "inactive"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                          >
                            {statusMap[dish.statusKey] || "Không xác định"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                          {/* Nút Xem Chi Tiết */}
                          <button
                            onClick={() => handleViewDetail(dish)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Xem chi tiết"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline-block"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>

                          {/* Nút Chỉnh sửa */}
                          <button
                            onClick={() => handleEditDish(dish)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Chỉnh sửa"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline-block"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          {/* Nút Xóa */}
                          <button
                            onClick={() => handleDeleteDish(dish.id, dish.name)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline-block"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-4 text-gray-500"
                      >
                        Không tìm thấy món ăn nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Phân Trang */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Hiển thị {currentData.length} trên {filteredDishes.length} món ăn.
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
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
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Sau
              </button>
            </div>
          </div>

          {/* Modal Xem Chi Tiết */}
          <DetailModal
            isVisible={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            dish={selectedDish}
            categories={categories}
          />

          {/* Modal Thêm/Sửa */}
          <DishModal
            isVisible={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSave={handleSaveDish}
            dish={editingDish}
            categories={categories}
          />
        </div>
      </main>
    </div>
  );
}
