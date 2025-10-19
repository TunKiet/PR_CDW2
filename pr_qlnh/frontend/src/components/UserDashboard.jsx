import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, LogOut, Menu, X, ArrowUpRight, Edit, Trash2, Plus } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, setDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';

// --- FIREBASE SETUP ---
// Global variables provided by the Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Dữ liệu mô phỏng (Mock Data)
const mockMetrics = [
  { title: "Tổng Doanh Thu", value: "250.000.000 VNĐ", change: "+12.5%", icon: LayoutDashboard, color: "text-green-500", bgColor: "bg-green-100" },
  { title: "Tổng Đơn Hàng", value: "1,250", change: "+5.2%", icon: ShoppingCart, color: "text-blue-500", bgColor: "bg-blue-100" },
  { title: "Người Dùng Mới", value: "45", change: "+8.9%", icon: Users, color: "text-yellow-500", bgColor: "bg-yellow-100" },
  { title: "Sản Phẩm Tồn", value: "780", change: "-1.1%", icon: Package, color: "text-red-500", bgColor: "bg-red-100" },
];

const mockRecentOrders = [
  { id: '#1001', customer: 'Nguyễn Văn A', amount: '2.500.000 VNĐ', status: 'Đã giao', date: '20/09/2025' },
  { id: '#1002', customer: 'Trần Thị B', amount: '500.000 VNĐ', status: 'Đang xử lý', date: '20/09/2025' },
  { id: '#1003', customer: 'Lê Văn C', amount: '12.000.000 VNĐ', status: 'Đã giao', date: '19/09/2025' },
  { id: '#1004', customer: 'Phạm Thị D', amount: '750.000 VNĐ', status: 'Đã hủy', date: '19/09/2025' },
  { id: '#1005', customer: 'Hoàng Văn E', amount: '3.100.000 VNĐ', status: 'Đã giao', date: '18/09/2025' },
];

const mockUsers = [
    { id: 'usr-001', name: 'Trần Minh Hải', email: 'hai.tm@example.com', role: 'Quản trị viên', status: 'Active', created: '01/01/2025' },
    { id: 'usr-002', name: 'Lê Thị Thu', email: 'thu.lt@example.com', role: 'Khách hàng', status: 'Active', created: '15/02/2025' },
    { id: 'usr-003', name: 'Phạm Văn Kiên', email: 'kien.pv@example.com', role: 'Khách hàng', status: 'Inactive', created: '10/03/2025' },
    { id: 'usr-004', name: 'Nguyễn Thanh Vân', email: 'van.nt@example.com', role: 'Khách hàng', status: 'Active', created: '22/04/2025' },
];

