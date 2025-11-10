// src/components/DishModal.jsx

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; // Import CSS cho Editor
import React, { useState, useEffect } from "react";
// === IMPORT THƯ VIỆN DRAFT.JS VÀ EDITOR ===
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// ==========================================

// Status map
const statusMap = {
    active: "Còn hàng",
    inactive: "Hết hàng",
    draft: "Nháp/Ẩn",
};

export default function DishModal({
    isVisible,
    onClose,
    onSave,
    dish,
    categories,
}) {
    // Khởi tạo state form cơ bản (Lưu ý: description giữ nguyên là string để lưu JSON)
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        price: 0,
        categoryKey: "",
        statusKey: "active",
        description: "", // Sẽ lưu chuỗi JSON từ Draft.js
        image: "", 
    });

    // === STATE DÙNG RIÊNG CHO EDITOR (Draft.js EditorState) ===
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    // ==========================================================
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const isEditMode = !!dish;
    const title = isEditMode ? "Chỉnh Sửa Món Ăn" : "Thêm Món Ăn Mới";

    useEffect(() => {
        if (dish) {
            setFormData(dish);
            setImagePreview(dish.image); 
            
            // Xử lý nạp dữ liệu description (dạng JSON string) vào EditorState
            if (dish.description) {
                try {
                    // Chuyển JSON string thành RawContentState object
                    const rawContentState = JSON.parse(dish.description); 
                    // Chuyển RawContentState object thành ContentState
                    const contentState = convertFromRaw(rawContentState); 
                    // Tạo EditorState từ ContentState
                    setEditorState(EditorState.createWithContent(contentState));
                } catch (e) {
                    // Nếu description không phải JSON hợp lệ (ví dụ: dữ liệu cũ là HTML thuần), tạo EditorState rỗng
                    console.error("Lỗi khi tải description cũ:", e);
                    setEditorState(EditorState.createEmpty()); 
                }
            } else {
                setEditorState(EditorState.createEmpty());
            }

        } else {
            // Thiết lập giá trị mặc định cho mode Thêm mới
            const defaultCategory =
                categories && categories.length > 0
                    ? String(categories[0].category_id)
                    : "";
            setFormData({
                id: "",
                name: "",
                price: 0,
                categoryKey: defaultCategory,
                statusKey: "active",
                description: "",
                image: "",
            });
            setImageFile(null);
            setImagePreview(null);
            setEditorState(EditorState.createEmpty()); // Reset Editor
        }
    }, [dish, categories]);

    const handleChange = (e) => {
        const { id, value, type, files } = e.target;
        
        if (type === "file" && files.length > 0) {
            const file = files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            let finalValue = value;
            if (id === "price") {
                finalValue = parseInt(value) >= 0 ? parseInt(value) : 0;
            }
            setFormData((prev) => ({
                ...prev,
                [id]: finalValue,
            }));
        }
    };
    
    // === HÀM XỬ LÝ RIÊNG CHO DRAFT-JS ===
    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
        
        // Chuyển đổi nội dung EditorState sang RawContentState JSON
        const rawContentState = convertToRaw(newEditorState.getCurrentContent());
        // Chuyển RawContentState thành chuỗi JSON để lưu trữ an toàn trong DB
        const jsonString = JSON.stringify(rawContentState);

        // Cập nhật formData.description bằng chuỗi JSON
        setFormData((prev) => ({
            ...prev,
            description: jsonString 
        }));
    };
    // =======================================

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate cơ bản
        if (!formData.name || formData.price <= 0) {
            alert("Vui lòng nhập tên món và giá hợp lệ.");
            return;
        }
        if (!isEditMode && !imageFile && !formData.image) {
            alert("Vui lòng chọn hình ảnh cho món ăn.");
            return;
        }

        // TẠO FORM DATA để gửi multipart/form-data
        const data = new FormData();

        // Thêm trường cơ bản
        data.append("menu_item_name", formData.name);
        data.append("category_id", formData.categoryKey);
        // === GỬI NỘI DUNG DƯỚI DẠNG CHUỖI JSON ===
        data.append("description", formData.description || "{}"); 
        // ===========================================
        data.append("price", formData.price);
        data.append("status", formData.statusKey);

        if (isEditMode) {
            data.append("_method", "PUT");
        }

        if (imageFile) {
            data.append("image_file", imageFile);
        } 

        onSave(data, isEditMode ? formData.id : null);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-2xl transform transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                    {title}
                </h3>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* ID */}
                    {isEditMode && (
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-gray-600">ID Món ăn</label>
                            <input type="text" id="id" className="dish-modal-input-readonly" value={dish.id} readOnly/>
                        </div>
                    )}

                    {/* Tên & Giá */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Tên Món ăn (*)</label>
                            <input type="text" id="name" required className="dish-modal-input" value={formData.name} onChange={handleChange} placeholder="Phở Bò, Lẩu Gà..."/>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-600">Giá Bán (VNĐ) (*)</label>
                            <input type="number" id="price" required min="1000" className="dish-modal-input" value={formData.price} onChange={handleChange} placeholder="50000"/>
                        </div>
                    </div>

                    {/* Danh mục & Trạng thái */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="categoryKey" className="block text-sm font-medium text-gray-600">Danh Mục (*)</label>
                            <select id="categoryKey" required className="dish-modal-input" value={formData.categoryKey} onChange={handleChange}>
                                {categories.map((cat) => (
                                    <option key={cat.category_id} value={String(cat.category_id)}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="statusKey" className="block text-sm font-medium text-gray-600">Trạng Thái (*)</label>
                            <select id="statusKey" required className="dish-modal-input" value={formData.statusKey} onChange={handleChange}>
                                {Object.entries(statusMap).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* TRƯỜNG INPUT FILE */}
                    <div>
                        <label htmlFor="imageFile" className="block text-sm font-medium text-gray-600">Hình ảnh Món ăn {isEditMode ? "(Thay đổi ảnh mới)" : "(*)"}</label>
                        <input type="file" id="imageFile" name="imageFile" accept="image/*" {...(!isEditMode && { required: !dish?.image })} className="dish-modal-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" onChange={handleChange}/>
                        {(imagePreview || dish?.image) && ( 
                            <div className="mt-2 text-xs text-gray-500 flex items-center">
                                Preview:
                                <img src={imagePreview || dish?.image} alt="Preview" className="h-16 w-16 object-cover rounded ml-2 border" onError={(e) => (e.target.src ="https://placehold.co/64x64/e5e7eb/4b5563?text=N/A")}/>
                            </div>
                        )}
                    </div>

                    {/* === EDITOR MỚI: REACT-DRAFT-WYSIWYG === */}
                    <div className="border border-gray-300 rounded-lg p-2 min-h-[250px] focus-within:border-emerald-500">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Mô Tả Chi Tiết (Rich Text Editor)</label>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={onEditorStateChange}
                            wrapperClassName="wrapper-class"
                            editorClassName="editor-class h-48 px-2"
                            toolbarClassName="toolbar-class border-b border-gray-200 mb-2"
                            placeholder="Món ăn này có hương vị..."
                            toolbar={{
                                options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'image', 'history'],
                                inline: { inDropdown: false, options: ['bold', 'italic', 'underline', 'strikethrough'] },
                            }}
                        />
                    </div>
                    {/* ============================================= */}

                    {/* Nút Thao tác */}
                    <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="dish-button-secondary">Hủy</button>
                        <button type="submit" className="dish-button-primary">{isEditMode ? "Cập Nhật Món Ăn" : "Thêm Món Ăn"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}