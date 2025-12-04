import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // BỔ SUNG: Import Axios
import CategoryModal from "./CategoryModal";
import "./CategoryManager.css";
import Sidebar from "../../components/Sidebar";

// === CẤU HÌNH API ===
const API_URL = "http://127.0.0.1:8000/api/categories";

// Hàm hỗ trợ ánh xạ dữ liệu API sang React
const mapApiDataToReact = (item) => ({
  id: item.category_id,
  name: item.category_name,
  slug: item.slug,
  dishesCount: item.menu_items_count || 0, // Giả định API trả về count
  isHidden: item.is_hidden || false,
  updated_at: item.updated_at,
});

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  // =========================================================
  // 1. ĐỌC DỮ LIỆU (READ)
  // =========================================================
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      // GIẢ ĐỊNH: Laravel API /api/categories trả về danh sách
      const response = await axios.get(API_URL);
      // Ánh xạ dữ liệu nếu cần
      const mappedData = response.data.data.map(mapApiDataToReact);
      setCategories(mappedData);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi fetch danh mục:", err);
      setError("Không thể tải danh mục. Vui lòng kiểm tra Server Backend.");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSaveCategory = async (categoryData) => {
    setIsLoading(true);
    setError(null);
    const isEditMode = categoryData.id;
    const url = isEditMode ? `${API_URL}/${categoryData.id}` : API_URL;

    // ⭐ 1. CHUẨN BỊ PAYLOAD CHÍNH
    const apiData = {
      category_name: categoryData.name,
      slug: categoryData.slug,
      is_hidden: categoryData.isHidden,
    };

    let finalPayload = apiData;

    if (isEditMode) {
      // ⭐ BỔ SUNG: Dùng trường đã được đổi tên từ Modal
      if (categoryData.original_updated_at !== undefined) {
        finalPayload.original_updated_at = categoryData.original_updated_at;
      }

      finalPayload._method = "PUT";
    }

    // --- Logic cũ đã bị xóa ở đây: delete payload.updatedAt; ---
    console.log("Payload gửi đi:", finalPayload);
    console.log(
      "Check updated_at (Nên có giá trị):",
      finalPayload.original_updated_at
    );
    try {
      // 3. GỌI API
      await axios({
        method: "POST", // Dùng POST với _method=PUT
        url: url,
        data: finalPayload, // Dùng finalPayload đã được cấu hình đúng
      });

      // Thành công: Đóng modal và tải lại dữ liệu
      handleCloseModal();
      fetchCategories();
      alert(
        `Danh mục đã được ${isEditMode ? "cập nhật" : "thêm mới"} thành công!`
      );
    } catch (error) {
      // 4. XỬ LÝ LỖI (Vẫn giữ nguyên logic 409, 410 đã đúng)
      let errorMessage =
        "Đã xảy ra lỗi không xác định! (Mã lỗi: " +
        (error.response?.status || "N/A") +
        ")";

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;

        if (status === 422) {
          errorMessage =
            message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
        } else if (status === 409) {
          errorMessage =
            message || "Xung đột: Danh mục đã được người dùng khác cập nhật.";
          fetchCategories();
        } else if (status === 410) {
          errorMessage =
            message || "Danh mục này không tồn tại hoặc đã bị xóa.";
          fetchCategories();
        }
      }

      setError(errorMessage);
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // 2. THÊM / CẬP NHẬT (CREATE / UPDATE)
  // =========================================================
  // const handleSave = async (categoryData) => {
  //     try {
  //         if (categoryData.id) {
  //             // CHỈNH SỬA (UPDATE - PUT/PATCH)
  //             // Cần ánh xạ ngược dữ liệu React sang API
  //             const apiData = {
  //                 category_name: categoryData.name,
  //                 slug: categoryData.slug,
  //                 is_hidden: categoryData.isHidden,
  //             };
  //             await axios.put(`${API_URL}/${categoryData.id}`, apiData);
  //             alert(`✅ Cập nhật danh mục "${categoryData.name}" thành công!`);
  //         } else {
  //             // THÊM MỚI (CREATE - POST)
  //             const apiData = {
  //                 category_name: categoryData.name,
  //                 slug: categoryData.slug,
  //                 is_hidden: categoryData.isHidden,
  //             };
  //             await axios.post(API_URL, apiData);
  //             alert(`✅ Thêm danh mục "${categoryData.name}" thành công!`);
  //         }

  //         // Đóng modal và tải lại danh sách
  //         setIsModalOpen(false);
  //         setEditingCategory(null);
  //         fetchCategories();

  //     } catch (err) {
  //         console.error("Lỗi khi lưu danh mục:", err.response ? err.response.data : err.message);
  //         alert(`Lỗi: ${err.response?.data?.message || "Không thể lưu danh mục."}`);
  //     }
  // };

  // =========================================================
  // 3. XÓA (DELETE)
  // =========================================================
  const handleDelete = async (id, name) => {
    if (
      !window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}" không?`)
    ) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      alert(`✅ Xóa danh mục "${name}" thành công!`);
      fetchCategories(); // Tải lại danh sách sau khi xóa
    } catch (err) {
      console.error(
        "Lỗi khi xóa danh mục:",
        err.response ? err.response.data : err.message
      );
      alert(`Lỗi: ${err.response?.data?.message || "Không thể xóa danh mục."}`);
    }
  };

  // Hàm mở modal để thêm mới
  const handleAdd = () => {
    setEditingCategory(null); // Không có dữ liệu chỉnh sửa
    setIsModalOpen(true);
  };

  // Hàm mở modal để chỉnh sửa
  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // =========================================================
  // 4. HIỂN THỊ (JSX)
  // =========================================================
  return (
    <div className="dish-layout">
      <Sidebar />
      <main className="dish-main">
        <div className="dish-container p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Quản Lý Danh Mục Món Ăn
          </h2>

          {/* Thanh công cụ */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
            />
            <button
              onClick={handleAdd}
              className="dish-button-primary dish-button-base ml-4 flex items-center gap-1"
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
              Thêm Danh Mục
            </button>
          </div>

          {/* Hiển thị lỗi hoặc Loading */}
          {isLoading && (
            <div className="text-center py-4 text-emerald-600">
              Đang tải danh mục...
            </div>
          )}
          {error && (
            <div className="text-center py-4 text-red-600 border border-red-300 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Bảng Danh Mục */}
          {!isLoading && !error && (
            <div className="category-table-wrapper overflow-x-auto shadow-lg rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                      Tên Danh Mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Slug (Đường dẫn)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Số món ăn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.length > 0 ? (
                    categories.map((cat, index) => (
                      <tr
                        key={cat.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cat.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {cat.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cat.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cat.dishesCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${
                                                          cat.isHidden
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                        }`}
                          >
                            {cat.isHidden ? "Ẩn" : "Hiển thị"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Chỉnh sửa"
                          >
                            {/* Icon Edit */}
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
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                          >
                            {/* Icon Delete */}
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
                        className="category-no-data text-center py-4 text-gray-500"
                      >
                        Không tìm thấy danh mục nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        <CategoryModal
          isVisible={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCategory}
          category={editingCategory}
        />
      </main>
    </div>
  );
}
