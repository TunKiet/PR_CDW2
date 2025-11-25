// src/components/Sidebar.jsx
import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, BarChart2, FileText, Calendar, ShoppingCart, Menu, Zap, Users, Settings, Building, ChevronDown, ChevronUp } from "lucide-react";

const menuItems = [
  { title: "Đơn hàng mới", icon: <ClipboardList size={20} />, path: '/order-page' },
  { title: "Thống kê", icon: <BarChart2 size={20} />, path: '/analytics' },
  { title: "Hóa đơn", icon: <FileText size={20} />, path: '/order-management' },
  { title: "Đặt bàn", icon: <Calendar size={20} />, path: '/tables' },

  {
    title: "Thực đơn",
    icon: <Menu size={20} />,
    isParent: true,
    subItems: [
      { title: "Quản lý món ăn", path: '/dishtable' },
      { title: "Quản lý danh mục", path: '/category-manager' },
      { title: "Quản lý tình trạng món ăn", path: '/dish-status-management' },
    ]
  },

  {
    title: "Người dùng",
    icon: <Users size={20} />,
    isParent: true,
    subItems: [
      { title: "Nhân viên", path: '/user-management' },
      { title: "Khách hàng", path: '/customers' },
    ]
  },

  { title: "Quản lý đơn online", icon: <ShoppingCart size={20} />, path: '/order-online' },
  { title: "Mặt hàng", icon: <Zap size={20} />, path: '/inventory' },
  { title: "Hệ thống", icon: <Settings size={20} />, path: '/system' },
  { title: "Thiết lập nhà hàng", icon: <Building size={20} />, path: '/restaurant-info' },
];

const Sidebar = () => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState(null);

  // ref chứa submenu theo từng title
  const submenuRefs = useRef({});

  const isActive = (path) => location.pathname.startsWith(path);
  const isParentActive = (item) =>
    item.subItems?.some((sub) => isActive(sub.path));

  const toggleSubMenu = (title) =>
    setOpenSubMenu(openSubMenu === title ? null : title);

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      
      {/* HEADER */}
      <div className="flex items-center p-4 border-b">
        <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
          Ad
        </div>
        <h1 className="ml-3 text-lg font-bold text-gray-800">Admin</h1>
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isMenuOpen = openSubMenu === item.title;
          const activeParent = isParentActive(item);

          return (
            <div key={index}>
              {item.isParent ? (
                <>
                  {/* MENU CHA */}
                  <button
                    onClick={() => toggleSubMenu(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition
                      ${activeParent || isMenuOpen
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

                  {/* SUBMENU */}
                  <div
                    ref={(el) => (submenuRefs.current[item.title] = el)}
                    style={{
                      maxHeight:
                        isMenuOpen || activeParent
                          ? submenuRefs.current[item.title]?.scrollHeight + "px"
                          : "0px"
                    }}
                    className="ml-5 mt-1 space-y-1 border-l border-gray-200 pl-3 
                      overflow-hidden transition-all duration-300 ease-in-out"
                  >
                    {item.subItems.map((sub, idx) => (
                      <Link
                        key={idx}
                        to={sub.path}
                        className={`w-full flex items-center px-3 py-2 rounded-xl text-sm transition
                          ${isActive(sub.path)
                            ? "bg-indigo-50 text-indigo-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                /* MENU ĐƠN */
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
                    ${isActive(item.path)
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
