import React, { useState, useEffect, useCallback } from "react";
import "./restaurant_infor_manage.css";
import Sidebar from "../../components/Sidebar";

// === API Configuration ===
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
const API_URL = "http://127.0.0.1:8000/api/dishes";

// === HÀM HỖ TRỢ ===
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

// === COMPONENT MODAL THÊM/SỬA PROMOTION ===
const PromoEditModal = ({ isVisible, onClose, onSave, promotion }) => {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    discount_type: "fixed",
    discount_value: 0,
    max_uses: 0,
    expired_at: "",
    status: "active",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (promotion) {
      // Chỉnh sửa: load dữ liệu từ API
      setFormData({
        code: promotion.code || "",
        title: promotion.title || "",
        description: promotion.description || "",
        discount_type: promotion.discount_type || "fixed",
        discount_value: promotion.discount_value || 0,
        max_uses: promotion.max_uses || 0,
        expired_at: promotion.expired_at
          ? promotion.expired_at.slice(0, 16)
          : "",
        status: promotion.status || "active",
      });
    } else {
      // Thêm mới
      setFormData({
        code: "",
        title: "",
        description: "",
        discount_type: "fixed",
        discount_value: 0,
        max_uses: 0,
        expired_at: "",
        status: "active",
      });
    }
  }, [promotion]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace("promo-", "");
    let finalValue = value;

    if (key === "max_uses" || key === "discount_value") {
      const numValue = parseFloat(value);
      finalValue = numValue >= 0 ? numValue : 0;
    }

    setFormData((prev) => ({ ...prev, [key]: finalValue }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.code || !formData.title || !formData.description) {
      alert("Vui lòng điền đầy đủ Mã, Tiêu đề và Nội dung.");
      return;
    }

    if (formData.discount_type === "percent" && formData.discount_value > 100) {
      alert("Giá trị giảm giá không được vượt quá 100% cho loại phần trăm.");
      return;
    }

    setIsLoading(true);

    try {
      // Chuẩn bị dữ liệu gửi lên API
      const dataToSend = {
        ...formData,
        expired_at: formData.expired_at || null,
        max_uses: formData.max_uses || null,
      };

      await onSave(dataToSend, promotion?.promotion_id);
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const title = promotion ? "Chỉnh sửa Ưu đãi" : "Thêm Ưu đãi Mới";

  return (
    <div
      id="promo-edit-modal"
      className={`app-modal-overlay ${isVisible ? "is-active" : ""}`}
    >
      <div
        className={`bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">
          {title}
        </h3>

        <form className="space-y-4">
          {/* Mã Promotion */}
          <div>
            <label
              htmlFor="promo-code"
              className="block text-sm font-medium text-gray-700"
            >
              Mã Ưu đãi (*)
            </label>
            <input
              type="text"
              id="promo-code"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.code}
              onChange={handleChange}
              disabled={promotion} // Không cho sửa code khi đang edit
              placeholder="VD: SUMMER2024"
            />
          </div>

          {/* Tiêu đề */}
          <div>
            <label
              htmlFor="promo-title"
              className="block text-sm font-medium text-gray-700"
            >
              Tiêu đề (*)
            </label>
            <input
              type="text"
              id="promo-title"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Giảm giá mùa hè"
            />
          </div>

          {/* Nội dung */}
          <div>
            <label
              htmlFor="promo-description"
              className="block text-sm font-medium text-gray-700"
            >
              Nội dung chi tiết (*)
            </label>
            <textarea
              id="promo-description"
              rows="4"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về ưu đãi..."
            ></textarea>
          </div>

          {/* Loại giảm giá và Giá trị */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="promo-discount_type"
                className="block text-sm font-medium text-gray-700"
              >
                Loại giảm giá (*)
              </label>
              <select
                id="promo-discount_type"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={formData.discount_type}
                onChange={handleChange}
              >
                <option value="fixed">Số tiền cố định (VNĐ)</option>
                <option value="percent">Phần trăm (%)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="promo-discount_value"
                className="block text-sm font-medium text-gray-700"
              >
                Giá trị giảm (*)
              </label>
              <input
                type="number"
                id="promo-discount_value"
                min="0"
                step="0.01"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.discount_value}
                onChange={handleChange}
                placeholder={
                  formData.discount_type === "percent" ? "0-100" : "Số tiền"
                }
              />
            </div>
          </div>

          {/* Ngày hết hạn và Giới hạn sử dụng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="promo-expired_at"
                className="block text-sm font-medium text-red-600"
              >
                Ngày và Giờ Hết hạn
              </label>
              <input
                type="datetime-local"
                id="promo-expired_at"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.expired_at}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Để trống nếu không có thời hạn
              </p>
            </div>
            <div>
              <label
                htmlFor="promo-max_uses"
                className="block text-sm font-medium text-gray-700"
              >
                Giới hạn Lượt Dùng
              </label>
              <input
                type="number"
                id="promo-max_uses"
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.max_uses}
                onChange={handleChange}
                placeholder="0 = Không giới hạn"
              />
              <p className="mt-1 text-xs text-gray-500">
                Đặt 0 nếu không muốn giới hạn
              </p>
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label
              htmlFor="promo-status"
              className="block text-sm font-medium text-gray-700"
            >
              Trạng thái (*)
            </label>
            <select
              id="promo-status"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Kích hoạt</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
          </div>
        </form>

        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150"
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition duration-150 shadow-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Đang lưu..." : "Lưu Ưu đãi"}
          </button>
        </div>
      </div>
    </div>
  );
};

// === COMPONENT MODAL CHỌN MÓN ĂN NỔI BẬT ===
const DishSelectorModal = ({
  isVisible,
  onClose,
  dishList,
  onSave,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localDishList, setLocalDishList] = useState(dishList);

  useEffect(() => {
    if (isVisible) {
      setLocalDishList(dishList);
      setSearchTerm("");
    }
  }, [isVisible, dishList]);

  const toggleFeaturedDish = (dishId) => {
    setLocalDishList((prevList) => {
      const newList = prevList.map((dish) => {
        if (dish.menu_item_id === dishId) {
          const currentFeaturedCount = prevList.filter(
            (d) => d.is_featured
          ).length;

          if (dish.is_featured) {
            return { ...dish, is_featured: false };
          } else if (currentFeaturedCount < 3) {
            return { ...dish, is_featured: true };
          } else {
            alert("Chỉ được chọn tối đa 3 món ăn nổi bật.");
            return dish;
          }
        }
        return dish;
      });
      return newList;
    });
  };

  const handleSave = () => {
    const featuredCount = localDishList.filter((d) => d.is_featured).length;

    console.log(
      "Món được chọn:",
      localDishList.filter((d) => d.is_featured)
    ); // ← THÊM

    if (featuredCount === 0) {
      alert("Vui lòng chọn ít nhất 1 món ăn nổi bật.");
      return;
    }
    onSave(localDishList);
  };

  const filteredDishes = localDishList.filter(
    (dish) =>
      dish.menu_item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.menu_item_id.toString().includes(searchTerm)
  );

  const selectedCount = localDishList.filter((d) => d.is_featured).length;

  return (
    <div
      id="dish-selector-modal"
      className={`app-modal-overlay ${isVisible ? "is-active" : ""}`}
    >
      <div
        className={`bg-white p-6 rounded-xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">
          Chọn Món Ăn Nổi bật (Tối đa 3)
        </h3>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 h-96 overflow-y-auto border p-3 rounded-lg bg-gray-50">
          {filteredDishes.map((dish) => {
            const isSelected = dish.is_featured;
            const cardClass = isSelected
              ? "bg-green-100 border-2 border-green-500"
              : "bg-gray-50 border-2 border-transparent hover:bg-gray-100";
            const checkIcon = isSelected ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 absolute top-2 right-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : null;

            return (
              <div
                key={dish.menu_item_id}
                className={`relative p-3 rounded-lg shadow-sm cursor-pointer ${cardClass}`}
                onClick={() => toggleFeaturedDish(dish.menu_item_id)}
              >
                {checkIcon}
                <h4 className="font-bold text-base">{dish.menu_item_name}</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {formatCurrency(dish.price)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            Đã chọn:{" "}
            <span className="font-bold text-indigo-600">{selectedCount}</span>/3
          </p>
          <div className="space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition duration-150 shadow-md"
            >
              {isLoading ? ( // ← THÊM
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang lưu...
                </span>
              ) : (
                "Lưu Món nổi bật"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// === COMPONENT CHÍNH ===
export default function QuanLyTrangThongTin() {
  const [activeView, setActiveView] = useState("settings");
  const [activeTab, setActiveTab] = useState("promotions");

  // State cho Promotions
  const [promotions, setPromotions] = useState([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(false);
  const [promoTimestamps, setPromoTimestamps] = useState({});
  const [dishTimestamps, setDishTimestamps] = useState({});
  const [promoSearchTerm, setPromoSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });

  // State cho Modals
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [isDishSelectorModalOpen, setIsDishSelectorModalOpen] = useState(false);

  // State cho Featured Dishes
  const [dishList, setDishList] = useState([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState(false);
  const [isSavingFeatured, setIsSavingFeatured] = useState(false);

  // === API FUNCTIONS ===

  // Fetch Promotions từ API
  const fetchPromotions = async (page = 1, search = "") => {
    setIsLoadingPromotions(true);
    try {
      const params = new URLSearchParams({
        page: page,
        per_page: pagination.per_page,
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`${API_BASE_URL}/promotions?${params}`);
      const result = await response.json();

      if (result.success) {
        setPromotions(result.data);
        setPagination({
          current_page: result.pagination.current_page,
          per_page: result.pagination.per_page,
          total: result.pagination.total,
          last_page: result.pagination.last_page,
        });
        // ✅ THÊM: Lưu timestamps
        const timestamps = {};
        result.data.forEach((promo) => {
          timestamps[promo.promotion_id] = promo.updated_at;
        });
        setPromoTimestamps(timestamps);
      } else {
        alert("Không thể tải danh sách ưu đãi");
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      alert("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setIsLoadingPromotions(false);
    }
  };

  // Load promotions khi component mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Fetch Dishes từ API
  const fetchDishes = async () => {
    setIsLoadingDishes(true);
    try {
      const response = await fetch(`${API_URL}`);
      const result = await response.json();

      console.log("Dishes từ API:", result.data);

      if (result.status === "success") {
        setDishList(result.data);
        const timestamps = {};
        result.data.forEach((dish) => {
          timestamps[dish.menu_item_id] = dish.updated_at;
        });
        setDishTimestamps(timestamps);
      } else {
        alert("Không thể tải danh sách món ăn");
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      alert("Có lỗi xảy ra khi tải món ăn");
    } finally {
      setIsLoadingDishes(false);
    }
  };

  // Load dishes khi component mount
  useEffect(() => {
    fetchDishes();
  }, []);

  // Search promotions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPromotions(1, promoSearchTerm);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [promoSearchTerm]);

  // === PROMOTION HANDLERS ===

  const openPromoModal = useCallback((promotion = null) => {
    setEditingPromotion(promotion);
    setIsPromoModalOpen(true);
  }, []);

  const closePromoModal = useCallback(() => {
    setIsPromoModalOpen(false);
    setEditingPromotion(null);
  }, []);

  const handleAddPromotion = () => {
    openPromoModal(null);
  };

  const handleEditPromotion = (promo) => {
    openPromoModal(promo);
  };

  const savePromotion = async (formData, promotionId) => {
    try {
      let response;

      if (promotionId) {
        const dataToSend = { ...formData };
        if (promoTimestamps[promotionId]) {
          dataToSend.updated_at = promoTimestamps[promotionId];
        }
        // Update existing promotion
        response = await fetch(`${API_BASE_URL}/promotions/${promotionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
      } else {
        // Create new promotion
        response = await fetch(`${API_BASE_URL}/promotions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      const result = await response.json();
      if (response.status === 404) {
        alert("⚠️ Ưu đãi không tồn tại (có thể đã bị xóa). Tải lại danh sách!");
        closePromoModal();
        fetchPromotions(pagination.current_page, promoSearchTerm);
        return;
      }

      // ✅ TC-001: Xử lý 409 (Conflict)
      if (response.status === 409) {
        if (
          window.confirm(
            `⚠️ ${result.message}\n\n` +
              `Dữ liệu hiện tại:\n` +
              `- Tiêu đề: ${result.current_data?.title}\n` +
              `- Giá trị: ${result.current_data?.discount_value}\n\n` +
              `Bạn có muốn tải lại dữ liệu mới nhất không?`
          )
        ) {
          closePromoModal();
          fetchPromotions(pagination.current_page, promoSearchTerm);
        }
        return;
      }

      if (result.success) {
        alert(result.message);
        closePromoModal();
        fetchPromotions(pagination.current_page, promoSearchTerm);
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join("\n");
          alert(`Lỗi validation:\n${errorMessages}`);
        } else {
          alert(result.message || "Có lỗi xảy ra");
        }
      }
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("Có lỗi xảy ra khi lưu ưu đãi");
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ưu đãi này không?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/promotions/${promotionId}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();

        if (result.success) {
          alert(result.message);
          fetchPromotions(pagination.current_page, promoSearchTerm);
        } else {
          alert(result.message || "Không thể xóa ưu đãi");
        }
      } catch (error) {
        console.error("Error deleting promotion:", error);
        alert("Có lỗi xảy ra khi xóa ưu đãi");
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchPromotions(newPage, promoSearchTerm);
  };

  // === FEATURED DISHES HANDLERS ===

  const openDishSelectorModal = () => {
    setIsDishSelectorModalOpen(true);
  };

  const closeDishSelectorModal = () => {
    setIsDishSelectorModalOpen(false);
  };

  const saveFeaturedDishes = async (updatedDishList) => {
    setIsSavingFeatured(true);
    try {
      const featuredDishes = updatedDishList.filter((d) => d.is_featured);
      const featuredIds = featuredDishes.map((d) => d.menu_item_id);

      console.log("🚀 Bắt đầu cập nhật món nổi bật...");
      console.log("Món được chọn:", featuredIds);

      // ✅ CHỈ CẬP NHẬT NHỮNG MÓN CÓ THAY ĐỔI
      const updatedDishes = [];
      const updatePromises = dishList.map(async (dish) => {
        const shouldBeFeatured = featuredIds.includes(dish.menu_item_id);
        const currentlyFeatured =
          dish.is_featured == 1 || dish.is_featured === true;

        // Bỏ qua nếu trạng thái không thay đổi
        if (shouldBeFeatured === currentlyFeatured) {
          console.log(`⏭️ Bỏ qua món ${dish.menu_item_id} (không đổi)`);
          return { success: true, skipped: true };
        }

        // Cập nhật món có thay đổi
        const payload = {
          is_featured: shouldBeFeatured ? 1 : 0,
          updated_at: dishTimestamps[dish.menu_item_id] || dish.updated_at,
        };

        console.log(`📤 Cập nhật món ${dish.menu_item_id}:`, payload);

        const response = await fetch(`${API_URL}/${dish.menu_item_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        // Xử lý lỗi
        if (response.status === 409) {
          console.error(`⚠️ Conflict món ${dish.menu_item_id}`);
          throw new Error(
            `Món "${dish.menu_item_name}" đã bị thay đổi bởi người khác. Vui lòng thử lại!`
          );
        }
        if (response.status === 404) {
          throw new Error(
            `Món "${dish.menu_item_name}" không tồn tại (có thể đã bị xóa).`
          );
        }
        if (!response.ok) {
          throw new Error(
            `Lỗi khi cập nhật món ${dish.menu_item_name}: ${
              result.message || "Unknown error"
            }`
          );
        }

        console.log(`✅ Thành công món ${dish.menu_item_id}`);

        // Lưu dish đã update để cập nhật local state
        if (result.data) {
          updatedDishes.push(result.data);
        }

        return { success: true, data: result.data };
      });

      // Đợi tất cả requests hoàn thành
      await Promise.all(updatePromises);

      console.log("✅ Hoàn thành cập nhật món nổi bật");

      // ✅ CẬP NHẬT LOCAL STATE THAY VÌ GỌI API LẠI
      setDishList((prevList) => {
        const updatedMap = new Map(
          updatedDishes.map((d) => [d.menu_item_id, d])
        );
        return prevList.map(
          (dish) => updatedMap.get(dish.menu_item_id) || dish
        );
      });

      // ✅ CẬP NHẬT TIMESTAMPS
      const newTimestamps = {};
      updatedDishes.forEach((dish) => {
        if (dish.updated_at) {
          newTimestamps[dish.menu_item_id] = dish.updated_at;
        }
      });
      setDishTimestamps((prev) => ({ ...prev, ...newTimestamps }));

      alert(`Đã lưu ${featuredDishes.length} món ăn làm nổi bật thành công!`);
      closeDishSelectorModal();
    } catch (error) {
      console.error("❌ Error updating featured dishes:", error);
      alert(error.message || "Có lỗi xảy ra khi cập nhật món nổi bật");

      // ✅ CHỈ RELOAD KHI CÓ LỖI
      await fetchDishes();
    } finally {
      setIsSavingFeatured(false);
    }
  };
  const featuredDishes = React.useMemo(() => {
    const filtered = dishList.filter(
      (dish) => dish.is_featured == 1 || dish.is_featured === true
    );
    console.log("Featured dishes:", filtered);
    return filtered;
  }, [dishList]);

  const changeContentTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="dish-layout">
      <Sidebar />
      <div className="dish-main">
        {activeView === "settings" && (
          <div id="settings-view" className="content-wrapper">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              Quản Lý Trang Thông Tin Nhà Hàng
            </h1>

            {/* Tab Navigation */}
            <div className="flex space-x-6 border-b border-gray-200 mb-6">
              <button
                onClick={() => changeContentTab("promotions")}
                className={`py-2 px-1 text-lg text-gray-500 hover:text-indigo-600 transition duration-150 ${
                  activeTab === "promotions" ? "tab-active" : ""
                }`}
              >
                Quản lý Ưu đãi
              </button>
              <button
                onClick={() => changeContentTab("featured")}
                className={`py-2 px-1 text-lg text-gray-500 hover:text-indigo-600 transition duration-150 ${
                  activeTab === "featured" ? "tab-active" : ""
                }`}
              >
                Món ăn Nổi bật
              </button>
              <button
                onClick={() => changeContentTab("basic")}
                className={`py-2 px-1 text-lg text-gray-500 hover:text-indigo-600 transition duration-150 ${
                  activeTab === "basic" ? "tab-active" : ""
                }`}
              >
                Thông tin cơ bản
              </button>
            </div>

            {/* Tab Content: Quản lý Ưu đãi */}
            {activeTab === "promotions" && (
              <div id="promotions-tab" className="content-tab">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã hoặc tiêu đề"
                    className="w-1/3 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={promoSearchTerm}
                    onChange={(e) => setPromoSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={handleAddPromotion}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Thêm Ưu đãi mới</span>
                  </button>
                </div>

                {/* Bảng Promotions */}
                <div className="table-scroll-container">
                  {isLoadingPromotions ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Đang tải...</p>
                    </div>
                  ) : promotions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Không có ưu đãi nào</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tiêu đề
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại / Giá trị
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Đã dùng / Giới hạn
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hết hạn
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {promotions.map((promo) => {
                          const remaining =
                            promo.max_uses === null || promo.max_uses === 0
                              ? "∞"
                              : promo.max_uses - promo.used_count;
                          const usageDisplay =
                            promo.max_uses === null || promo.max_uses === 0
                              ? `${promo.used_count} / ∞`
                              : `${promo.used_count} / ${promo.max_uses}`;

                          const expiryDateTime = promo.expired_at
                            ? new Date(promo.expired_at)
                            : null;
                          const formattedExpiryDate = expiryDateTime
                            ? expiryDateTime.toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Không giới hạn";

                          const discountDisplay =
                            promo.discount_type === "percent"
                              ? `${promo.discount_value}%`
                              : formatCurrency(promo.discount_value);

                          return (
                            <tr key={promo.promotion_id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {promo.code}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {promo.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="font-semibold text-indigo-600">
                                  {discountDisplay}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {promo.discount_type === "percent"
                                    ? "Phần trăm"
                                    : "Cố định"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                <div className="font-medium text-gray-700">
                                  {usageDisplay}
                                </div>
                                <div
                                  className={`text-xs font-bold mt-1 ${
                                    remaining === "∞"
                                      ? "text-indigo-500"
                                      : remaining <= 5
                                      ? "text-red-500"
                                      : "text-green-500"
                                  }`}
                                >
                                  Còn: {remaining}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                {formattedExpiryDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    promo.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {promo.status === "active"
                                    ? "Kích hoạt"
                                    : "Tạm ngưng"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button
                                  onClick={() => handleEditPromotion(promo)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Sửa"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.111 10.155L5.793 17.207l1.414 1.414 4.685-4.685a2 2 0 00-2.828-2.828z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeletePromotion(promo.promotion_id)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                  title="Xóa"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
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
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                {!isLoadingPromotions && promotions.length > 0 && (
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-700">
                      Hiển thị{" "}
                      {(pagination.current_page - 1) * pagination.per_page + 1}{" "}
                      -{" "}
                      {Math.min(
                        pagination.current_page * pagination.per_page,
                        pagination.total
                      )}{" "}
                      trong tổng số {pagination.total} ưu đãi
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.current_page - 1)
                        }
                        disabled={pagination.current_page === 1}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        Trước
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700">
                        Trang {pagination.current_page} / {pagination.last_page}
                      </span>
                      <button
                        onClick={() =>
                          handlePageChange(pagination.current_page + 1)
                        }
                        disabled={
                          pagination.current_page === pagination.last_page
                        }
                        className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Món ăn Nổi bật */}
            {activeTab === "featured" && (
              <div id="featured-tab" className="content-tab flex-grow p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Chọn Món Ăn Nổi bật (Hiển thị 3 món trên Trang chủ)
                </h3>
                <div
                  id="featured-dishes-container"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {featuredDishes.length === 0 ? (
                    <p className="col-span-3 text-center text-gray-500 italic py-6">
                      Chưa có món ăn nổi bật nào được chọn.
                    </p>
                  ) : (
                    featuredDishes.map((dish) => (
                      <div
                        key={dish.menu_item_id}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-indigo-500"
                      >
                        <h4 className="font-bold text-lg text-gray-800">
                          {dish.menu_item_name}
                        </h4>
                        <p className="text-sm text-indigo-600 font-semibold">
                          {formatCurrency(dish.price)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Mã: {dish.menu_item_id} | Danh mục:{" "}
                          {dish.category?.category_name || "N/A"}
                        </p>
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

            {/* Tab Content: Thông tin cơ bản */}
            {activeTab === "basic" && (
              <div id="basic-tab" className="content-tab flex-grow p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Cập nhật Thông tin Nhà hàng
                </h3>
                <form className="space-y-4 max-w-lg">
                  <div>
                    <label
                      htmlFor="restaurant-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tên Nhà hàng
                    </label>
                    <input
                      type="text"
                      id="restaurant-name"
                      defaultValue="Sunset Restaurant"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="restaurant-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="restaurant-address"
                      defaultValue="123 Đường Lãng Mạn, TP.HCM"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="restaurant-phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="restaurant-phone"
                      defaultValue="(028) 1234 5678"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Đã lưu thông tin cơ bản.")}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150"
                  >
                    Lưu Thông tin
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeView !== "settings" && (
          <div className="p-6 text-gray-500">Nội dung cho view khác</div>
        )}
      </div>

      {/* Modal Thêm/Sửa Promotion */}
      <PromoEditModal
        isVisible={isPromoModalOpen}
        onClose={closePromoModal}
        onSave={savePromotion}
        promotion={editingPromotion}
      />

      {/* Modal Chọn Món Ăn Nổi bật */}
      <DishSelectorModal
        isVisible={isDishSelectorModalOpen}
        onClose={closeDishSelectorModal}
        dishList={dishList}
        onSave={saveFeaturedDishes}
        isLoading={isSavingFeatured}
      />
    </div>
  );
}
