// src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  ClipboardList,
  BarChart3,
  FileText,
  CalendarDays,
  ShoppingCart,
  List,
  Package,
  Users,
  UserCircle2,
  Settings,
  Store,
  ChevronDown,
} from "lucide-react";

const Sidebar = () => {
  const [active, setActive] = useState("Đơn hàng mới");
  const [openCategory, setOpenCategory] = useState(false);

  const menuItems = [
    { label: "Đơn hàng mới", icon: ClipboardList },
    { label: "Thống kê", icon: BarChart3 },
    { label: "Hóa đơn", icon: FileText },
    { label: "Đặt bàn", icon: CalendarDays },
    { label: "Quản lý Giỏ hàng", icon: ShoppingCart },
    { label: "Thực đơn", icon: List },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold">
          Ad
        </div>
        <div className="text-lg font-semibold">Admin</div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`flex items-center w-full text-left gap-3 px-4 py-2 rounded-lg mb-1 
                ${
                  active === item.label
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}

        {/* Mặt hàng có dropdown */}
        <div>
          <button
            onClick={() => setOpenCategory(!openCategory)}
            className={`flex items-center justify-between w-full gap-3 px-4 py-2 rounded-lg mb-1 ${
              openCategory ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={18} />
              Mặt hàng
            </div>
            <ChevronDown
              size={16}
              className={`transform transition-transform ${
                openCategory ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {openCategory && (
            <div className="ml-10 space-y-1">
              <a href="#" className="block text-gray-600 hover:text-blue-600">
                Hàng nuôi
              </a>
              <a href="#" className="block text-gray-600 hover:text-blue-600">
                Hàng thiên nhiên
              </a>
              <a href="#" className="block text-gray-600 hover:text-blue-600">
                Hàng hỗn hợp
              </a>
            </div>
          )}
        </div>

        {/* Các mục cuối */}
        <button
          onClick={() => setActive("Nhân viên")}
          className={`flex items-center w-full text-left gap-3 px-4 py-2 rounded-lg mb-1 ${
            active === "Nhân viên"
              ? "bg-blue-100 text-blue-600 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Users size={18} />
          Nhân viên
        </button>

        <button
          onClick={() => setActive("Khách hàng")}
          className={`flex items-center w-full text-left gap-3 px-4 py-2 rounded-lg mb-1 ${
            active === "Khách hàng"
              ? "bg-blue-100 text-blue-600 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <UserCircle2 size={18} />
          Khách hàng
        </button>

        <button
          onClick={() => setActive("Hệ thống")}
          className={`flex items-center w-full text-left gap-3 px-4 py-2 rounded-lg mb-1 ${
            active === "Hệ thống"
              ? "bg-blue-100 text-blue-600 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Settings size={18} />
          Hệ thống
        </button>

        <button
          onClick={() => setActive("Thiết lập nhà hàng")}
          className={`flex items-center w-full text-left gap-3 px-4 py-2 rounded-lg mb-1 ${
            active === "Thiết lập nhà hàng"
              ? "bg-blue-100 text-blue-600 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Store size={18} />
          Thiết lập nhà hàng
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
