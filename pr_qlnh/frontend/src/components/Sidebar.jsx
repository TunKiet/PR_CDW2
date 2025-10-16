import React, { useState } from "react";

const menuStructure = [
  { name: "Đơn hàng mới", icon: "M2 3h16l2 4M2 3v15h4M2 3h4m14 0h-4m0 0l-3 4m3-4l3 4M5 13h14M8 17h8M4 7h16M7 11h10", path: "#" },
  { name: "Thống kê", icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z", path: "#" },
  {
    name: "Đặt bàn",
    icon: "M8 7V3m8 4V3m-4 7v6m-4-3h8M3 8h18M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z",
    submenu: [
      { name: "Quản lý Đặt bàn", path: "#" },
      { name: "Quản lý Bàn Ăn", path: "/tables", active: true },
    ],
  },
  { name: "Thực đơn", icon: "M4 6h16M4 10h16M4 14h16M4 18h16", path: "#" },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState("Đặt bàn");

  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <div className="sidebar fixed lg:static z-40 lg:w-64 bg-white border-r border-gray-200 shadow-xl p-4 flex flex-col h-full">
      <div className="flex items-center p-3 mb-6 mt-2">
        <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg">Ad</div>
        <h1 className="text-2xl font-bold text-gray-900 ml-3">Administration</h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuStructure.map((item) => (
          <div key={item.name}>
            <button
              onClick={() => item.submenu && toggleMenu(item.name)}
              className={`flex w-full items-center p-3 rounded-xl text-sm ${
                openMenu === item.name ? "bg-indigo-100 text-indigo-800 font-semibold" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="flex-1 text-left">{item.name}</span>
              {item.submenu && (
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${openMenu === item.name ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {item.submenu && openMenu === item.name && (
              <div className="pl-6 space-y-1 mt-1">
                {item.submenu.map((sub) => (
                  <a
                    key={sub.name}
                    href={sub.path}
                    className={`block p-2 rounded-lg text-sm ${
                      sub.active ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {sub.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 mt-4">
        <div className="flex items-center p-2 rounded-xl bg-gray-50">
          <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm">NV</div>
          <div className="ml-3">
            <p className="font-semibold text-gray-800">Trần Tuấn Kiệt</p>
            <p className="text-xs text-gray-500">Quản lý hệ thống</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
