<<<<<<< HEAD
// src/components/Sidebar.jsx (ĐÃ CẬP NHẬT để tạo hiệu ứng ĐỘNG)
import React, { useState, useEffect, useRef } from 'react'; // IMPORT useRef
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, BarChart2, FileText, Calendar, ShoppingCart, Menu, Zap, User, Users, Settings, Building, ChevronDown, ChevronUp } from "lucide-react";
=======
import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserData from '../data/UserData';
import { ClipboardList, BarChart2, FileText, Calendar, ShoppingCart, Menu, Zap, Users, Settings, Building, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import axios from 'axios';
>>>>>>> 18-kiet/RE-Role

const menuItems = [
   { title: "Đơn hàng mới", icon: <ClipboardList size={20} />, path: '/order-page' },
    { title: "Thống kê", icon: <BarChart2 size={20} />, path: '/analytics' },
    { title: "Hóa đơn", icon: <FileText size={20} />, path: '/order-management' },
    { title: "Đặt bàn", icon: <Calendar size={20} />, path: '/tables' },
    { 
      title: "Thực đơn", 
      icon: <Menu size={20} />, 
      path: '/menu-management-placeholder', 
      isParent: true,
      subItems: [
        { title: "Quản lý món ăn", path: '/dishtable' },
        { title: "Quản lý danh mục", path: '/category-manager' },
        { title: "Quản lý tình trạng món ăn", path: '/dish-status-management' },
      ] 
    },
    { title: "Quản lý đơn online", icon: <ShoppingCart size={20} />, path: '/order-online' },
    { title: "Mặt hàng", icon: <Zap size={20} />, path: '/inventory' },
    { title: "Nhân viên", icon: <User size={20} />, path: '/staff' },
    { title: "Khách hàng", icon: <Users size={20} />, path: '/customers' },
    { title: "Hệ thống", icon: <Settings size={20} />, path: '/system' },
    { title: "Thiết lập nhà hàng", icon: <Building size={20} />, path: '/restaurant-info' },
];

const Sidebar = () => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  
  // 1. Dùng useRef để tham chiếu đến nội dung menu con
  const submenuRef = useRef(null); 
  // 2. State để lưu chiều cao động (được tính bằng JS)
  const [submenuHeight, setSubmenuHeight] = useState(0); 

  // Logic kiểm tra Active
  const isActive = (path) => {
      if (!path) return false;
      return location.pathname.startsWith(path);
  };
  const isParentActive = (item) => {
    return item.subItems && item.subItems.some(sub => isActive(sub.path));
  };
  
  // Hiệu ứng side-effect khi trạng thái menu thay đổi
  useEffect(() => {
    const activeParent = menuItems.find(item => isParentActive(item));
    if (activeParent && openSubMenu !== activeParent.title) {
        setOpenSubMenu(activeParent.title);
    } 
  }, [location.pathname]);

  // 3. Logic ĐO và THIẾT LẬP CHIỀU CAO khi menu được mở hoặc đóng
  useEffect(() => {
    if (submenuRef.current && openSubMenu === 'Thực đơn') {
        // Nếu menu được mở, lấy chiều cao cuộn thực tế
        setSubmenuHeight(submenuRef.current.scrollHeight);
    } else {
        // Nếu menu đóng, đặt chiều cao về 0
        setSubmenuHeight(0);
    }
  }, [openSubMenu]); // Chạy lại khi trạng thái mở/đóng thay đổi

  const toggleSubMenu = (title) => {
    setOpenSubMenu(openSubMenu === title ? null : title);
  };

  return (
    <div className="w-64 shadow-lg border bg-white rounded-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
          Ad
        </div>
        <h1 className="ml-3 text-lg font-bold text-gray-800">Admin</h1>
      </div>

      <div className="flex-1 p-4 space-y-2  overflow-y-auto">
        {menuItems.map((item, index) => {
            const currentItemActive = isActive(item.path) && !item.isParent;
            const isParentActiveState = isParentActive(item);
            const isMenuOpen = openSubMenu === item.title;

            return (
                <div key={index}>
                    {item.isParent ? (
                        <>
                            {/* Mục cha */}
                            <button
                                onClick={() => toggleSubMenu(item.title)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition
                                    ${isParentActiveState || isMenuOpen
                                        ? "bg-indigo-100 text-indigo-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                                {isMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            
                            {/* Menu con (Sub-menu) - ÁP DỤNG HIỆU ỨNG ĐỘNG */}
                            <div 
                                // 4. Thiết lập ref và style chiều cao động
                                ref={submenuRef} 
                                style={{ maxHeight: isMenuOpen || isParentActiveState ? `${submenuHeight}px` : '0px' }}
                                // 5. Thêm class Tailwind cho Transition và ẩn overflow
                                className={`ml-5 mt-1 space-y-1 border-l border-gray-200 pl-3 
                                    overflow-hidden transition-all duration-300 ease-in-out`}
                            >
                                {item.subItems.map((sub, subIndex) => (
                                    <Link
                                        key={subIndex}
                                        to={sub.path}
                                        className={`w-full flex items-center px-3 py-2 rounded-xl text-sm transition
                                            ${isActive(sub.path)
                                                ? "bg-indigo-50 text-indigo-600 font-semibold"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span className="ml-1">{sub.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        // Mục đơn (Single Link item)
                        <Link
                            to={item.path || '#'}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition
                                ${currentItemActive
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default Sidebar;