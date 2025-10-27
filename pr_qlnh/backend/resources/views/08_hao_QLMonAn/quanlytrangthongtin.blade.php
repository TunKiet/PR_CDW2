<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản Lý Nội Dung Nhà Hàng</title>
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            height: 100vh;
            margin: 0;
            display: flex;
            padding: 0; 
        }
        .main-container {
            padding: 2rem; 
        }
        .modal {
            display: none;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 1000;
        }
        .modal.is-active {
            display: flex;
        }
        /* Sidebar Styles */
        .sidebar-active-item {
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
        .sidebar-menu-item:hover:not(.sidebar-active-item) {
            background-color: #f3f4f6; /* Gray 100 */
        }
        /* Tab Styles */
        .tab-active {
            border-bottom-width: 3px;
            border-color: #4f46e5; /* Indigo 600 */
            color: #4f46e5;
            font-weight: 600;
        }
    </style>
</head>
<body class="overflow-hidden">

    <!-- Cột Menu (Sidebar) -->
    <aside id="sidebar" class="w-64 bg-white text-gray-800 flex-shrink-0 shadow-lg transition-all duration-300 overflow-y-auto">
        <div class="p-6 flex items-center border-b border-gray-100">
            <div class="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold text-xl mr-3">Ad</div>
            <h1 class="text-2xl font-extrabold text-gray-900">Admin</h1>
        </div>
        <nav class="p-4 space-y-1">
            <!-- Đơn hàng mới -->
            <a href="#" onclick="showView('new-orders')" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Đơn hàng mới</span>
            </a>
            <!-- Thống kê -->
            <a href="#" onclick="showView('reviews')" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Thống kê</span>
            </a>
            <!-- Hóa đơn -->
            <a href="#" onclick="showView('invoices')" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Hóa đơn</span>
            </a>
            
            <!-- Đặt bàn -->
            <a href="#" onclick="showView('reservations')" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 17h.01M16 13h.01M10 17h.01M10 13h.01M14 17h.01M14 13h.01M8 17h.01M8 13h.01M3 21h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Đặt bàn</span>
            </a>
            
            <!-- Quản lý Giỏ hàng -->
            <a href="#" onclick="showView('carts')" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Quản lý Giỏ hàng</span>
            </a>

            <!-- Thực đơn -->
            <a href="#" onclick="showView('menu')" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Thực đơn</span>
            </a>

            <!-- Mặt hàng -->
            <div class="relative">
                <a href="#" onclick="showView('inventory')" class="sidebar-menu-item justify-between">
                    <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Mặt hàng</span>
                    </span>
                </a>
            </div>

            <!-- Nhân viên -->
            <a href="#" onclick="showView('staff')" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2h2m-4-7a4 4 0 100-8 4 4 0 000 8zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Nhân viên</span>
            </a>
            
            <!-- Khách hàng -->
            <a href="#" onclick="showView('customers')" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 000 8zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Khách hàng</span>
            </a>

            <!-- Hệ thống -->
            <a href="#" onclick="showView('system')" class="sidebar-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Hệ thống</span>
            </a>

            <!-- Thiết lập nhà hàng (Mục đang Hoạt động) -->
            <a href="#" onclick="showView('settings')" class="sidebar-menu-item sidebar-active-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Thiết lập nhà hàng</span>
            </a>
        </nav>
    </aside>
    
    <!-- Main content container -->
    <div class="flex-grow flex h-full main-container">
        <!-- Khu vực Quản lý Nội dung (MỚI) -->
        <div id="settings-view" class="flex-1 flex flex-col p-6 rounded-xl shadow-lg bg-white overflow-hidden">
            <h1 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Quản Lý Trang Thông Tin Nhà Hàng</h1>
            
            <!-- Tab Navigation -->
            <div class="flex space-x-6 border-b border-gray-200 mb-6">
                <button id="tab-promotions" onclick="changeContentTab('promotions')" class="py-2 px-1 text-lg text-gray-500 hover:text-indigo-600 transition duration-150 tab-active">Quản lý Tin tức/Ưu đãi</button>
                <button id="tab-featured" onclick="changeContentTab('featured')" class="py-2 px-1 text-lg text-gray-500 hover:text-indigo-600 transition duration-150">Món ăn Nổi bật</button>
                <button id="tab-basic" onclick="changeContentTab('basic')" class="py-2 px-1 text-lg text-gray-500 hover:text-indigo-600 transition duration-150">Thông tin cơ bản</button>
            </div>

            <!-- Tab Content: 1. Quản lý Tin tức/Ưu đãi -->
            <div id="promotions-tab" class="content-tab flex-grow overflow-hidden">
                <div class="flex justify-between items-center mb-4">
                    <input type="text" id="promotion-search" onkeyup="filterPromotions()" placeholder="Tìm kiếm theo Tiêu đề" class="w-1/3 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                    <button onclick="openPromoModal(null)" class="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        Thêm Tin tức/Ưu đãi
                    </button>
                </div>

                <!-- Bảng Tin tức/Ưu đãi -->
                <div class="overflow-y-auto h-full">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50 sticky top-0">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Tin</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200" id="promotion-list-body">
                            <!-- Dữ liệu sẽ được render bởi JS -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tab Content: 2. Món ăn Nổi bật -->
            <div id="featured-tab" class="content-tab hidden flex-grow p-4">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Chọn Món ăn Nổi bật (Hiển thị 3 món trên Trang chủ)</h3>
                <div id="featured-dishes-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Dữ liệu món nổi bật sẽ được render bởi JS -->
                </div>
                <div class="mt-6">
                    <button onclick="openDishSelectorModal()" class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150">
                        Thêm/Thay đổi Món nổi bật
                    </button>
                </div>
            </div>
            
            <!-- Tab Content: 3. Thông tin cơ bản -->
            <div id="basic-tab" class="content-tab hidden flex-grow p-4">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Cập nhật Thông tin Nhà hàng</h3>
                <form class="space-y-4 max-w-lg">
                    <div>
                        <label for="restaurant-name" class="block text-sm font-medium text-gray-700">Tên Nhà hàng</label>
                        <input type="text" id="restaurant-name" value="Sunset Restaurant" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label for="restaurant-address" class="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input type="text" id="restaurant-address" value="123 Đường Lãng Mạn, TP.HCM" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label for="restaurant-phone" class="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input type="tel" id="restaurant-phone" value="(028) 1234 5678" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <button type="button" onclick="alert('Đã lưu thông tin cơ bản.')" class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150">
                        Lưu Thông tin
                    </button>
                </form>
            </div>
        </div>
        
        <!-- Các View khác (Mô phỏng) -->
        <div id="new-orders-view" class="hidden"></div>
        <div id="reviews-view" class="hidden"></div>
        <div id="invoices-view" class="hidden"></div>
        <div id="reservations-view" class="hidden"></div>
        <div id="carts-view" class="hidden"></div>
        <div id="menu-view" class="hidden"></div>
        <div id="inventory-view" class="hidden"></div>
        <div id="staff-view" class="hidden"></div>
        <div id="customers-view" class="hidden"></div>
        <div id="system-view" class="hidden"></div>
    </div>

    <!-- Modal Thêm/Sửa Tin tức/Ưu đãi -->
    <div id="promo-edit-modal" class="modal fixed inset-0 justify-center items-center p-4">
        <div class="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 scale-95 opacity-0" id="promo-modal-content">
            <h3 class="text-2xl font-bold mb-4 text-gray-800 border-b pb-3" id="promo-modal-title">Thêm Tin tức/Ưu đãi Mới</h3>
            
            <form id="promotion-form" class="space-y-4">
                <input type="hidden" id="promo-id">
                
                <div>
                    <label for="promo-title" class="block text-sm font-medium text-gray-700">Tiêu đề (*)</label>
                    <input type="text" id="promo-title" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                
                <div>
                    <label for="promo-content" class="block text-sm font-medium text-gray-700">Nội dung chi tiết (*)</label>
                    <textarea id="promo-content" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="promo-date" class="block text-sm font-medium text-gray-700">Ngày đăng (*)</label>
                        <input type="date" id="promo-date" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                    <div>
                        <label for="promo-status" class="block text-sm font-medium text-gray-700">Trạng thái (*)</label>
                        <select id="promo-status" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                            <option value="draft">Bản nháp</option>
                            <option value="published">Đã xuất bản</option>
                        </select>
                    </div>
                </div>
                
                <!-- Hình ảnh thumbnail -->
                <div>
                    <label for="promo-image-url" class="block text-sm font-medium text-gray-700">URL Hình ảnh Thumbnail (Ví dụ: https://placehold.co/...)</label>
                    <input type="url" id="promo-image-url" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                </div>
            </form>

            <!-- Action buttons -->
            <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onclick="closePromoModal()" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150">Hủy</button>
                <button type="button" onclick="savePromotion()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition duration-150 shadow-md">Lưu Bài viết</button>
            </div>
        </div>
    </div>
    
    <!-- Modal Chọn Món ăn Nổi bật -->
    <div id="dish-selector-modal" class="modal fixed inset-0 justify-center items-center p-4">
        <div class="bg-white p-6 rounded-xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-95 opacity-0" id="dish-selector-modal-content">
            <h3 class="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">Chọn Món ăn Nổi bật (Tối đa 3)</h3>
            
            <div class="mb-4">
                <input type="text" id="dish-search" onkeyup="filterDishList()" placeholder="Tìm kiếm món ăn..." class="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500">
            </div>

            <div id="available-dishes-list" class="grid grid-cols-3 gap-4 h-96 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                <!-- Danh sách món ăn có sẵn sẽ được render bởi JS -->
            </div>
            
            <div class="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-700">Đã chọn: <span id="selected-dish-count" class="font-bold text-indigo-600">0</span>/3</p>
                <div class="space-x-3">
                    <button type="button" onclick="closeDishSelectorModal()" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition duration-150">Hủy</button>
                    <button type="button" onclick="saveFeaturedDishes()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition duration-150 shadow-md">Lưu Món nổi bật</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // --- Dữ liệu giả lập ---

        let promotionsData = [
            { id: 'KM001', title: 'Ưu đãi Giảm 20% Cho Thứ Ba Hàng Tuần', date: '2025-10-01', status: 'published', content: 'Giảm 20% tổng hóa đơn cho khách đặt bàn qua website vào các ngày Thứ Ba hàng tuần. Áp dụng cho mọi khu vực chỗ ngồi.', imageUrl: 'https://placehold.co/150x100/4f46e5/ffffff?text=20%25+OFF' },
            { id: 'KM002', title: 'Ra mắt Món mới: Bò Wagyu Hầm Rượu Vang', date: '2025-09-25', status: 'published', content: 'Khám phá hương vị thịt bò Wagyu tan chảy trong miệng, hầm cùng rượu vang đỏ thượng hạng.', imageUrl: 'https://placehold.co/150x100/94a3b8/ffffff?text=Wagyu' },
            { id: 'KM003', title: 'Tặng Cocktail Miễn Phí Cho Nhóm 4 Người', date: '2025-09-10', status: 'draft', content: 'Khi đặt chỗ cho nhóm 4 người trở lên, quý khách sẽ được tặng 1 ly cocktail Sunset Dream.', imageUrl: 'https://placehold.co/150x100/ef4444/ffffff?text=Cocktail' },
        ];
        
        let dishList = [
            { id: 'D001', name: 'Phở Bò Đặc Biệt', price: 65000, category: 'main', isFeatured: false },
            { id: 'D002', name: 'Gỏi Cuốn Tôm Thịt', price: 50000, category: 'appetizer', isFeatured: true },
            { id: 'D003', name: 'Cà Phê Sữa Đá', price: 25000, category: 'drink', isFeatured: false },
            { id: 'D004', name: 'Bánh Lava Socola', price: 120000, category: 'dessert', isFeatured: true },
            { id: 'D005', name: 'Lẩu Thái Tom Yum', price: 390000, category: 'hotpot', isFeatured: true },
            { id: 'D006', name: 'Bún Chả Hà Nội', price: 55000, category: 'main', isFeatured: false },
            { id: 'D007', name: 'Nước Ép Dứa Tươi', price: 45000, category: 'drink', isFeatured: false },
            { id: 'D008', name: 'Kem Vani Sốt Dâu', price: 35000, category: 'dessert', isFeatured: false },
        ];

        // --- Helper functions ---

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
        };

        const generateId = (prefix, dataArray) => {
            const lastId = dataArray.length > 0 ? parseInt(dataArray[dataArray.length - 1].id.substring(prefix.length)) : 0;
            const newIdNumber = lastId + 1;
            return prefix + newIdNumber.toString().padStart(3, '0');
        };

        // --- Logic quản lý View và Tabs ---

        let currentActiveContentTab = 'promotions'; 

        const showView = (viewId) => {
            const views = document.querySelectorAll('[id$="-view"]');
            views.forEach(view => view.classList.add('hidden'));

            const sidebarItems = document.querySelectorAll('.sidebar-menu-item');
            sidebarItems.forEach(item => item.classList.remove('sidebar-active-item'));
            
            const targetView = document.getElementById(viewId + '-view');
            if (targetView) {
                targetView.classList.remove('hidden');
            }

            const activeLink = document.querySelector(`a[onclick="showView('${viewId}')"]`);
            if (activeLink) activeLink.classList.add('sidebar-active-item');

            if (viewId === 'settings') {
                renderContentTab();
            }
        };

        const changeContentTab = (tabName) => {
            currentActiveContentTab = tabName;
            
            document.querySelectorAll('.content-tab').forEach(content => content.classList.add('hidden'));
            document.querySelectorAll('.border-b button').forEach(btn => btn.classList.remove('tab-active'));

            document.getElementById(`${tabName}-tab`).classList.remove('hidden');
            document.getElementById(`tab-${tabName}`).classList.add('tab-active');

            renderContentTab();
        };

        const renderContentTab = () => {
            if (currentActiveContentTab === 'promotions') {
                filterPromotions();
            } else if (currentActiveContentTab === 'featured') {
                renderFeaturedDishes();
            } else if (currentActiveContentTab === 'basic') {
                // Do nothing, static HTML
            }
        };
        
        // --- Tab 1: Quản lý Tin tức/Ưu đãi (Promotions) ---

        const renderPromotions = (data) => {
            const tableBody = document.getElementById('promotion-list-body');
            tableBody.innerHTML = '';
            
            data.forEach(item => {
                const statusClass = item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                const statusText = item.status === 'published' ? 'Đã xuất bản' : 'Bản nháp';
                
                const row = `
                    <tr id="promo-row-${item.id}">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">${item.title}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${item.date}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                             <span class="px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                                ${statusText}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button onclick="openPromoModal('${item.id}')" class="text-indigo-600 hover:text-indigo-900 p-1" title="Chỉnh sửa">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.111 10.155L5.793 17.207l1.414 1.414 4.685-4.685a2 2 0 00-2.828-2.828z" /></svg>
                            </button>
                            <button onclick="deletePromotion('${item.id}')" class="text-red-600 hover:text-red-900 p-1" title="Xóa">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                            </button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        };
        
        const filterPromotions = () => {
            const searchTerm = document.getElementById('promotion-search').value.toLowerCase();
            const filtered = promotionsData.filter(item => item.title.toLowerCase().includes(searchTerm) || item.id.toLowerCase().includes(searchTerm));
            renderPromotions(filtered);
        };
        
        // --- Logic Modal Tin tức/Ưu đãi ---

        const promoEditModal = document.getElementById('promo-edit-modal');
        const promoModalContent = document.getElementById('promo-modal-content');
        
        const openPromoModal = (promoId) => {
            const form = document.getElementById('promotion-form');
            form.reset();
            document.getElementById('promo-id').value = promoId || '';
            
            const modalTitle = document.getElementById('promo-modal-title');

            if (promoId) {
                const item = promotionsData.find(m => m.id === promoId);
                if (item) {
                    modalTitle.textContent = 'Chỉnh sửa Tin tức/Ưu đãi';
                    document.getElementById('promo-title').value = item.title;
                    document.getElementById('promo-content').value = item.content;
                    document.getElementById('promo-date').value = item.date;
                    document.getElementById('promo-status').value = item.status;
                    document.getElementById('promo-image-url').value = item.imageUrl || '';
                }
            } else {
                modalTitle.textContent = 'Thêm Tin tức/Ưu đãi Mới';
                    document.getElementById('promo-date').value = new Date().toISOString().slice(0, 10);
            }

            promoEditModal.classList.add('is-active');
            setTimeout(() => {
                promoModalContent.classList.remove('scale-95', 'opacity-0');
                promoModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        };

        const closePromoModal = () => {
             promoModalContent.classList.remove('scale-100', 'opacity-100');
             promoModalContent.classList.add('scale-95', 'opacity-0');
             setTimeout(() => {
                 promoEditModal.classList.remove('is-active');
             }, 300);
        };

        const savePromotion = () => {
            const id = document.getElementById('promo-id').value;
            const title = document.getElementById('promo-title').value.trim();
            const content = document.getElementById('promo-content').value.trim();
            const date = document.getElementById('promo-date').value;
            const status = document.getElementById('promo-status').value;
            const imageUrl = document.getElementById('promo-image-url').value.trim();

            if (!title || !content || !date) {
                alert("Vui lòng điền đầy đủ Tiêu đề, Nội dung và Ngày đăng.");
                return;
            }

            const newPromo = { id, title, content, date, status, imageUrl };

            if (id) {
                const index = promotionsData.findIndex(m => m.id === id);
                if (index > -1) {
                    promotionsData[index] = newPromo;
                    alert(`Đã cập nhật tin tức: ${title}.`);
                }
            } else {
                newPromo.id = generateId('KM', promotionsData);
                promotionsData.push(newPromo);
                alert(`Đã thêm tin tức mới: ${title}.`);
            }
            
            closePromoModal();
            renderContentTab(); 
        };
        
        const deletePromotion = (promoId) => {
            if (confirm(`Bạn có chắc chắn muốn xóa tin tức ${promoId} không?`)) {
                promotionsData = promotionsData.filter(m => m.id !== promoId);
                renderContentTab();
                alert(`Đã xóa tin tức ${promoId}.`);
            }
        };


        // --- Tab 2: Món ăn Nổi bật (Featured Dishes) ---

        const renderFeaturedDishes = () => {
            const container = document.getElementById('featured-dishes-container');
            container.innerHTML = '';
            
            const featuredDishes = dishList.filter(dish => dish.isFeatured);

            if (featuredDishes.length === 0) {
                 container.innerHTML = '<p class="col-span-3 text-center text-gray-500 italic py-6">Chưa có món ăn nổi bật nào được chọn.</p>';
                 return;
            }

            featuredDishes.forEach(dish => {
                const card = `
                    <div class="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-indigo-500">
                        <h4 class="font-bold text-lg text-gray-800">${dish.name}</h4>
                        <p class="text-sm text-indigo-600 font-semibold">${formatCurrency(dish.price)}</p>
                        <p class="text-xs text-gray-500 mt-1">Mã: ${dish.id} | Danh mục: ${dish.category}</p>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', card);
            });
        };
        
        // --- Logic Modal Chọn Món ăn Nổi bật ---
        
        const dishSelectorModal = document.getElementById('dish-selector-modal');
        const dishSelectorModalContent = document.getElementById('dish-selector-modal-content');
        const availableDishesList = document.getElementById('available-dishes-list');
        const selectedDishCount = document.getElementById('selected-dish-count');
        
        const openDishSelectorModal = () => {
            filterDishList(); // Load danh sách món ăn
            dishSelectorModal.classList.add('is-active');
            setTimeout(() => {
                dishSelectorModalContent.classList.remove('scale-95', 'opacity-0');
                dishSelectorModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        };
        
        const closeDishSelectorModal = () => {
            dishSelectorModalContent.classList.remove('scale-100', 'opacity-100');
            dishSelectorModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                dishSelectorModal.classList.remove('is-active');
            }, 300);
        };

        const renderDishList = (data) => {
            availableDishesList.innerHTML = '';
            let selectedCount = 0;

            data.forEach(dish => {
                const isSelected = dish.isFeatured;
                if (isSelected) selectedCount++;
                
                const cardClass = isSelected ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100';
                const checkIcon = isSelected ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 absolute top-2 right-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>` : '';

                const card = `
                    <div data-id="${dish.id}" class="relative p-3 rounded-lg shadow-sm cursor-pointer ${cardClass}" onclick="toggleFeaturedDish('${dish.id}')">
                        ${checkIcon}
                        <h4 class="font-bold text-base">${dish.name}</h4>
                        <p class="text-xs text-gray-600 mt-1">${formatCurrency(dish.price)}</p>
                    </div>
                `;
                availableDishesList.insertAdjacentHTML('beforeend', card);
            });
            selectedDishCount.textContent = selectedCount;
        };
        
        const filterDishList = () => {
            const searchTerm = document.getElementById('dish-search').value.toLowerCase();
            const filtered = dishList.filter(dish => dish.name.toLowerCase().includes(searchTerm) || dish.id.toLowerCase().includes(searchTerm));
            renderDishList(filtered);
        };

        const toggleFeaturedDish = (dishId) => {
            const dishIndex = dishList.findIndex(d => d.id === dishId);
            if (dishIndex > -1) {
                const currentFeaturedCount = dishList.filter(d => d.isFeatured).length;
                
                if (dishList[dishIndex].isFeatured) {
                    // Bỏ chọn
                    dishList[dishIndex].isFeatured = false;
                } else if (currentFeaturedCount < 3) {
                    // Chọn
                    dishList[dishIndex].isFeatured = true;
                } else {
                    alert("Chỉ được chọn tối đa 3 món ăn nổi bật.");
                }
                filterDishList(); // Render lại danh sách
            }
        };

        const saveFeaturedDishes = () => {
            const featuredCount = dishList.filter(d => d.isFeatured).length;
            if (featuredCount === 0) {
                 alert("Vui lòng chọn ít nhất 1 món ăn nổi bật.");
                 return;
            }
            alert(`Đã lưu ${featuredCount} món ăn làm nổi bật.`);
            closeDishSelectorModal();
            renderFeaturedDishes();
        };


        // Khởi tạo khi tải trang
        document.addEventListener('DOMContentLoaded', () => {
            showView('settings');
            // Mặc định gọi renderContentTab() (sẽ render tab 'promotions')
            renderContentTab(); 
        });
    </script>
</body>
</html>
