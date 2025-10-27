<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản Lý Thực Đơn</title>
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
        }
        /* Custom scrollbar styling for the table container */
        .custom-scroll::-webkit-scrollbar {
            height: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
            border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background-color: #f3f4f6;
        }
        /* Sidebar Styles (Light theme to match image) */
        .sidebar-active-parent-item {
            background-color: #e0e7ff; /* Indigo 100 - light purple */
            color: #4338ca; /* Indigo 700 */
            font-weight: 600;
        }
        .sidebar-menu-item {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            border-radius: 0.5rem;
            transition: all 150ms;
            cursor: pointer;
            color: #374151; /* Gray 700 */
        }
        .sidebar-menu-item:hover:not(.sidebar-active-parent-item) {
            background-color: #f3f4f6; /* Gray 100 */
        }
        .sidebar-menu-subitem {
            display: flex;
            align-items: center;
            padding: 0.5rem 0.75rem 0.5rem 2.5rem; /* Indentation */
            border-radius: 0.5rem;
            transition: all 150ms;
            cursor: pointer;
            color: #4b5563; /* Gray 600 */
            font-size: 0.9rem;
        }
        .sidebar-menu-subitem:hover {
            background-color: #f3f4f6; /* Gray 100 */
        }
        .subitem-active {
            font-weight: 600;
            color: #10b981; /* Emerald 500 for active sub-link */
        }
    </style>
