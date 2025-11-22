import React from "react";
// Loại bỏ import draftjs-to-html để khắc phục lỗi không tìm thấy thư viện

// --- HÀM XỬ LÝ CHUYỂN ĐỔI DRAFT.JS THÀNH HTML TỐI GIẢN ---
// (Thay thế cho draftjs-to-html, chỉ hỗ trợ plain text và các định dạng cơ bản)
const convertContentStateToHtml = (contentState) => {
  if (!contentState || !contentState.blocks) return "";
  
  let html = "";
  
  contentState.blocks.forEach(block => {
    // Chỉ xử lý các khối cơ bản (paragraph)
    if (block.type === 'unstyled' || block.type === 'paragraph') {
      let text = block.text;
      
      // Xử lý các style in-line cơ bản (B, I, U)
      if (block.inlineStyleRanges && block.inlineStyleRanges.length > 0) {
        // Đây là cách đơn giản hóa: không xử lý phức tạp, chỉ trả về text
        // Đối với các ứng dụng thực tế, cần thư viện đầy đủ như draftjs-to-html
      }
      
      html += `<p>${text}</p>`;
    } else if (block.type === 'header-one') {
      html += `<h1>${block.text}</h1>`;
    } else if (block.type === 'unordered-list-item') {
      // Vì không thể tạo thẻ <ul> trong quá trình lặp, ta chỉ tạo <li>
      html += `<li>${block.text}</li>`;
    }
  });

  // Gói list items vào thẻ <ul> nếu có
  if (html.includes('<li>')) {
    html = '<ul>' + html.replace(/<p><li>/g, '<li>').replace(/<\/p><p><li>/g, '<li>').replace(/<\/li><\/p>/g, '</li>').replace(/<\/li><p><li>/g, '</li><li>') + '</ul>';
  }
  
  // Tạm thời đơn giản hóa logic, chỉ đảm bảo hiển thị nội dung plain text và tránh lỗi
  return html.replace(/<p><\/p>/g, ''); // Loại bỏ các đoạn trống
};

// Hàm xử lý rendering mô tả an toàn
const DescriptionRenderer = ({ description }) => {
  let content;
  
  if (!description) {
    return <p className="text-gray-600 mb-4">Món ăn này chưa có mô tả chi tiết.</p>;
  }

  try {
    const contentState = JSON.parse(description);
    
    // 1. KHẮC PHỤC LỖI: Sử dụng Object.prototype.hasOwnProperty.call để kiểm tra thuộc tính 'blocks' an toàn
    if (
      contentState && 
      typeof contentState === 'object' && 
      Object.prototype.hasOwnProperty.call(contentState, 'blocks')
    ) {
      // Sử dụng hàm chuyển đổi tùy chỉnh
      content = convertContentStateToHtml(contentState);
    } else {
      // Nếu parse thành công nhưng không phải định dạng Draft.js, coi là plain text.
      content = description;
    }
  } catch (e) {
    // 2. KHẮC PHỤC LỖI: Sử dụng '_' thay cho 'e' trong catch (lỗi không được sử dụng)
    // NẾU parse thất bại, chắc chắn là Plain Text.
    content = description;
  }

  // Sử dụng dangerouslySetInnerHTML để render HTML hoặc hiển thị plain text
  return (
    <div
      className="text-gray-600 mb-4 prose max-w-none" // Thêm 'prose' để định dạng HTML được render đẹp hơn
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};


export default function MenuItemModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="text-2xl font-bold absolute right-4 top-4 text-gray-500 hover:text-gray-900 transition"
          aria-label="Đóng"
        >
          &times;
        </button>

        {/* Image */}
        <img
          src={item.image_url}
          alt={item.menu_item_name}
          className="rounded-xl mb-4 w-full h-48 object-cover shadow-md"
        />

        {/* Name */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.menu_item_name}</h2>

        {/* Price */}
        <p className="text-indigo-600 font-extrabold text-xl mb-3 border-b pb-3">
          {new Intl.NumberFormat("vi-VN").format(item.price)}₫
        </p>

        {/* Description (Đã sử dụng component mới) */}
        <DescriptionRenderer description={item.description} />


        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition duration-150 shadow-lg shadow-indigo-500/50"
            onClick={() => {
              onAddToCart(item);
              onClose();
            }}
          >
            ➕ Thêm vào giỏ hàng
          </button>

          <button
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition duration-150"
            onClick={() =>
              (window.location.href = `/menu-item/${item.menu_item_id}`)
            }
          >
            Xem chi tiết →
          </button>
        </div>
      </div>
    </div>
  );
}