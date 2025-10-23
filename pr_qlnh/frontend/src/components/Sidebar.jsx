import { useState } from "react";
import {
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChartBar,
  FaBoxOpen,
  FaClipboardList,
} from "react-icons/fa";
import "./css/Sidebar.css";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [active, setActive] = useState("home");

  const menuItems = [
    { id: "home", label: "Thống kê", icon: <FaChartBar /> },
    { id: "orders", label: "Hóa đơn", icon: <FaClipboardList /> },
    { id: "products", label: "Mặt hàng", icon: <FaBoxOpen /> },
    { id: "users", label: "Khách hàng", icon: <FaUser /> },
    { id: "settings", label: "Cài đặt", icon: <FaCog /> },
  ];

  return (
    <div
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="sidebar-header">
        <h2 className="logo">{isExpanded ? "Admin Panel" : "Ad"}</h2>
      </div>

      {/* Menu */}
      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={active === item.id ? "active" : ""}
            onClick={() => setActive(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {isExpanded && <span className="label">{item.label}</span>}
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className="logout-section">
        <li onClick={() => alert("Đăng xuất")}>
          <span className="icon">
            <FaSignOutAlt />
          </span>
          {isExpanded && <span className="label">Đăng xuất</span>}
        </li>
      </div>
    </div>
  );
}