// Component: Thẻ Số Liệu (Metric Card)
const MetricCard = ({ title, value, change, icon: Icon, color, bgColor }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`p-2 rounded-full ${bgColor} ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{value}</h2>
      <div className="flex items-center text-sm">
        <ArrowUpRight size={16} className={`${color} mr-1`} />
        <span className={`${color} font-semibold`}>{change}</span>
        <span className="text-gray-400 ml-1">so với tháng trước</span>
      </div>
    </div>
  );
};

// Component: Thanh Bên (Sidebar)
const Sidebar = ({ active, setActive, isMenuOpen, setIsMenuOpen, userId }) => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Người dùng", icon: Users },
    { name: "Sản phẩm", icon: Package },
    { name: "Đơn hàng", icon: ShoppingCart },
    { name: "Cài đặt", icon: Settings },
  ];

  return (
    <>
      {/* Overlay cho mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* Sidebar chính */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl p-6 flex flex-col transition-transform duration-300 z-40 lg:static lg:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h1 className="text-2xl font-extrabold text-indigo-600">Admin Panel</h1>
          <button className="lg:hidden text-gray-500 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <p className="text-xs text-gray-400 mb-4 truncate" title={userId}>
            User ID: <span className="text-gray-600 font-mono">{userId || 'Loading...'}</span>
        </p>

        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setActive(item.name);
                    setIsMenuOpen(false); // Đóng menu sau khi chọn trên mobile
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition duration-200 ${
                    active === item.name
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
                >
                  <item.icon size={20} className="mr-3" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-4 border-t">
          <button className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition duration-200">
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Component: Bảng Đơn Hàng Gần Đây
const RecentOrders = () => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Đã giao':
        return 'bg-green-100 text-green-700';
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-700';
      case 'Đã hủy':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Đơn Hàng Gần Đây</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Mã ĐH', 'Khách hàng', 'Số tiền', 'Trạng thái', 'Ngày', 'Chi tiết'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockRecentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{order.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900 transition duration-150">Xem</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Component Mới: Quản lý Người dùng
const UserManagementContent = () => {
    const getStatusClasses = (status) => {
        return status === 'Active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700';
    };

    const handleAction = (action, user) => {
        console.log(`${action} người dùng: ${user.name} (${user.id})`);
        // Trong ứng dụng thực tế, sẽ gọi hàm setDoc/deleteDoc của Firestore ở đây
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Danh Sách Người Dùng</h3>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition duration-150">
                    <Plus size={18} className="mr-2" />
                    Thêm Người Dùng
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['ID', 'Họ tên', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Hành động'].map((header) => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(user.status)}`}>
                                        {user.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.created}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button 
                                        onClick={() => handleAction('Sửa', user)}
                                        className="text-blue-600 hover:text-blue-900 transition duration-150 p-1 rounded hover:bg-blue-50"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleAction('Xóa', user)}
                                        className="text-red-600 hover:text-red-900 transition duration-150 p-1 rounded hover:bg-red-50"
                                        title="Xóa"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// Component: Nội Dung Tùy Chỉnh (Dựa trên tab được chọn)
const DashboardContent = ({ activeTab }) => {
    switch (activeTab) {
        case 'Dashboard':
            return (
                <div className="space-y-8">
                    {/* Hàng 1: Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockMetrics.map((metric, index) => (
                            <MetricCard key={index} {...metric} />
                        ))}
                    </div>

                    {/* Hàng 2: Recent Orders */}
                    <RecentOrders />
                </div>
            );
        case 'Người dùng':
            return <UserManagementContent />;

        default:
            return (
                <div className="p-8 bg-white rounded-xl shadow-lg min-h-[400px] flex items-center justify-center">
                    <p className="text-2xl font-bold text-gray-600">
                        Nội dung cho mục "{activeTab}" đang được phát triển...
                    </p>
                </div>
            );
    }
};


// Component Chính: App
const App = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State cho mobile menu
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // Initialize Firebase and Auth
  useEffect(() => {
    if (!Object.keys(firebaseConfig).length) {
        console.error("Firebase config is missing. Running in mock mode.");
        setIsAuthReady(true); // Treat as ready if config is missing
        setUserId('MOCK_USER_' + crypto.randomUUID().slice(0, 8));
        return;
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    // const db = getFirestore(app); // Available for use globally or passed down

    const authenticate = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase authentication error:", error);
      }
    };

    authenticate();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId('ANONYMOUS_' + crypto.randomUUID().slice(0, 8));
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-indigo-600">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tải Dashboard...</span>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      {/* Sidebar (Mobile Menu & Desktop) */}
      <Sidebar active={activeTab} setActive={setActiveTab} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} userId={userId} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64">
        
        {/* Header/Navbar (Mobile) */}
        <header className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-between lg:hidden z-20">
            <button className="text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(true)}>
                <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
                {activeTab}
            </h1>
            <div className="w-8"></div> {/* Placeholder */}
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-8 lg:p-10 w-full">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 hidden lg:block">{activeTab}</h1>
            <p className="text-gray-500 mb-8 hidden lg:block">Tổng quan dữ liệu và quản lý hệ thống</p>
            <DashboardContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

export default App;
