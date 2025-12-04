import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ClipboardList, BarChart2, Clock, FileText, Calendar, ShoppingCart, Menu, Zap, Users, Settings, Building, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import axios from 'axios';

const menuItems = [
  { title: "Đơn hàng mới", icon: <ClipboardList size={20} />, path: '/order-page' },
  { title: "Thống kê", icon: <BarChart2 size={20} />, path: '/analytics' },
  { title: "Hóa đơn", icon: <FileText size={20} />, path: '/order-management' },
  { title: "Đặt bàn", icon: <Calendar size={20} />, path: '/tables',   },
  { 
      title: "Chấm công", 
      icon: <Clock size={20} />, 
      path: '/attendance-placeholder', 
      isParent: true,
      subItems: [
        { title: "Chấm công nhân viên", path: '/attendance' },
        { title: "Quản lý chấm công", path: '/attendance-management' },
      ] 
    },
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
   {
    title: "Bảo mật",
    icon: <Users size={20} />,
    isParent: true,
    subItems: [
      { title: "Vai trò", path: '/role-management' },
      { title: "Quyền", path: '/permission-management' },
    ]
  },
  { title: "Quản lý đơn online", icon: <ShoppingCart size={20} />, path: '/order-online' },
  { title: "Mặt hàng", icon: <Zap size={20} />, path: '/inventory' },
  { title: "Hệ thống", icon: <Settings size={20} />, path: '/system-settings' },
  { title: "Thiết lập nhà hàng", icon: <Building size={20} />, path: '/restaurant-info' },
  { title: "Đăng xuất", icon: <LogOut size={20} />, action: "logout" }, // thêm action
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const submenuRefs = useRef({});

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (err) {
        console.error('Lỗi parse user:', err);
      }
    }
  }, []);

  // Kiểm tra vai trò của user
  const getUserRoles = () => {
    try {
      const rolesStr = localStorage.getItem('roles');
      return rolesStr ? JSON.parse(rolesStr) : [];
    } catch {
      return [];
    }
  };

  const userRoles = getUserRoles();
  const isStaff = userRoles.includes('Staff') && !userRoles.includes('ADMIN');

  const isActive = (path) => location.pathname.startsWith(path);
  const isParentActive = (item) =>
    item.subItems?.some((sub) => isActive(sub.path));

  const toggleSubMenu = (title) =>
    setOpenSubMenu(openSubMenu === title ? null : title);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.post(
          "http://localhost:8000/api/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
      navigate("/");
    }
  };

  // Lấy tên hiển thị và chữ cái đầu
  const displayName = currentUser?.full_name || currentUser?.username || 'Chưa có tên';
  const initials = displayName === 'Chưa có tên' 
    ? '?' 
    : displayName.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="flex items-center p-4 border-b">
        <div className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm mx-2">
          {initials}
        </div>
        <span className="text-xl font-semibold text-gray-800 leading-none">{displayName}</span>
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isMenuOpen = openSubMenu === item.title;
          const activeParent = isParentActive(item);

          if (item.action === "logout") {
            return (
              <button
                key={index}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            );
          }

          return (
            <div key={index}>
              {item.isParent ? (
                <>
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

                  <div
                    ref={(el) => (submenuRefs.current[item.title] = el)}
                    style={{
                      maxHeight:
                        isMenuOpen || activeParent
                          ? submenuRefs.current[item.title]?.scrollHeight + "px"
                          : "0px"
                    }}
                    className="ml-5 mt-1 space-y-1 border-l border-gray-200 pl-3 overflow-hidden transition-all duration-300 ease-in-out"
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
                // Kiểm tra nếu là "Thiết lập nhà hàng" và user là Staff thì vô hiệu hóa
                item.title === "Thiết lập nhà hàng" && isStaff ? (
                  <div
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm opacity-50 cursor-not-allowed"
                    title="Bạn không có quyền truy cập chức năng này"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                ) : (
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
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