</head>
<body class="flex h-screen overflow-hidden">

    <!-- Cột Menu (Sidebar) - Trái - Đã cập nhật theo mẫu hình ảnh -->
    <aside id="sidebar" class="w-64 bg-white text-gray-800 flex-shrink-0 shadow-lg transition-all duration-300 overflow-y-auto">
        <div class="p-6 flex items-center border-b border-gray-100">
            <div class="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold text-xl mr-3">Ad</div>
            <h1 class="text-2xl font-extrabold text-gray-900">Admin</h1>
        </div>
        <nav class="p-4 space-y-1">

            <!-- Đơn hàng mới -->
            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Đơn hàng mới
            </a>

            <!-- Thống kê -->
            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thống kê
            </a>

            <!-- Hóa đơn (có dropdown) -->
            <div class="relative">
                <a href="#" class="sidebar-menu-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Hóa đơn
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </a>
            </div>

            <!-- Đặt bàn (Đã mở) -->
            <div class="relative">
                <a href="#" class="sidebar-menu-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 17h.01M16 13h.01M10 17h.01M10 13h.01M14 17h.01M14 13h.01M8 17h.01M8 13h.01M3 21h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Đặt bàn
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </a>
                <!-- Sub-menu Đặt bàn -->
                <div class="ml-2 py-1 space-y-1">
                    <a href="#" class="sidebar-menu-subitem">
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                        Quản lý Đặt bàn
                    </a>
                    <a href="#" class="sidebar-menu-subitem">
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                        Quản lý Bàn Ăn
                    </a>
                </div>
            </div>

            <!-- Thực đơn (Mục đang Hoạt động) -->
            <div class="relative">
                <div class="sidebar-menu-item sidebar-active-parent-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Thực đơn
                    </span>
                    <!-- Không có mũi tên vì đây là mục đang hoạt động chính -->
                </div>
                <!-- Sub-menu Thực đơn -->
                <div class="ml-2 py-1 space-y-1">
                    <!-- Quản lý Món ăn (Sub-item đang active) -->
                    <a href="#" id="menu-dishes" onclick="showView('dishes')" class="sidebar-menu-subitem subitem-active">
                        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                        Quản lý Món ăn
                    </a>
                    <!-- Quản lý Danh mục -->
                    <a href="#" id="menu-categories" onclick="showView('categories')" class="sidebar-menu-subitem">
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                        Quản lý Danh mục
                    </a>
                </div>
            </div>

            <!-- Mặt hàng (có dropdown) -->
            <div class="relative">
                <a href="#" class="sidebar-menu-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Mặt hàng
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </a>
            </div>

            <!-- Nhân viên (có dropdown) -->
            <div class="relative">
                <a href="#" class="sidebar-menu-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2h2m-4-7a4 4 0 100-8 4 4 0 000 8z" />
                        </svg>
                        Nhân viên
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </a>
            </div>

            <!-- Khách hàng (có dropdown) -->
            <div class="relative">
                <a href="#" class="sidebar-menu-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Khách hàng
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </a>
            </div>

            <!-- Hệ thống -->
            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Hệ thống
            </a>

            <!-- Thiết lập nhà hàng -->
            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Thiết lập nhà hàng
            </a>
        </nav>
    </aside>

    <!-- Khu vực Nội dung Chính -->
    <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-6" id="view-title">Quản Lý Món Ăn</h2>

        <!-- Khung Quản lý Món ăn -->
        <div id="dishes-view" class="bg-white p-6 rounded-xl shadow-lg transition-opacity duration-300">
            <!-- Thanh Công cụ: Thêm, Lọc, Tìm kiếm -->
            <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <!-- Nút Thêm Món Ăn -->
                <button class="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    Thêm Món Ăn Mới
                </button>

                <!-- Lọc & Tìm kiếm -->
                <div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
                    <!-- Lọc theo Danh mục -->
                    <select class="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-40">
                        <option value="">Lọc theo Danh mục</option>
                        <option value="main">Món Chính</option>
                        <option value="dessert">Tráng Miệng</option>
                        <option value="drink">Đồ Uống</option>
                    </select>
                    <!-- Tìm kiếm -->
                    <div class="relative w-full md:w-64">
                        <input type="text" placeholder="Tìm kiếm theo Tên món/ID..." class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Bảng Danh sách Món ăn -->
            <div class="overflow-x-auto custom-scroll border border-gray-200 rounded-xl">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên món ăn</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200" id="dish-list-body">
                        <!-- Dữ liệu mẫu sẽ được chèn ở đây -->
                    </tbody>
                </table>
            </div>
            
            <!-- Phân trang (Placeholder) -->
            <div class="mt-6 flex justify-between items-center text-sm text-gray-600">
                <span>Hiển thị 1 đến 10 trên 50 kết quả</span>
                <div class="flex space-x-2">
                    <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150" disabled>Trước</button>
                    <button class="px-3 py-1 border border-gray-300 rounded-lg bg-emerald-500 text-white">1</button>
                    <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100">2</button>
                    <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100">3</button>
                    <button class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150">Sau</button>
                </div>
            </div>
        </div>

        <!-- Khung Quản lý Danh mục -->
        <div id="categories-view" class="bg-white p-6 rounded-xl shadow-lg transition-opacity duration-300 hidden">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">Giao diện Quản lý Danh mục</h3>
            <!-- Thanh Công cụ: Thêm, Lọc, Tìm kiếm -->
            <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <!-- Nút Thêm Danh mục -->
                <button class="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    Thêm Danh Mục Mới
                </button>

                <!-- Tìm kiếm Danh mục -->
                <div class="relative w-full md:w-64">
                    <input type="text" placeholder="Tìm kiếm theo Tên danh mục/ID..." class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>

            <!-- Bảng Danh sách Danh mục (Placeholder) -->
            <div class="overflow-x-auto custom-scroll border border-gray-200 rounded-xl">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Danh mục</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng Món ăn</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <!-- Dữ liệu mẫu cho Danh mục -->
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">DM001</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Món Chính</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Hoạt động
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button class="text-blue-600 hover:text-blue-900 mx-2" title="Sửa">...</button>
                                <button class="text-red-600 hover:text-red-900 mx-2" title="Xóa">...</button>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">DM002</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Đồ Uống</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Hoạt động
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button class="text-blue-600 hover:text-blue-900 mx-2" title="Sửa">...</button>
                                <button class="text-red-600 hover:text-red-900 mx-2" title="Xóa">...</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <script>
        // Dữ liệu mẫu cho bảng Món ăn
        const dishesData = [
            { id: 'MA001', image: 'https://placehold.co/40x40/4c4d50/ffffff?text=F', name: 'Phở Bò Đặc Biệt', category: 'Món Chính', price: 65000, status: 'Còn hàng' },
            { id: 'MA002', image: 'https://placehold.co/40x40/facc15/000000?text=C', name: 'Kem Vani Tráng Miệng', category: 'Tráng Miệng', price: 35000, status: 'Hết hàng' },
            { id: 'MA003', image: 'https://placehold.co/40x40/22c55e/ffffff?text=N', name: 'Nước Cam Ép Tươi', category: 'Đồ Uống', price: 40000, status: 'Còn hàng' },
            { id: 'MA004', image: 'https://placehold.co/40x40/3b82f6/ffffff?text=G', name: 'Gỏi Cuốn Tôm Thịt', category: 'Món Khai Vị', price: 50000, status: 'Còn hàng' },
            { id: 'MA005', image: 'https://placehold.co/40x40/ef4444/ffffff?text=L', name: 'Lẩu Hải Sản Cay', category: 'Món Chính', price: 299000, status: 'Còn hàng' },
        ];

        // Hàm định dạng tiền tệ Việt Nam
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        };

        // Hàm render bảng Món ăn
        const renderDishTable = (data) => {
            const tableBody = document.getElementById('dish-list-body');
            tableBody.innerHTML = ''; // Xóa nội dung cũ
            
            data.forEach(dish => {
                const statusClass = dish.status === 'Còn hàng' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

                const row = `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${dish.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <img src="${dish.image}" alt="Hình ảnh ${dish.name}" class="h-10 w-10 rounded-lg object-cover">
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${dish.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${dish.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${formatCurrency(dish.price)}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                                ${dish.status}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button class="text-blue-600 hover:text-blue-900 mx-2" title="Sửa">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.111 10.155L5.793 17.207l1.414 1.414 4.685-4.685a2 2 0 00-2.828-2.828z" />
                                </svg>
                            </button>
                            <button class="text-red-600 hover:text-red-900 mx-2" title="Xóa">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        };

        // Hàm chuyển đổi giao diện giữa Món ăn và Danh mục
        const showView = (viewName) => {
            const dishView = document.getElementById('dishes-view');
            const categoriesView = document.getElementById('categories-view');
            const viewTitle = document.getElementById('view-title');
            
            const menuDishes = document.getElementById('menu-dishes');
            const menuCategories = document.getElementById('menu-categories');

            // Cập nhật trạng thái active của Sub-item
            menuDishes.classList.remove('subitem-active');
            menuCategories.classList.remove('subitem-active');


            // Ẩn/Hiện nội dung và cập nhật tiêu đề
            if (viewName === 'dishes') {
                dishView.classList.remove('hidden');
                categoriesView.classList.add('hidden');
                viewTitle.textContent = 'Quản Lý Món Ăn';
                menuDishes.classList.add('subitem-active');
            } else if (viewName === 'categories') {
                dishView.classList.add('hidden');
                categoriesView.classList.remove('hidden');
                viewTitle.textContent = 'Quản Lý Danh Mục';
                menuCategories.classList.add('subitem-active');
            }
        };

        // Khởi tạo khi tải trang
        window.onload = () => {
            renderDishTable(dishesData);
            showView('dishes'); // Mặc định hiển thị Quản lý Món ăn
        };
    </script>
</body>
</html>
