// src/pages/Admin/DishStatusManagement.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import "./DishTable.css";

// === API CONFIGURATION ===
const API_BASE_URL = "http://127.0.0.1:8000/api";
const API_DISHES_URL = `${API_BASE_URL}/dishes`;

// === HÀM HỖ TRỢ (OUTSIDE COMPONENT - OK) ===
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mapping status
const statusMap = {
  active: "Còn hàng",
  inactive: "Hết hàng",
  out_of_stock: "Hết hàng",
  paused: "Tạm ngưng",
  low_stock: "Sắp hết",
};

const categoryMap = {
  1: "Món Chính",
  2: "Tráng Miệng",
  3: "Đồ Uống",
  4: "Khai Vị",
};

// === COMPONENT MODAL (NESTED COMPONENT) ===
const UnavailableReasonModal = ({ isVisible, onClose, onSave, dishName }) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const predefinedReasons = [
    "Hết nguyên liệu chính",
    "Thiết bị bếp hỏng",
    "Đầu bếp chuyên môn nghỉ",
    "Nguyên liệu không đạt chất lượng",
    "Món không phù hợp khung giờ",
    "Khác",
  ];

  const handleSave = () => {
    const finalReason = reason === "Khác" ? customReason : reason;

    if (!finalReason) {
      alert("Vui lòng chọn hoặc nhập lý do hết hàng");
      return;
    }

    onSave({
      unavailable_reason: finalReason,
      unavailable_until: estimatedTime || null,
    });
  };

  useEffect(() => {
    if (!isVisible) {
      setReason("");
      setCustomReason("");
      setEstimatedTime("");
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl" style={{ position: "relative", zIndex: 10001 }} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Lý do hết hàng: {dishName}
        </h3>

        <div className="space-y-4">
          {/* Lý do */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn lý do (*)
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">-- Chọn lý do --</option>
              {predefinedReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Custom reason */}
          {reason === "Khác" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập lý do cụ thể
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Nhập lý do..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}

          {/* Thời gian */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dự kiến có hàng trở lại (Tùy chọn)
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-lg"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Xác nhận Hết hàng
          </button>
        </div>
      </div>
    </div>
  );
};

// === COMPONENT CHÍNH ===
export default function DishStatusManagement() {
  // === ALL STATES MUST BE HERE (INSIDE COMPONENT) ===
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dishTimestamps, setDishTimestamps] = useState({});
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  // Bulk update states
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    low_stock: 0,
  });

  // === API CALLS ===
  const fetchDishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_DISHES_URL}`);
      const result = await response.json();

      if (result.status === "success") {
        setDishes(result.data);
        const timestamps = {};
        result.data.forEach((dish) => {
          timestamps[dish.menu_item_id] = dish.updated_at;
        });
        setDishTimestamps(timestamps);
        calculateStats(result.data);
      } else {
        alert("Không thể tải danh sách món ăn");
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      alert("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateStats = useCallback((dishesData) => {
    const total = dishesData.length;
    const active = dishesData.filter((d) => d.status === "active").length;
    const inactive = dishesData.filter(
      (d) => d.status === "inactive" || d.status === "out_of_stock"
    ).length;
    const low_stock = dishesData.filter(
      (d) => d.stock_quantity <= 5 && d.stock_quantity > 0
    ).length;

    setStats({ total, active, inactive, low_stock });
  }, []);

  const updateDishStatus = useCallback(
    async (dishId, newStatus, reason = null, estimatedTime = null) => {
      try {
        const payload = {
          status: newStatus,
          unavailable_reason: reason,
          unavailable_until: estimatedTime,
          updated_at: dishTimestamps[dishId], // ⭐ GỬI TIMESTAMP
        };

        const response = await fetch(`${API_DISHES_URL}/${dishId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.status === 409) {
          handleConflict(result, dishId);
          return;
        }

        if (result.status === "success") {
          alert(result.message);
          // ⭐ CẬP NHẬT TIMESTAMP MỚI
          setDishTimestamps((prev) => ({
            ...prev,
            [dishId]: result.data.updated_at,
          }));
          await fetchDishes();
          setIsModalOpen(false);
          setSelectedDish(null);
        } else {
          alert(result.message || "Có lỗi xảy ra khi cập nhật");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Có lỗi xảy ra khi cập nhật trạng thái");
      }
    },
    [dishTimestamps, fetchDishes]
  );

  const toggleStatus = useCallback(
    (dish) => {
      const newStatus = dish.status === "active" ? "inactive" : "active";

      if (newStatus === "inactive") {
        setSelectedDish(dish);
        setIsModalOpen(true);
        return;
      }

      updateDishStatus(dish.menu_item_id, newStatus, null, null);
    },
    [updateDishStatus]
  );

  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState(null);

  const handleConflict = (result, dishId) => {
    setConflictData({
      message: result.message,
      currentData: result.current_data,
      dishId: dishId,
    });
    setShowConflictModal(true);
  };

  const handleReloadAfterConflict = async () => {
    await fetchDishes();
    setShowConflictModal(false);
    setConflictData(null);
    alert("✅ Đã tải lại dữ liệu mới nhất!");
  };

  const bulkUpdateStatus = useCallback(
    async (newStatus, reason = null) => {
      if (selectedDishes.length === 0) {
        alert("Vui lòng chọn ít nhất 1 món");
        return;
      }

      if (
        !window.confirm(
          `Bạn có chắc muốn cập nhật ${selectedDishes.length} món sang trạng thái "${statusMap[newStatus]}"?`
        )
      ) {
        return;
      }

      try {
        const response = await fetch(`${API_DISHES_URL}/bulk-update-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dish_ids: selectedDishes,
            status: newStatus,
            unavailable_reason: reason,
          }),
        });

        const result = await response.json();

        if (result.status === "success") {
          alert(result.message);
          setSelectedDishes([]);
          await fetchDishes();
        } else {
          alert(result.message || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error bulk updating:", error);
        alert("Có lỗi xảy ra khi cập nhật hàng loạt");
      }
    },
    [selectedDishes, fetchDishes]
  );

  // === EFFECTS ===
  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // === FILTERING ===
  const filteredDishes = useMemo(() => {
    let result = dishes;

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter((d) =>
        d.menu_item_name.toLowerCase().includes(kw)
      );
    }

    if (filters.category) {
      result = result.filter(
        (d) => d.category_id === parseInt(filters.category)
      );
    }

    if (filters.status) {
      result = result.filter((d) => d.status === filters.status);
    }

    return result;
  }, [dishes, filters]);

  // === PAGINATION ===
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredDishes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // === HANDLERS ===
  const handleFilterChange = useCallback((e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
  }, []);

  const toggleSelectDish = useCallback((dishId) => {
    setSelectedDishes((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedDishes(currentItems.map((d) => d.menu_item_id));
  }, [currentItems]);

  const deselectAll = useCallback(() => {
    setSelectedDishes([]);
  }, []);

  const handleModalSave = useCallback(
    (data) => {
      updateDishStatus(
        selectedDish.menu_item_id,
        "inactive",
        data.unavailable_reason,
        data.unavailable_until
      );
    },
    [selectedDish, updateDishStatus]
  );
  // Thêm vào cuối component, trước return
  const ConflictModal = () => {
    if (!showConflictModal || !conflictData) return null;

    return (
      <div
        className="modal is-active"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}
        onClick={() => {
          setShowConflictModal(false);
          setConflictData(null);
        }}
      >
        <div className="bg-white p-6 rounded-xl max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">⚠️</span>
            <h3 className="text-xl font-bold text-red-600">
              Xung đột dữ liệu!
            </h3>
          </div>

          {/* Message */}
          <p className="text-gray-700 mb-4">{conflictData.message}</p>

          {/* Current Data */}
          {conflictData.currentData && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-yellow-500">
              <h4 className="font-semibold mb-2 text-gray-800">
                📊 Dữ liệu hiện tại trong hệ thống:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • <strong>Tên:</strong>{" "}
                  {conflictData.currentData.menu_item_name}
                </li>
                <li>
                  • <strong>Trạng thái:</strong>{" "}
                  {statusMap[conflictData.currentData.status]}
                </li>
                <li>
                  • <strong>Giá:</strong>{" "}
                  {formatCurrency(conflictData.currentData.price)}
                </li>
                <li>
                  • <strong>Cập nhật lúc:</strong>{" "}
                  {new Date(conflictData.currentData.updated_at).toLocaleString(
                    "vi-VN"
                  )}
                </li>
              </ul>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800">
            <strong>💡 Lý do:</strong> Có người khác đã chỉnh sửa món này khi
            bạn đang mở form. Vui lòng tải lại để xem dữ liệu mới nhất.
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleReloadAfterConflict}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              🔄 Tải lại dữ liệu
            </button>
            <button
              onClick={() => {
                setShowConflictModal(false);
                setConflictData(null);
              }}
              className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };
  // === RENDER ===
  return (
    <div className="dish-layout">
      <Sidebar />
      <main className="dish-main">
        <div className="dish-container">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            ⚡ Quản Lý Tình Trạng Món Ăn
          </h1>

          {/* STATS DASHBOARD */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Tổng số món</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Còn hàng</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Hết hàng</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.inactive}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600">Sắp hết</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.low_stock}
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className="dish-controls">
            <input
              type="text"
              name="keyword"
              placeholder="Tìm kiếm theo Tên món ăn..."
              value={filters.keyword}
              onChange={handleFilterChange}
              className="dish-input max-w-sm"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="dish-input"
            >
              <option value="">Tất cả Danh mục</option>
              {Object.keys(categoryMap).map((key) => (
                <option key={key} value={key}>
                  {categoryMap[key]}
                </option>
              ))}
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="dish-input"
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="active">Còn hàng</option>
              <option value="inactive">Hết hàng</option>
            </select>

            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {showBulkActions ? "Ẩn" : "Hiện"} Cập nhật hàng loạt
            </button>
          </div>

          {/* BULK ACTIONS */}
          {showBulkActions && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">
                    Đã chọn: {selectedDishes.length} món
                  </span>
                  <button
                    onClick={selectAll}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    onClick={deselectAll}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Bỏ chọn
                  </button>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => bulkUpdateStatus("active")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    ✓ Còn hàng
                  </button>
                  <button
                    onClick={() =>
                      bulkUpdateStatus("inactive", "Cập nhật hàng loạt")
                    }
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ✗ Hết hàng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="dish-table-wrapper mt-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <table className="dish-table">
                <thead>
                  <tr>
                    {showBulkActions && <th className="w-[50px]">Chọn</th>}
                    <th className="w-1/12">ID</th>
                    <th className="w-2/12">Ảnh</th>
                    <th className="w-3/12">Tên Món Ăn</th>
                    <th className="w-1/12">Loại</th>
                    <th className="w-1/12">Giá</th>
                    <th className="w-1/12 text-center">Tình Trạng</th>
                    <th className="w-2/12 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((dish) => (
                      <tr key={dish.menu_item_id}>
                        {showBulkActions && (
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={selectedDishes.includes(
                                dish.menu_item_id
                              )}
                              onChange={() =>
                                toggleSelectDish(dish.menu_item_id)
                              }
                              className="w-4 h-4"
                            />
                          </td>
                        )}
                        <td>{dish.menu_item_id}</td>
                        <td>
                          <img
                            src={
                              dish.image_url ||
                              "https://placehold.co/40x40/e5e7eb/4b5563?text=N/A"
                            }
                            alt={dish.menu_item_name}
                            className="dish-img"
                            onError={(e) =>
                              (e.target.src =
                                "https://placehold.co/40x40/e5e7eb/4b5563?text=N/A")
                            }
                          />
                        </td>
                        <td>
                          <div>{dish.menu_item_name}</div>
                          {dish.unavailable_reason && (
                            <div className="text-xs text-red-600 mt-1">
                              ⚠ {dish.unavailable_reason}
                            </div>
                          )}
                        </td>
                        <td>{categoryMap[dish.category_id] || "N/A"}</td>
                        <td>{formatCurrency(dish.price)}</td>
                        <td className="text-center">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              dish.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {statusMap[dish.status] || dish.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => toggleStatus(dish)}
                            className={`px-3 py-1 text-sm font-semibold rounded-lg transition duration-150 w-full max-w-[120px] ${
                              dish.status === "active"
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {dish.status === "active" ? "Hết hàng" : "Còn hàng"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={showBulkActions ? 8 : 7} className="no-data">
                        Không có món ăn nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION */}
          {!isLoading && filteredDishes.length > 0 && (
            <div className="dish-pagination-wrapper">
              <div className="text-sm text-gray-700">
                Hiển thị {startIndex + 1} -{" "}
                {Math.min(startIndex + itemsPerPage, filteredDishes.length)} /{" "}
                {filteredDishes.length}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Trước
                </button>
                <span className="px-3 py-1">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      <UnavailableReasonModal
        isVisible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDish(null);
        }}
        onSave={handleModalSave}
        dishName={selectedDish?.menu_item_name}
      />
      <ConflictModal />
    </div>
  );
}
