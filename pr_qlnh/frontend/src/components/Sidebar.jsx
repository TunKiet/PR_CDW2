// src/components/Sidebar.jsx
import { ClipboardList, BarChart2, FileText, Calendar, ShoppingCart, Menu, Zap, User, Users, Settings, Building } from "lucide-react";
const Sidebar = () => {
  const menuItems = [
    { title: "Đơn hàng mới", icon: <ClipboardList size={20} />, active: true },
    { title: "Thống kê", icon: <BarChart2 size={20} /> },
    { title: "Hóa đơn", icon: <FileText size={20} /> },
    { title: "Đặt bàn", icon: <Calendar size={20} /> },
    { title: "Quản lý Giỏ hàng", icon: <ShoppingCart size={20} /> },
    { title: "Thực đơn", icon: <Menu size={20} /> },
    { title: "Mặt hàng", icon: <Zap size={20} /> },
    { title: "Nhân viên", icon: <User size={20} /> },
    { title: "Khách hàng", icon: <Users size={20} /> },
    { title: "Hệ thống", icon: <Settings size={20} /> },
    { title: "Thiết lập nhà hàng", icon: <Building size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="flex items-center p-4 border-b">
        <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
          Ad
        </div>
        <h1 className="ml-3 text-lg font-bold text-gray-800">Admin</h1>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
              item.active
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span>{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
