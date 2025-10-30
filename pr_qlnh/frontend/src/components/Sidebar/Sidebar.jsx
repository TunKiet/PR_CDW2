import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ClipboardList,
  BarChart2,
  FileText,
  Calendar,
  ShoppingCart,
  Menu,
  Zap,
  User,
  Users,
  Settings,
  Building,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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
    ] 
  },
  { title: "Quản lý giỏ hàng", icon: <ShoppingCart size={20} />, path: '/cart-management' },
  { title: "Mặt hàng", icon: <Zap size={20} />, path: '/inventory' },
  { title: "Nhân viên", icon: <User size={20} />, path: '/staff' },
  { title: "Khách hàng", icon: <Users size={20} />, path: '/customers' },
  { title: "Hệ thống", icon: <Settings size={20} />, path: '/system' },
  { title: "Thiết lập nhà hàng", icon: <Building size={20} />, path: '/restaurant-info' },
];

const Sidebar = () => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const submenuRef = useRef(null);
  const [submenuHeight, setSubmenuHeight] = useState(0);

  const isActive = (path) => location.pathname.startsWith(path);
  const isParentActive = (item) => item.subItems && item.subItems.some(sub => isActive(sub.path));

  useEffect(() => {
    const activeParent = menuItems.find(item => isParentActive(item));
    if (activeParent && openSubMenu !== activeParent.title) {
      setOpenSubMenu(activeParent.title);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (submenuRef.current && openSubMenu === 'Thực đơn') {
      setSubmenuHeight(submenuRef.current.scrollHeight);
    } else {
      setSubmenuHeight(0);
    }
  }, [openSubMenu]);

  const toggleSubMenu = (title) => {
    setOpenSubMenu(openSubMenu === title ? null : title);
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
          Ad
        </div>
        <h1 className="ml-3 text-lg font-bold text-gray-800">Admin</h1>
      </div>

      {/* Menu items */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
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

                  {/* Menu con */}
                  <div
                    ref={submenuRef}
                    style={{ maxHeight: isMenuOpen || isParentActiveState ? `${submenuHeight}px` : '0px' }}
                    className="ml-5 mt-1 space-y-1 border-l border-gray-200 pl-3 overflow-hidden transition-all duration-300 ease-in-out"
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
