import React, { useState, useEffect } from "react";

export default function CategoryModal({
  isVisible,
  onClose,
  onSave,
  category,
}) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    isHidden: false,
    updatedAt: null,
  });
  
  // ⭐ BỔ SUNG: State để quản lý việc đang lưu
  const [isSaving, setIsSaving] = useState(false); 

  useEffect(() => {
    if (category) {
      // Chế độ Sửa
      setFormData({
        ...category,
        // LẤY updated_at
        updatedAt: category.updated_at || null,
      });
    } else {
      // Chế độ Thêm mới
      setFormData({
        id: "",
        name: "",
        slug: "",
        isHidden: false,
        updatedAt: null,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [id.replace("cat-", "")]: finalValue,
    }));
  };

  // ⭐ CẬP NHẬT: Hàm handleSubmit phải là async và sử dụng isSaving
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⭐ BƯỚC 1: NGĂN NGỪA DOUBLE SUBMISSION
    if (isSaving) return; 

    if (!formData.name || !formData.slug) {
      alert("Vui lòng điền đầy đủ Tên danh mục và Slug.");
      return;
    }

    try {
        // ⭐ BƯỚC 2: BẮT ĐẦU LƯU & VÔ HIỆU HÓA NÚT
        setIsSaving(true); 
        await onSave(formData); // CHỜ (await) API call hoàn tất ở CategoryManager
        // Sau khi onSave thành công, CategoryManager sẽ gọi setIsModalOpen(false)
        
    } catch (error) {
        // Lỗi đã được xử lý ở CategoryManager, không cần xử lý thêm ở đây
        console.error("Lỗi khi gọi onSave từ CategoryModal:", error);
    } finally {
        // ⭐ BƯỚC 3: BẬT LẠI NÚT DÙ THÀNH CÔNG HAY THẤT BẠI
        // (Nếu thành công, modal sẽ đóng, isSaving sẽ tự reset khi modal mở lại)
        setIsSaving(false); 
    }
  };

  const title = category ? "Chỉnh sửa Danh mục" : "Thêm Danh mục Mới";

  if (!isVisible) return null;

  return (
    <div id="category-edit-modal" className="modal is-active">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">{title}</h4>
          <span className="modal-close" onClick={onClose}>
            &times;
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Tên Danh mục */}
          <div>
            <label
              htmlFor="cat-name"
              className="block text-sm font-medium text-gray-700"
            >
              Tên Danh mục (*)
            </label>
            <input
              type="text"
              id="cat-name"
              required
              className="modal-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="cat-slug"
              className="block text-sm font-medium text-gray-700"
            >
              Slug (Đường dẫn thân thiện) (*)
            </label>
            <input
              type="text"
              id="cat-slug"
              required
              className="modal-input"
              value={formData.slug}
              onChange={handleChange}
            />
          </div>

          {/* Ẩn/Hiện */}
          <div className="flex items-center">
            <input
              id="cat-isHidden"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={formData.isHidden}
              onChange={handleChange}
            />
            <label
              htmlFor="cat-isHidden"
              className="ml-2 block text-sm text-gray-900"
            >
              Ẩn danh mục này trên trang người dùng
            </label>
          </div>

          {/* Nút Thao tác */}
          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="category-button-secondary"
              disabled={isSaving} // Vô hiệu hóa khi đang lưu
            >
              Hủy
            </button>
            
            {/* ⭐ CẬP NHẬT: Thêm disabled và Loading UI */}
            <button 
                type="submit" 
                className="category-button-primary"
                disabled={isSaving} // Vô hiệu hóa nút Lưu
            >
              {isSaving ? (
                <>
                  Đang Lưu...
                  {/* Loading Spinner */}
                  <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </span>
                </>
              ) : (
                "Lưu Danh mục"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}