import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import draftToHtml from "draftjs-to-html"; 
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Hàm xử lý rendering mô tả
const DescriptionRenderer = ({ description }) => {
  let content;
  
  if (!description) {
    return <p>Món ăn đang được cập nhật mô tả đầy đủ...</p>;
  }

  try {
    // 1. CỐ GẮNG parse JSON (Dành cho Draft.js ContentState)
    const contentState = JSON.parse(description);
    
    // Kiểm tra nếu nội dung đã được parse là một đối tượng hợp lệ của Draft.js
    if (contentState && typeof contentState === 'object' && contentState.hasOwnProperty('blocks')) {
      content = draftToHtml(contentState);
    } else {
      // Nếu JSON parse thành công nhưng không phải định dạng Draft.js (ví dụ: "true"), 
      // thì coi nó là plain text.
      content = description;
    }
  } catch (error) {
    // 2. NẾU parse thất bại (Chắc chắn là Plain Text), trả về chính chuỗi đó
    content = description;
  }

  // Sử dụng dangerouslySetInnerHTML để render HTML hoặc hiển thị plain text
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};

export default function MenuItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/menu-items/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!item) return <p className="text-center mt-20">Đang tải...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img
        src={item.image_url}
        alt={item.menu_item_name}
        className="rounded-2xl w-full h-72 object-cover shadow-lg"
      />

      <h1 className="text-3xl font-bold mt-5">{item.menu_item_name}</h1>

      <p className="text-indigo-600 font-semibold text-xl mt-2">
        {new Intl.NumberFormat("vi-VN").format(item.price)}đ
      </p>

      <h2 className="text-xl font-bold mt-6">Mô tả món</h2>
      <div className="text-gray-700 mt-2">
        {/* SỬ DỤNG COMPONENT MỚI ĐỂ XỬ LÝ DỮ LIỆU AN TOÀN */}
        <DescriptionRenderer description={item.description} />
      </div>

      <h2 className="text-xl font-bold mt-6">Đánh giá khách hàng</h2>

      <div className="mt-3 space-y-4">
        {(
          item.reviews || [
            {
              user: "Nguyễn Thành",
              content: "Món ăn ngon, nêm nếm vừa miệng!",
              rating: 5,
            },
            {
              user: "Minh Phúc",
              content: "Trang trí đẹp mắt, sẽ quay lại!",
              rating: 4,
            },
          ]
        ).map((review, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-xl">
            <p className="font-semibold">{review.user}</p>
            <p className="text-yellow-500">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </p>
            <p>{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}