export const menuStructure = [
  { name: "Đơn hàng mới", iconPath: "M2 3h16l2 4M2 3v15h4M2 3h4m14 0h-4m0 0l-3 4m3-4l3 4M5 13h14M8 17h8M4 7h16M7 11h10", path: "#" },
  { name: "Thống kê", iconPath: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z", path: "#" },
  {
    name: "Đặt bàn",
    iconPath: "M8 7V3m8 4V3m-4 7v6m-4-3h8M3 8h18M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z",
    collapsible: true,
    key: "reservations",
    submenu: [
      { name: "Quản lý Đặt bàn", path: "#" },
      { name: "Quản lý Bàn Ăn", path: "#" }
    ]
  },
  // ... add other menu items as needed
];
