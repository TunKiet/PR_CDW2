// src/components/Sidebar.jsx
import React from 'react';
// 1. IMPORT Link và useLocation từ react-router-dom
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, BarChart2, FileText, Calendar, ShoppingCart, Menu, Zap, User, Users, Settings, Building } from "lucide-react";

const Sidebar = () => {
  // Hook để lấy đường dẫn hiện tại
  const location = useLocation();

  // 2. CẬP NHẬT: Thêm thuộc tính 'path' cho mỗi mục
  // Sử dụng path '/order-management' cho cả "Hóa đơn" và "Quản lý Giỏ hàng" 
  // (dựa trên yêu cầu trước đó)
  const menuItems = [
    { title: "Đơn hàng mới", icon: <ClipboardList size={20} />, path: '/order-page' },
    { title: "Thống kê", icon: <BarChart2 size={20} />, path: '/analytics' },
    { title: "Hóa đơn", icon: <FileText size={20} />, path: '/order-management' }, // Trỏ đến trang quản lý
    { title: "Đặt bàn", icon: <Calendar size={20} />, path: '/tables' },
    { title: "Quản lý giỏ hàng", icon: <ShoppingCart size={20} />, path: 'cart-management' }, // Trỏ đến trang quản lý
    { title: "Thực đơn", icon: <Menu size={20} />, path: '/menu' },
    { title: "Mặt hàng", icon: <Zap size={20} />, path: '/products' },
    { title: "Nhân viên", icon: <User size={20} />, path: '/staff' },
    { title: "Khách hàng", icon: <Users size={20} />, path: '/customers' },
    { title: "Hệ thống", icon: <Settings size={20} />, path: '/system' },
    { title: "Thiết lập nhà hàng", icon: <Building size={20} />, path: '/settings' },
  ];

  // Logic kiểm tra xem đường dẫn có đang khớp với path của item hay không
  const isActive = (path) => {
      // Dùng startsWith để highlight các đường dẫn con (nếu có)
      return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col fixed top-0 left-0">
      <div className="flex items-center p-4 border-b">
        <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
          Ad
        </div>
        <h1 className="ml-3 text-lg font-bold text-gray-800">Admin</h1>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          // 3. THAY THẺ <button> BẰNG <Link>
          <Link
            key={index}
            to={item.path || '#'} // Dùng path hoặc '#' nếu chưa có path
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition 
              ${isActive(item.path)
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
