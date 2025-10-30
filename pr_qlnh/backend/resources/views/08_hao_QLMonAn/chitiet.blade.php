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
        /* Custom scrollbar styling */
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
        /* Sidebar Styles */
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

    <!-- Cột Menu (Sidebar) - Trái -->
    <aside id="sidebar" class="w-64 bg-white text-gray-800 flex-shrink-0 shadow-lg transition-all duration-300 overflow-y-auto">
        <div class="p-6 flex items-center border-b border-gray-100">
            <div class="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold text-xl mr-3">Ad</div>
            <h1 class="text-2xl font-extrabold text-gray-900">Admin</h1>
        </div>
        <nav class="p-4 space-y-1">
            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Đơn hàng mới</span>
            </a>
            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Thống kê</span>
            </a>
            <div class="relative">
                <a href="#" class="sidebar-menu-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Hóa đơn</span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </a>
            </div>
            <div class="relative">
                <a href="#" class="sidebar-menu-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 17h.01M16 13h.01M10 17h.01M10 13h.01M14 17h.01M14 13h.01M8 17h.01M8 13h.01M3 21h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Đặt bàn</span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </a>
                <div class="ml-2 py-1 space-y-1">
                    <a href="#" class="sidebar-menu-subitem">
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                        <span>Quản lý Đặt bàn</span>
                    </a>
                    <a href="#" class="sidebar-menu-subitem">
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                        <span>Quản lý Bàn Ăn</span>
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
                        <span>Thực đơn</span>
                    </span>
                </div>
                <!-- Sub-menu Thực đơn -->
                <div class="ml-2 py-1 space-y-1">
                    <!-- Quản lý Món ăn (Sub-item đang active) -->
                    <a href="#" id="menu-dishes" onclick="showView('dishes')" class="sidebar-menu-subitem subitem-active">
                        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                        <span>Quản lý Món ăn</span>
                    </a>
                    <!-- Quản lý Danh mục -->
                    <a href="#" id="menu-categories" onclick="showView('categories')" class="sidebar-menu-subitem">
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                        <span>Quản lý Danh mục</span>
                    </a>
                </div>
            </div>

            <div class="relative">
                <a href="#" class="sidebar-menu-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Mặt hàng</span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </a>
            </div>

            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2h2m-4-7a4 4 0 100-8 4 4 0 000 8zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Nhân viên</span>
            </a>
            
            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 000 8zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Khách hàng</span>
            </a>

            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Hệ thống</span>
            </a>

            <a href="#" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Thiết lập nhà hàng</span>
            </a>
        </nav>
    </aside>

    <!-- Khu vực Nội dung Chính -->
    <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <!-- Header cho Title -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-extrabold text-gray-900" id="view-title">Quản Lý Món Ăn</h2>
        </div>

        <!-- Khung Quản lý Món ăn -->
        <div id="dishes-view" class="bg-white p-6 rounded-xl shadow-lg transition-opacity duration-300">
            <!-- Thanh Công cụ: Thêm Món ăn -->
            <div class="flex justify-start mb-6">
                <!-- Nút Thêm Món Ăn Mới -->
                <button onclick="openAddModal()" class="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    <span>Thêm Món Ăn Mới</span>
                </button>
            </div>

            <!-- Khung Tìm kiếm Nâng cao -->
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                <h4 class="font-bold text-xl mb-4 text-gray-800 border-b border-gray-200 pb-2">Tìm kiếm Nâng cao</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <!-- Tìm kiếm Tên/ID -->
                    <div class="lg:col-span-2">
                        <label for="search-input" class="block text-sm font-medium text-gray-700">Tên món/ID</label>
                        <input type="text" id="search-input" placeholder="Nhập từ khóa tìm kiếm..." class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                    </div>

                    <!-- Lọc Danh mục -->
                    <div>
                        <label for="category-filter" class="block text-sm font-medium text-gray-700">Danh mục</label>
                        <select id="category-filter" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                            <option value="">Tất cả Danh mục</option>
                            <option value="main">Món Chính</option>
                            <option value="dessert">Tráng Miệng</option>
                            <option value="drink">Đồ Uống</option>
                        </select>
                    </div>

                    <!-- Lọc Trạng thái -->
                    <div>
                        <label for="status-filter" class="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <select id="status-filter" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                            <option value="">Tất cả Trạng thái</option>
                            <option value="status_available">Còn hàng</option>
                            <option value="status_unavailable">Hết hàng</option>
                        </select>
                    </div>
                    
                    <!-- Nút Áp dụng -->
                    <div class="flex items-end">
                        <button onclick="applyFilters()" class="w-full h-[42px] px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">Áp dụng Lọc</button>
                    </div>
                </div>
                
                <!-- Hàng thứ hai cho Price Range -->
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                     <!-- Giá tối thiểu -->
                    <div>
                        <label for="min-price-input" class="block text-sm font-medium text-gray-700">Giá Tối thiểu (VNĐ)</label>
                        <input type="number" id="min-price-input" min="0" placeholder="0" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                    </div>

                    <!-- Giá tối đa -->
                    <div>
                        <label for="max-price-input" class="block text-sm font-medium text-gray-700">Giá Tối đa (VNĐ)</label>
                        <input type="number" id="max-price-input" min="0" placeholder="Không giới hạn" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                    </div>
                     <!-- Nút Clear Filter -->
                    <div class="flex items-end">
                        <button onclick="clearFilters()" class="w-full h-[42px] px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-150">Xóa Lọc</button>
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
                        <!-- Dữ liệu món ăn sẽ được chèn ở đây -->
                    </tbody>
                </table>
            </div>
            
            <!-- Phân trang (Placeholder) -->
            <div class="mt-6 flex justify-between items-center text-sm text-gray-600">
                <span id="pagination-info">Hiển thị 1 đến 10 trên 50 kết quả</span>
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
            <!-- Nội dung quản lý Danh mục (Placeholder) -->
        </div>
    </main>

    <!-- Modal Thêm/Chỉnh sửa Món Ăn -->
    <div id="add-dish-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-95 opacity-0" id="add-modal-content">
            <h3 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Thêm Món Ăn Mới</h3>
            <form class="space-y-4">
                <!-- Tên món ăn -->
                <div>
                    <label for="dish-name" class="block text-sm font-medium text-gray-700">Tên món ăn</label>
                    <input type="text" id="dish-name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                
                <!-- Danh mục & Giá bán -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="dish-category" class="block text-sm font-medium text-gray-700">Danh mục</label>
                        <select id="dish-category" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                            <option value="main">Món Chính</option>
                            <option value="dessert">Tráng Miệng</option>
                            <option value="drink">Đồ Uống</option>
                        </select>
                    </div>
                    <div>
                        <label for="dish-price" class="block text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                        <input type="number" id="dish-price" min="0" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                </div>

                <!-- Hình ảnh Món ăn -->
                <div class="space-y-2">
                    <label for="dish-image-input" class="block text-sm font-medium text-gray-700">Hình ảnh Món ăn</label>
                    <div class="mt-1 flex items-center space-x-4">
                        <img id="image-preview" src="https://placehold.co/100x100/e5e7eb/4b5563?text=Ảnh+món+ăn" alt="Xem trước ảnh" class="h-24 w-24 object-cover rounded-lg border border-gray-300">
                        
                        <label class="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 shadow-md">
                            <span>Chọn file ảnh</span>
                            <input type="file" id="dish-image-input" accept="image/*" class="hidden" onchange="previewImage(event)">
                        </label>
                    </div>
                    <p class="text-xs text-gray-500 pt-1">Định dạng PNG, JPG, tối đa 2MB.</p>
                </div>

                <!-- Mô tả (Tùy chọn) -->
                <div>
                    <label for="dish-description" class="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                    <textarea id="dish-description" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>
            </form>

            <!-- Action buttons -->
            <div class="mt-8 flex justify-end space-x-3">
                <button type="button" onclick="closeAddModal()" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150">Hủy</button>
                <button type="button" onclick="saveDish()" class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium transition duration-150 shadow-lg">Lưu Món ăn</button>
            </div>
        </div>
    </div>
    
    <!-- Modal Xem Chi Tiết Món Ăn (MỚI) -->
    <div id="view-dish-details-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-95 opacity-0" id="detail-modal-content">
            <h3 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Chi Tiết Món Ăn</h3>
            <div id="dish-details-container" class="space-y-4">
                <!-- Nội dung chi tiết được JS chèn vào -->
            </div>
            <div class="mt-8 flex justify-end">
                <button type="button" onclick="closeDetailsModal()" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150">Đóng</button>
            </div>
        </div>
    </div>

    <script>
        // Bản đồ ánh xạ giá trị key sang chuỗi hiển thị
        const categoryMap = {
            'main': 'Món Chính',
            'dessert': 'Tráng Miệng',
            'drink': 'Đồ Uống'
        };
        const statusMap = {
            'status_available': 'Còn hàng',
            'status_unavailable': 'Hết hàng'
        };

        // Dữ liệu mẫu cho bảng Món ăn (Đã thêm trường description)
        const dishesData = [
            { id: 'MA001', image: 'https://placehold.co/40x40/4c4d50/ffffff?text=F', name: 'Phở Bò Đặc Biệt', categoryKey: 'main', price: 65000, statusKey: 'status_available', description: 'Món Phở truyền thống Hà Nội, nước dùng được ninh từ xương bò trong nhiều giờ, thơm ngon đậm đà.' },
            { id: 'MA002', image: 'https://placehold.co/40x40/facc15/000000?text=C', name: 'Kem Vani Tráng Miệng', categoryKey: 'dessert', price: 35000, statusKey: 'status_unavailable', description: 'Kem vani mát lạnh, béo ngậy, dùng kèm với một lát dâu tây tươi.' },
            { id: 'MA003', image: 'https://placehold.co/40x40/22c55e/ffffff?text=N', name: 'Nước Cam Ép Tươi', categoryKey: 'drink', price: 40000, statusKey: 'status_available', description: 'Cam tươi nguyên chất được ép tại chỗ, giàu vitamin C.' },
            { id: 'MA004', image: 'https://placehold.co/40x40/3b82f6/ffffff?text=G', name: 'Gỏi Cuốn Tôm Thịt', categoryKey: 'main', price: 50000, statusKey: 'status_available', description: 'Gỏi cuốn thanh mát với tôm tươi, thịt luộc, bún và rau sống, chấm cùng nước mắm chua ngọt đặc trưng.' },
            { id: 'MA005', image: 'https://placehold.co/40x40/ef4444/ffffff?text=L', name: 'Lẩu Hải Sản Cay', categoryKey: 'main', price: 299000, statusKey: 'status_available', description: 'Lẩu hải sản thập cẩm, vị chua cay đậm đà, bao gồm tôm, mực, nghêu và rau tươi.' },
            { id: 'MA006', image: 'https://placehold.co/40x40/9ca3af/ffffff?text=X', name: 'Xôi Gà', categoryKey: 'main', price: 45000, statusKey: 'status_available', description: 'Xôi dẻo thơm, ăn kèm thịt gà chiên giòn và nước sốt đặc biệt.' },
            { id: 'MA007', image: 'https://placehold.co/40x40/6b7280/ffffff?text=C', name: 'Chè Sen', categoryKey: 'dessert', price: 20000, statusKey: 'status_unavailable', description: 'Món tráng miệng truyền thống với hạt sen, củ năng và nước dừa.' },
            { id: 'MA008', image: 'https://placehold.co/40x40/f87171/ffffff?text=T', name: 'Trà Đá', categoryKey: 'drink', price: 5000, statusKey: 'status_available', description: 'Thức uống giải khát cơ bản.' },
            { id: 'MA009', image: 'https://placehold.co/40x40/f97316/ffffff?text=C', name: 'Cà Phê Sữa Đá', categoryKey: 'drink', price: 25000, statusKey: 'status_available', description: 'Cà phê rang xay đậm đà pha phin truyền thống.' },
            { id: 'MA010', image: 'https://placehold.co/40x40/14b8a6/ffffff?text=B', name: 'Bánh Flan', categoryKey: 'dessert', price: 15000, statusKey: 'status_available', description: 'Bánh flan mềm mịn, béo ngậy, sốt caramel đắng nhẹ.' },
        ];


        // Hàm định dạng tiền tệ Việt Nam
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        };

        // Hàm render bảng Món ăn
        const renderDishTable = (data) => {
            const tableBody = document.getElementById('dish-list-body');
            tableBody.innerHTML = ''; 
            
            if (data.length === 0) {
                 const row = `<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500 font-medium">Không tìm thấy món ăn nào phù hợp với bộ lọc.</td></tr>`;
                 tableBody.insertAdjacentHTML('beforeend', row);
                 return;
            }

            data.forEach(dish => {
                const statusText = statusMap[dish.statusKey];
                const categoryText = categoryMap[dish.categoryKey];

                const isAvailable = dish.statusKey === 'status_available';
                const statusClass = isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

                const row = `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${dish.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <img src="${dish.image}" onerror="this.onerror=null;this.src='https://placehold.co/40x40/e5e7eb/4b5563?text=N/A';" alt="${dish.name}" class="h-10 w-10 rounded-lg object-cover">
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${dish.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${categoryText}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${formatCurrency(dish.price)}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                                ${statusText}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center space-x-2">
                            <!-- Nút Xem Chi Tiết (MỚI) -->
                            <button onclick="openDetailsModal('${dish.id}')" class="text-indigo-600 hover:text-indigo-900" title="Xem Chi Tiết">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                            <!-- Nút Sửa -->
                            <button class="text-blue-600 hover:text-blue-900" title="Sửa">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.111 10.155L5.793 17.207l1.414 1.414 4.685-4.685a2 2 0 00-2.828-2.828z" />
                                </svg>
                            </button>
                            <!-- Nút Xóa -->
                            <button class="text-red-600 hover:text-red-900" title="Xóa">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });

            // Cập nhật thông tin phân trang (mock up)
            const paginationInfo = document.getElementById('pagination-info');
            const total = data.length;
            paginationInfo.textContent = `Hiển thị 1 đến ${Math.min(10, total)} trên ${total} kết quả`;
        };

        // --- Logic Tìm kiếm Nâng cao ---

        const applyFilters = () => {
            // 1. Lấy giá trị từ các bộ lọc
            const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
            const categoryFilter = document.getElementById('category-filter').value;
            const statusFilter = document.getElementById('status-filter').value;
            const minPrice = parseFloat(document.getElementById('min-price-input').value) || 0;
            const maxPrice = parseFloat(document.getElementById('max-price-input').value) || Infinity;

            // 2. Lọc dữ liệu
            const filteredData = dishesData.filter(dish => {
                // Lọc 1: Tên/ID
                const matchesSearch = searchTerm === '' || 
                                      dish.name.toLowerCase().includes(searchTerm) || 
                                      dish.id.toLowerCase().includes(searchTerm);

                // Lọc 2: Danh mục
                const matchesCategory = categoryFilter === '' || dish.categoryKey === categoryFilter;

                // Lọc 3: Trạng thái
                const matchesStatus = statusFilter === '' || dish.statusKey === statusFilter;

                // Lọc 4: Khoảng giá
                const matchesPrice = dish.price >= minPrice && dish.price <= maxPrice;
                
                return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
            });

            // 3. Render lại bảng với dữ liệu đã lọc
            renderDishTable(filteredData);
        };

        const clearFilters = () => {
            document.getElementById('search-input').value = '';
            document.getElementById('category-filter').value = '';
            document.getElementById('status-filter').value = '';
            document.getElementById('min-price-input').value = '';
            document.getElementById('max-price-input').value = '';
            // Áp dụng lại bộ lọc (sẽ hiển thị tất cả)
            applyFilters();
        };

        // --- Logic quản lý giao diện ---

        // Hàm chuyển đổi giao diện giữa Món ăn và Danh mục
        const showView = (viewName) => {
            const dishView = document.getElementById('dishes-view');
            const categoriesView = document.getElementById('categories-view');
            const viewTitle = document.getElementById('view-title');
            
            const menuDishes = document.getElementById('menu-dishes');
            const menuCategories = document.getElementById('menu-categories');

            menuDishes.classList.remove('subitem-active');
            menuCategories.classList.remove('subitem-active');

            if (viewName === 'dishes') {
                dishView.classList.remove('hidden');
                categoriesView.classList.add('hidden');
                menuDishes.classList.add('subitem-active');
                viewTitle.textContent = 'Quản Lý Món Ăn';
            } else if (viewName === 'categories') {
                dishView.classList.add('hidden');
                categoriesView.classList.remove('hidden');
                menuCategories.classList.add('subitem-active');
                viewTitle.textContent = 'Giao diện Quản lý Danh mục';
            }
        };

        // --- Logic quản lý Modal Thêm/Sửa (Add Modal) ---

        const addModal = document.getElementById('add-dish-modal');
        const addModalContent = document.getElementById('add-modal-content');

        const openAddModal = () => {
            addModal.classList.remove('hidden');
            setTimeout(() => {
                addModalContent.classList.remove('scale-95', 'opacity-0');
                addModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        const closeAddModal = () => {
            addModalContent.classList.add('scale-95', 'opacity-0');
            addModalContent.classList.remove('scale-100', 'opacity-100');

            setTimeout(() => {
                addModal.classList.add('hidden');
                resetForm();
            }, 300);
        }

        const resetForm = () => {
            document.getElementById('dish-name').value = '';
            document.getElementById('dish-price').value = '';
            document.getElementById('dish-description').value = '';
            const preview = document.getElementById('image-preview');
            if (preview) {
                preview.src = 'https://placehold.co/100x100/e5e7eb/4b5563?text=Ảnh+món+ăn';
            }
            const fileInput = document.getElementById('dish-image-input');
            if (fileInput) {
                fileInput.value = null; 
            }
        }

        const previewImage = (event) => {
            const file = event.target.files[0];
            const preview = document.getElementById('image-preview');

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                }
                reader.readAsDataURL(file);
            } else {
                preview.src = 'https://placehold.co/100x100/e5e7eb/4b5563?text=Ảnh+món+ăn';
            }
        }

        const saveDish = () => {
            // Logic lưu món ăn (mock up)
            const name = document.getElementById('dish-name').value;
            const price = document.getElementById('dish-price').value;
            if (!name || !price) {
                console.error("Vui lòng điền đầy đủ Tên món và Giá.");
                return;
            }
            console.log(`Lưu món ăn: ${name} - ${price}`);
            closeAddModal();
        }
        
        // --- Logic quản lý Modal Xem Chi Tiết (Details Modal - MỚI) ---
        
        const detailsModal = document.getElementById('view-dish-details-modal');
        const detailsModalContent = document.getElementById('detail-modal-content');

        const openDetailsModal = (dishId) => {
            const dish = dishesData.find(d => d.id === dishId);
            if (!dish) {
                console.error('Không tìm thấy món ăn với ID:', dishId);
                return;
            }

            const container = document.getElementById('dish-details-container');
            
            // Xây dựng HTML chi tiết món ăn
            const detailsHtml = `
                <div class="flex items-center justify-center mb-4 border-b pb-4">
                    <img src="${dish.image}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/e5e7eb/4b5563?text=Không+có+ảnh';" alt="${dish.name}" class="h-32 w-32 object-cover rounded-xl shadow-lg border border-gray-200">
                </div>
                <div class="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <p class="font-semibold text-gray-600">ID Món:</p>
                    <p class="text-gray-900 font-mono">${dish.id}</p>

                    <p class="font-semibold text-gray-600">Tên Món:</p>
                    <p class="text-gray-900 font-bold">${dish.name}</p>
                    
                    <p class="font-semibold text-gray-600">Danh Mục:</p>
                    <p class="text-gray-900">${categoryMap[dish.categoryKey]}</p>
                    
                    <p class="font-semibold text-gray-600">Giá Bán:</p>
                    <p class="text-gray-900 font-bold text-lg text-emerald-600">${formatCurrency(dish.price)}</p>
                    
                    <p class="font-semibold text-gray-600">Trạng Thái:</p>
                    <p class="text-gray-900">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dish.statusKey === 'status_available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${statusMap[dish.statusKey]}
                        </span>
                    </p>

                    <p class="font-semibold text-gray-600 col-span-2 mt-4 border-t pt-4">Mô Tả Chi Tiết:</p>
                    <p class="text-gray-700 col-span-2 text-sm">${dish.description || 'Chưa có mô tả chi tiết cho món ăn này.'}</p>
                </div>
            `;

            container.innerHTML = detailsHtml;

            detailsModal.classList.remove('hidden');
            setTimeout(() => {
                detailsModalContent.classList.remove('scale-95', 'opacity-0');
                detailsModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        };

        const closeDetailsModal = () => {
            detailsModalContent.classList.add('scale-95', 'opacity-0');
            detailsModalContent.classList.remove('scale-100', 'opacity-100');

            setTimeout(() => {
                detailsModal.classList.add('hidden');
                document.getElementById('dish-details-container').innerHTML = ''; // Dọn dẹp nội dung
            }, 300);
        };


        // Khởi tạo khi tải trang
        window.onload = () => {
            showView('dishes'); 
            applyFilters(); // Render bảng món ăn ban đầu
        };
    </script>
</body>
</html>
