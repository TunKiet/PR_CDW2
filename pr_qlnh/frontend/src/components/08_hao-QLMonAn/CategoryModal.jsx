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

  useEffect(() => {
    if (category) {
      // Chế độ Sửa
      setFormData({
        ...category,
        // ⭐ LẤY updated_at
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert("Vui lòng điền đầy đủ Tên danh mục và Slug.");
      return;
    }
    const isEditMode = category && category.id;
    // 2. Chuẩn bị dữ liệu gửi đi
    const dataToSend = { ...formData };

    // ⭐ QUAN TRỌNG: Chỉ thêm trường kiểm tra xung đột khi đang ở chế độ SỬA
    if (isEditMode) {
      const originalTimestamp = category.updated_at || formData.updatedAt;
      if (originalTimestamp) {
        // 2. Đổi tên thành original_updated_at cho Backend
        dataToSend.original_updated_at = originalTimestamp;
      } else {
        // Trường hợp KHẨN CẤP: Nếu vẫn không có, gửi "" để tránh lỗi 'required'
        // (Mặc dù sẽ dẫn đến 409, nhưng ít nhất cho phép test các trường khác)
        dataToSend.original_updated_at = "";
        console.error(
          "Lỗi nghiêm trọng: updated_at bị thiếu. Gửi chuỗi rỗng để tránh lỗi 422."
        );
      }
      // 2. Xóa trường updatedAt cũ để tránh dư thừa và gửi sai
      delete dataToSend.updatedAt;
    }
    onSave(dataToSend);
  };

  const title = category ? "Chỉnh sửa Danh mục" : "Thêm Danh mục Mới";

  if (!isVisible) return null;

  return (
    <div id="category-edit-modal" className="modal is-active">
      <div className="modal-content" id="cat-modal-content">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">
          {title}
        </h3>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {formData.id && (
            <div>
              <label
                htmlFor="cat-id"
                className="block text-sm font-medium text-gray-700"
              >
                ID Danh mục
              </label>
              <input
                type="text"
                id="cat-id"
                className="modal-input-readonly"
                value={formData.id}
                readOnly
              />
            </div>
          )}

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

          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="category-button-secondary"
            >
              Hủy
            </button>
            <button type="submit" className="category-button-primary">
              Lưu Danh mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
