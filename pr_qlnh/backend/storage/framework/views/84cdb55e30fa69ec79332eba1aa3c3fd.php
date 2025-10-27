<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nhà Hàng D</title>
    <!-- Tải Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Cấu hình Tailwind cho font Inter -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f7f7f7; /* Nền nhẹ nhàng */
        }
        .menu-item-card {
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .menu-item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        /* Style cho Modal */
        .modal {
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(2px);
        }
    </style>
</head>
<body>

    <!-- Thanh Điều Hướng (Navbar) -->
    <nav class="sticky top-0 z-50 bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <!-- Logo Nhà Hàng -->
                <div class="flex-shrink-0">
                    <a href="#home" class="text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-300">Nhà hàng D</a>
                </div>
                
                <!-- Menu Desktop -->
                <div class="hidden md:flex space-x-8 items-center">
                    <a href="#home" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition duration-300">Trang chủ</a>
                    <a href="#menu" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition duration-300">Thực đơn</a>
                    <a href="#promotions" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium transition duration-300">Ưu đãi</a>
                    <!-- Biểu tượng Giỏ hàng -->
                    <button id="cart-button-desktop" class="relative p-2 rounded-full text-gray-600 hover:text-blue-600 focus:outline-none transition duration-300">
                        <svg class="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span id="cart-count-desktop" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">0</span>
                    </button>
                    <!-- Nút Đặt bàn (Xanh dương) -->
                    <a href="#reservation" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-300 shadow-md">Đặt bàn</a>
                </div>
                
                <!-- Nút Menu Mobile (Thêm Giỏ hàng cho Mobile) -->
                <div class="md:hidden flex items-center space-x-3">
                     <!-- Biểu tượng Giỏ hàng Mobile -->
                    <button id="cart-button-mobile" class="relative p-2 rounded-full text-gray-600 hover:text-blue-600 focus:outline-none transition duration-300">
                        <svg class="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span id="cart-count-mobile" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">0</span>
                    </button>
                    <button id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Menu Mobile (Ẩn/Hiện) -->
        <div id="mobile-menu" class="hidden md:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                <a href="#home" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition duration-300">Trang chủ</a>
                <a href="#menu" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition duration-300">Thực đơn</a>
                <a href="#promotions" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition duration-300">Ưu đãi</a>
                <!-- Nút Đặt bàn mobile (Xanh dương) -->
                <a href="#reservation" class="block bg-blue-600 text-white px-3 py-2 mx-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-300">Đặt bàn</a>
            </div>
        </div>
    </nav>

    <!-- Thông báo tùy chỉnh (thay thế alert) -->
    <div id="custom-message" class="fixed top-20 right-4 z-50 hidden p-4 rounded-lg shadow-lg text-white font-bold transition-transform duration-300 transform translate-x-full" role="alert">
        <!-- Nội dung thông báo -->
    </div>

    <!-- 1. TRANG CHỦ (Home) -->
    <section id="home" class="relative bg-cover bg-center h-screen flex items-center justify-center" style="background-image: url('https://placehold.co/1920x1080/4F46E5/ffffff?text=Sunset+Restaurant+View');">
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="text-center z-10 p-4">
            <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-4 animate-fadeIn">Sunset Restaurant</h1>
            <p class="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">Nơi hương vị tinh hoa giao thoa cùng không gian lãng mạn.</p>
            <!-- Nút Khám phá (Xanh dương) -->
            <a href="#menu" class="bg-blue-600 text-white text-xl font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 shadow-xl">Khám Phá Thực Đơn</a>
        </div>
    </section>

    <!-- 2. THỰC ĐƠN (Menu) -->
    <section id="menu" class="py-12 md:py-20 max-w-7xl mx-auto px-4">
        <!-- Đường viền tiêu đề (Xanh dương) -->
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-12 border-b-4 border-blue-600 inline-block pb-1">Thực Đơn Tinh Hoa</h2>

        <!-- Bộ Lọc Danh Mục -->
        <div id="menu-categories" class="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
            <!-- Nút lọc được tạo bởi JS -->
        </div>

        <!-- Danh Sách Món Ăn -->
        <div id="menu-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Món 1: Gỏi Cuốn Tôm Thịt -->
            <div data-category="khai-vi" data-id="gc-tomthit" data-name="Gỏi Cuốn Tôm Thịt" data-price="95000" class="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden">
                <img src="https://placehold.co/600x400/8d8b8b/ffffff?text=Khai+Vị+Gỏi" onerror="this.src='https://placehold.co/600x400/8d8b8b/ffffff?text=Khai+Vị+Gỏi'" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Gỏi Cuốn Tôm Thịt</h3>
                    <p class="text-blue-600 text-lg font-semibold mb-4">95.000 VNĐ</p>
                    <p class="text-gray-600 text-sm mb-4">Tôm tươi, thịt luộc, bún, rau thơm cuộn trong bánh tráng mỏng, chấm sốt đậu phộng đặc trưng.</p>
                    <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        🛒 Đặt món
                    </button>
                </div>
            </div>

            <!-- Món 2: Bò Wagyu Áp Chảo -->
            <div data-category="mon-chinh" data-id="bo-wagyu" data-name="Bò Wagyu Áp Chảo" data-price="680000" class="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden">
                <img src="https://placehold.co/600x400/b84141/ffffff?text=Món+Chính+Bò" onerror="this.src='https://placehold.co/600x400/b84141/ffffff?text=Món+Chính+Bò'" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Bò Wagyu Áp Chảo</h3>
                    <p class="text-blue-600 text-lg font-semibold mb-4">680.000 VNĐ</p>
                    <p class="text-gray-600 text-sm mb-4">Thịt bò Wagyu cao cấp áp chảo, dùng kèm sốt tiêu xanh và măng tây nướng bơ tỏi.</p>
                    <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        🛒 Đặt món
                    </button>
                </div>
            </div>
            
            <!-- Món 3: Bánh Lava Socola -->
            <div data-category="trang-mieng" data-id="blv-socola" data-name="Bánh Lava Socola" data-price="120000" class="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden">
                <img src="https://placehold.co/600x400/524898/ffffff?text=Tráng+Miệng+Bánh" onerror="this.src='https://placehold.co/600x400/524898/ffffff?text=Tráng+Miệng+Bánh'" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Bánh Lava Socola</h3>
                    <p class="text-blue-600 text-lg font-semibold mb-4">120.000 VNĐ</p>
                    <p class="text-gray-600 text-sm mb-4">Bánh socola nóng chảy bên trong, dùng kèm kem vani lạnh và sốt dâu tây tươi.</p>
                    <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        🛒 Đặt món
                    </button>
                </div>
            </div>
            
            <!-- Món 4: Lẩu Thái Tom Yum -->
            <div data-category="lau" data-id="lt-tomyum" data-name="Lẩu Thái Tom Yum (2 người)" data-price="390000" class="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden">
                <img src="https://placehold.co/600x400/40916c/ffffff?text=Lẩu+Hải+Sản" onerror="this.src='https://placehold.co/600x400/40916c/ffffff?text=Lẩu+Hải+Sản'" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Lẩu Thái Tom Yum</h3>
                    <p class="text-blue-600 text-lg font-semibold mb-4">390.000 VNĐ (Phần 2 người)</p>
                    <p class="text-gray-600 text-sm mb-4">Nước lẩu chua cay đậm đà, kết hợp hải sản tươi ngon và rau nấm.</p>
                    <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        🛒 Đặt món
                    </button>
                </div>
            </div>

            <!-- Món 5: Nước Ép Nhiệt Đới -->
            <div data-category="do-uong" data-id="ep-nhietdoi" data-name="Nước Ép Nhiệt Đới" data-price="55000" class="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden">
                <img src="https://placehold.co/600x400/60a5fa/ffffff?text=Nước+Ép+Dứa" onerror="this.src='https://placehold.co/600x400/60a5fa/ffffff?text=Nước+Ép+Dứa'" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Nước Ép Nhiệt Đới</h3>
                    <p class="text-blue-600 text-lg font-semibold mb-4">55.000 VNĐ</p>
                    <p class="text-gray-600 text-sm mb-4">Hỗn hợp dứa, cam, chanh dây tươi mát, cung cấp vitamin cho cơ thể.</p>
                    <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        🛒 Đặt món
                    </button>
                </div>
            </div>

            <!-- Món 6: Bánh Mì Bơ Tỏi -->
            <div data-category="mon-khac" data-id="bmi-botỏi" data-name="Bánh Mì Bơ Tỏi" data-price="45000" class="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden">
                <img src="https://placehold.co/600x400/fbb02d/ffffff?text=Món+Ăn+Kèm" onerror="this.src='https://placehold.co/600x400/fbb02d/ffffff?text=Món+Ăn+Kèm'" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Bánh Mì Bơ Tỏi</h3>
                    <p class="text-blue-600 text-lg font-semibold mb-4">45.000 VNĐ</p>
                    <p class="text-gray-600 text-sm mb-4">Bánh mì baguette nướng giòn với bơ và tỏi tươi, thơm lừng.</p>
                    <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        🛒 Đặt món
                    </button>
                </div>
            </div>
            
            <!-- Món 7: Cá Hồi Nướng Sốt Chanh Dây -->
             <div data-category="mon-chinh" data-id="cahoi-sotchanh" data-name="Cá Hồi Nướng Sốt Chanh Dây" data-price="280000" class="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden">
                <img src="https://placehold.co/600x400/40916c/ffffff?text=Cá+Hồi+Sốt+Chanh" onerror="this.src='https://placehold.co/600x400/40916c/ffffff?text=Cá+Hồi+Sốt+Chanh'" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Cá Hồi Nướng Sốt Chanh Dây</h3>
                    <p class="text-blue-600 text-lg font-semibold mb-4">280.000 VNĐ</p>
                    <p class="text-gray-600 text-sm mb-4">Cá hồi Nauy nướng da giòn, ăn kèm salad rocket và sốt chanh dây béo ngậy.</p>
                    <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        🛒 Đặt món
                    </button>
                </div>
            </div>

            <!-- Món 8: Blue Ocean Cocktail -->
            <div data-category="do-uong" data-id="cocktail-blue" data-name="Blue Ocean Cocktail" data-price="150000" class="menu-item-card bg-white rounded-xl shadow-lg overflow-hidden">
                <img src="https://placehold.co/600x400/60a5fa/ffffff?text=Cocktail+Blue" onerror="this.src='https://placehold.co/600x400/60a5fa/ffffff?text=Cocktail+Blue'" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Blue Ocean Cocktail</h3>
                    <p class="text-blue-600 text-lg font-semibold mb-4">150.000 VNĐ</p>
                    <p class="text-gray-600 text-sm mb-4">Sự kết hợp hoàn hảo giữa rượu rum, curaçao xanh và nước ép dứa tươi.</p>
                    <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        🛒 Đặt món
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- 3. ƯU ĐÃI (Promotions) - Giữ nguyên -->
    <section id="promotions" class="py-12 md:py-20 bg-gray-100 px-4">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-4xl font-bold text-center text-gray-800 mb-12 border-b-4 border-blue-600 inline-block pb-1">Ưu Đãi Đặc Biệt</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-600">
                    <h3 class="text-2xl font-bold text-blue-600 mb-3">Giảm 20% Cho Thứ Ba</h3>
                    <p class="text-gray-700">Giảm 20% tổng hóa đơn cho khách đặt bàn qua website vào các ngày Thứ Ba hàng tuần. Áp dụng cho mọi khu vực chỗ ngồi.</p>
                    <p class="mt-4 text-sm text-gray-500">Áp dụng từ 18:00 - 21:00.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-600">
                    <h3 class="text-2xl font-bold text-blue-600 mb-3">Tặng Cocktail Đặc Trưng</h3>
                    <p class="text-gray-700">Tặng ngay 1 ly cocktail "Sunset Dream" đặc trưng khi đặt chỗ cho nhóm 4 người trở lên.</p>
                    <p class="mt-4 text-sm text-gray-500">Không áp dụng đồng thời với ưu đãi giảm giá.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-600">
                    <h3 class="text-2xl font-bold text-blue-600 mb-3">Miễn Phí Phòng VIP</h3>
                    <p class="text-gray-700">Miễn phí phí sử dụng Phòng VIP cho hóa đơn trên 5.000.000 VNĐ. Thích hợp cho các buổi tiệc riêng tư.</p>
                    <p class="mt-4 text-sm text-gray-500">Cần đặt trước 48 giờ để xác nhận.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 4. ĐẶT BÀN (Reservation) -->
    <section id="reservation" class="py-12 md:py-20 max-w-4xl mx-auto px-4">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-12 border-b-4 border-blue-600 inline-block pb-1">Đặt Bàn Ngay</h2>
        <div class="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-100">
            <form id="reservation-form">
                <!-- HIDDEN INPUT CHO PRE-ORDER DATA -->
                <input type="hidden" id="pre-order-items" name="pre_order_items">
                <input type="hidden" id="pre-order-total" name="pre_order_total" value="0">
                <input type="hidden" id="pre-order-deposit" name="pre_order_deposit" value="0">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Tên -->
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Tên của bạn (*)</label>
                        <input type="text" id="name" name="name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150" placeholder="Nguyễn Văn A">
                    </div>
                    <!-- Số điện thoại -->
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại (*)</label>
                        <input type="tel" id="phone" name="phone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150" placeholder="090 123 4567">
                    </div>
                    <!-- Email -->
                    <div class="md:col-span-2">
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="email" name="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150" placeholder="email@example.com">
                    </div>
                    <!-- Ngày đặt -->
                    <div>
                        <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Ngày đặt (*)</label>
                        <input type="date" id="date" name="date" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    </div>
                    <!-- Giờ đặt -->
                    <div>
                        <label for="time" class="block text-sm font-medium text-gray-700 mb-1">Giờ đặt (*)</label>
                        <input type="time" id="time" name="time" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                    </div>
                    <!-- Số lượng khách -->
                    <div class="md:col-span-2">
                        <label for="guests" class="block text-sm font-medium text-gray-700 mb-1">Số lượng khách (*)</label>
                        <input type="number" id="guests" name="guests" min="1" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150" placeholder="Ví dụ: 4">
                    </div>
                </div>

                <!-- Khu vực chỗ ngồi -->
                <fieldset class="mt-6">
                    <legend class="text-sm font-medium text-gray-700 mb-2">Khu vực chỗ ngồi (*)</legend>
                    <div class="mt-2 space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        <label class="flex items-center">
                            <input type="radio" name="seating_area" value="Trong nhà" required class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
                            <span class="ml-3 block text-sm font-medium text-gray-700">Trong nhà</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="seating_area" value="Ngoài trời" required class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
                            <span class="ml-3 block text-sm font-medium text-gray-700">Ngoài trời</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="seating_area" value="Phòng VIP" required class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
                            <span class="ml-3 block text-sm font-medium text-gray-700">Phòng VIP</span>
                        </label>
                    </div>
                </fieldset>

                 <!-- MỤC TÓM TẮT ĐẶT MÓN TRƯỚC -->
                <div id="pre-order-summary" class="mt-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hidden">
                    <h3 class="text-lg font-bold text-blue-800 mb-2">🍽️ Tóm Tắt Đặt Món Trước</h3>
                    <div class="text-sm text-gray-700 space-y-1">
                        <p>Tổng giá trị đơn hàng: <span id="pre-order-total-display" class="font-bold text-blue-600">0 VNĐ</span></p>
                        <p>Cần thanh toán trước (50%): <span id="pre-order-deposit-display" class="font-bold text-red-600">0 VNĐ</span></p>
                        <p class="text-xs text-gray-500 mt-2 italic">*Sau khi gửi, bạn sẽ được chuyển đến trang thanh toán cọc.</p>
                    </div>
                </div>


                <!-- Ghi chú -->
                <div class="mt-6">
                    <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Yêu cầu đặc biệt)</label>
                    <textarea id="notes" name="notes" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150" placeholder="Ví dụ: Cần ghế trẻ em, bàn khu vực yên tĩnh, ..."></textarea>
                </div>

                <!-- Nút Submit (Xanh dương) -->
                <div class="mt-8">
                    <button type="submit" id="submit-reservation-btn" class="w-full bg-blue-600 text-white text-xl font-bold py-3 rounded-xl hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-[1.01]">
                        Gửi Yêu Cầu Đặt Bàn
                    </button>
                </div>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 text-center text-sm">
            <p>&copy; 2024 Sunset Restaurant. Tất cả bản quyền thuộc về nhà hàng.</p>
            <p class="mt-2">Địa chỉ: 123 Đường Lãng Mạn, TP.HCM | Điện thoại: (028) 1234 5678</p>
        </div>
    </footer>


    <!-- MODAL GIỎ HÀNG -->
    <div id="cart-modal" class="modal fixed inset-0 z-[100] hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300">
            <!-- Header Modal -->
            <div class="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-2xl font-bold text-gray-800">🛒 Giỏ Hàng Món Ăn</h3>
                <button id="close-cart-modal" class="text-gray-400 hover:text-gray-600 transition">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- Nội dung Giỏ hàng -->
            <div class="p-6">
                <div id="cart-items-container" class="space-y-4">
                    <p id="empty-cart-message" class="text-gray-500 text-center py-4 hidden">Giỏ hàng của bạn đang trống.</p>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-200 space-y-2">
                    <div class="flex justify-between text-lg font-semibold text-gray-800">
                        <span>Tổng Giá Trị Đơn Hàng:</span>
                        <span id="cart-total-display" class="text-blue-600">0 VNĐ</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold text-red-600">
                        <span>Thanh Toán Trước (50%):</span>
                        <span id="cart-deposit-display">0 VNĐ</span>
                    </div>
                </div>
            </div>

            <!-- Footer Modal (Nút hành động) -->
            <div class="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200">
                <button id="proceed-to-reservation-btn" class="w-full bg-red-600 text-white text-lg font-bold py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md disabled:bg-red-400" disabled>
                    Tiến Hành Đặt Bàn (Đã Kèm Món)
                </button>
            </div>
        </div>
    </div>
    
    <!-- MODAL THANH TOÁN MÔ PHỎNG (MỚI) -->
    <div id="payment-modal" class="modal fixed inset-0 z-[110] hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all duration-300">
            <div class="bg-blue-600 text-white p-6 rounded-t-xl">
                <h3 class="text-2xl font-bold text-center">💳 Thanh Toán Xác Nhận Đơn Hàng</h3>
            </div>
            <div class="p-6 space-y-4">
                <p class="text-center text-lg text-gray-700 font-semibold">Để xác nhận Đặt Bàn & Đặt Món trước, vui lòng thanh toán tiền cọc 50%.</p>
                
                <div class="border p-4 rounded-lg bg-gray-50 space-y-1">
                    <div class="flex justify-between text-gray-600">
                        <span>Tổng giá trị món ăn:</span>
                        <span id="payment-total-value" class="font-medium">0 VNĐ</span>
                    </div>
                    <div class="flex justify-between text-xl font-bold text-red-600 border-t pt-2 mt-2 border-red-200">
                        <span>Số tiền cọc (50%):</span>
                        <span id="payment-deposit-value">0 VNĐ</span>
                    </div>
                </div>
                
                <p class="text-sm text-gray-500 italic text-center">Chọn phương thức thanh toán mô phỏng:</p>
                
                <button class="w-full bg-green-500 text-white text-lg font-bold py-3 rounded-lg hover:bg-green-600 transition duration-300 shadow-md payment-option-btn">
                    Thanh toán qua Ví điện tử (Mô phỏng)
                </button>
                <button class="w-full bg-purple-500 text-white text-lg font-bold py-3 rounded-lg hover:bg-purple-600 transition duration-300 shadow-md payment-option-btn">
                    Thanh toán bằng Thẻ (Mô phỏng)
                </button>
            </div>
             <div class="bg-gray-100 p-4 rounded-b-xl text-center">
                 <button id="close-payment-modal" class="text-gray-500 hover:text-gray-700 text-sm">Hủy bỏ và quay lại</button>
            </div>
        </div>
    </div>
<!-- CHATBOX HTML -->
    <!-- NÚT CHAT NỔI (Floating Chat Button) -->
    <button id="open-chat-btn" class="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition duration-300 transform hover:scale-105">
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </button>

    <!-- MODAL CHAT (Chat Modal) -->
    <div id="chat-modal" class="chat-modal fixed bottom-20 right-6 z-50 hidden w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col transform scale-95 opacity-0">
        <!-- Chat Header -->
        <div class="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span class="font-bold">Hỗ trợ Nhà hàng D</span>
            <button id="close-chat-btn" class="text-white hover:text-gray-200">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Chat Body -->
        <div id="chat-body" class="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
            <!-- Tin nhắn mẫu -->
            <div class="flex justify-start">
                <div class="bg-gray-200 text-gray-800 p-3 rounded-xl rounded-tl-none max-w-[80%] shadow-sm text-sm">
                    Chào bạn! Chúng tôi là đội ngũ Nhà hàng D. Bạn cần hỗ trợ gì về đặt bàn hay thực đơn không?
                </div>
            </div>
        </div>

        <!-- Chat Footer (Input) -->
        <div class="p-3 border-t border-gray-200 bg-white">
            <div class="flex space-x-2">
                <input type="text" id="chat-input" placeholder="Nhập tin nhắn..." class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm">
                <button id="send-chat-btn" class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- JavaScript cho tương tác -->
    <script>
        // Hàm định dạng tiền tệ VNĐ
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        };
        
        document.addEventListener('DOMContentLoaded', () => {
            // -----------------------------------------------------
            // 1. Khai báo biến & Logic chung
            // -----------------------------------------------------
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const customMessage = document.getElementById('custom-message');
            const reservationForm = document.getElementById('reservation-form');
            const submitReservationBtn = document.getElementById('submit-reservation-btn');
            
            // Cart & Modal Cart
            let cart = []; // Mảng chứa các món ăn trong giỏ { id, name, price, quantity }
            const cartButtons = document.querySelectorAll('.add-to-cart-btn');
            const cartModal = document.getElementById('cart-modal');
            const cartItemContainer = document.getElementById('cart-items-container');
            const cartTotalDisplay = document.getElementById('cart-total-display');
            const cartDepositDisplay = document.getElementById('cart-deposit-display');
            const cartCountDesktop = document.getElementById('cart-count-desktop');
            const cartCountMobile = document.getElementById('cart-count-mobile');
            const emptyCartMessage = document.getElementById('empty-cart-message');
            const proceedToReservationBtn = document.getElementById('proceed-to-reservation-btn');
            const preOrderSummary = document.getElementById('pre-order-summary');
            
            // Payment Modal
            const paymentModal = document.getElementById('payment-modal');
            const paymentTotalValue = document.getElementById('payment-total-value');
            const paymentDepositValue = document.getElementById('payment-deposit-value');
            const paymentOptionBtns = document.querySelectorAll('.payment-option-btn');
            const closePaymentModalBtn = document.getElementById('close-payment-modal');

            // CHATBOX VARIABLES
            const openChatBtn = document.getElementById('open-chat-btn');
            const closeChatBtn = document.getElementById('close-chat-btn');
            const chatModal = document.getElementById('chat-modal');
            const chatBody = document.getElementById('chat-body');
            const chatInput = document.getElementById('chat-input');
            const sendChatBtn = document.getElementById('send-chat-btn');
            // Logic Menu Mobile (Giữ nguyên)
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });

            // Hàm hiển thị thông báo tùy chỉnh
            function showCustomMessage(message, isSuccess = true) {
                customMessage.textContent = message;
                customMessage.classList.remove('hidden', 'bg-red-500', 'bg-green-500', 'translate-x-full');
                customMessage.classList.add(isSuccess ? 'bg-green-500' : 'bg-red-500', 'translate-x-0'); 

                setTimeout(() => {
                    customMessage.classList.remove('translate-x-0');
                    customMessage.classList.add('translate-x-full');
                    setTimeout(() => customMessage.classList.add('hidden'), 300);
                }, 4000);
            }
            
            // Đặt giá trị mặc định cho Ngày đặt & Giờ đặt
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('date').setAttribute('min', today);
            document.getElementById('time').value = '19:00'; 

            // -----------------------------------------------------
            // 2. Logic Giỏ Hàng (Cart)
            // -----------------------------------------------------

            // Mở/Đóng Modal Giỏ hàng (Đã cập nhật: Gọi renderCart() trước khi mở)
            document.getElementById('cart-button-desktop').addEventListener('click', () => { 
                renderCart();
                cartModal.classList.remove('hidden'); 
            });
            document.getElementById('cart-button-mobile').addEventListener('click', () => { 
                renderCart();
                cartModal.classList.remove('hidden'); 
            });
            document.getElementById('close-cart-modal').addEventListener('click', () => { cartModal.classList.add('hidden'); });
            cartModal.addEventListener('click', (e) => { if (e.target === cartModal) { cartModal.classList.add('hidden'); } });

            // Hàm cập nhật tổng tiền
            function updateCartTotals() {
                let total = 0;
                cart.forEach(item => { total += item.price * item.quantity; });
                const deposit = Math.ceil(total * 0.5); // Làm tròn lên cho tiền cọc

                cartTotalDisplay.textContent = formatCurrency(total);
                cartDepositDisplay.textContent = formatCurrency(deposit);
                cartCountDesktop.textContent = cart.length;
                cartCountMobile.textContent = cart.length;
                
                proceedToReservationBtn.disabled = cart.length === 0;
                emptyCartMessage.classList.toggle('hidden', cart.length > 0);

                // Cập nhật button Đặt bàn (tùy thuộc có đặt món hay không)
                if (cart.length > 0) {
                    submitReservationBtn.textContent = 'Gửi Yêu Cầu Đặt Bàn & Thanh Toán';
                } else {
                    submitReservationBtn.textContent = 'Gửi Yêu Cầu Đặt Bàn';
                }

                // Cập nhật tóm tắt trong form (cho trường hợp khách thêm/bớt món sau khi đã chuyển sang form)
                document.getElementById('pre-order-total-display').textContent = formatCurrency(total);
                document.getElementById('pre-order-deposit-display').textContent = formatCurrency(deposit);
                
                // Cập nhật hidden fields
                document.getElementById('pre-order-items').value = JSON.stringify(cart);
                document.getElementById('pre-order-total').value = total;
                document.getElementById('pre-order-deposit').value = deposit;

                preOrderSummary.classList.toggle('hidden', total === 0);

                return { total, deposit };
            }

            // Hàm render lại giỏ hàng (giữ nguyên)
            function renderCart() {
                cartItemContainer.innerHTML = '';
                
                if (cart.length === 0) { updateCartTotals(); return; }

                cart.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm';
                    itemElement.innerHTML = `
                        <div class="flex-1 min-w-0">
                            <p class="font-bold text-gray-800 truncate">${item.name}</p>
                            <p class="text-sm text-blue-600">${formatCurrency(item.price)}</p>
                        </div>
                        <div class="flex items-center space-x-3 ml-4">
                            <button data-id="${item.id}" data-action="decrease" class="cart-qty-btn bg-gray-200 text-gray-700 w-6 h-6 rounded-full hover:bg-gray-300 transition">-</button>
                            <span class="font-bold text-gray-800 w-4 text-center">${item.quantity}</span>
                            <button data-id="${item.id}" data-action="increase" class="cart-qty-btn bg-blue-100 text-blue-600 w-6 h-6 rounded-full hover:bg-blue-200 transition">+</button>
                            <button data-id="${item.id}" data-action="remove" class="cart-qty-btn text-red-500 hover:text-red-700 transition ml-2">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    `;
                    cartItemContainer.appendChild(itemElement);
                });

                document.querySelectorAll('.cart-qty-btn').forEach(btn => {
                    btn.addEventListener('click', handleCartAction);
                });
                updateCartTotals();
            }

            // Hàm xử lý hành động trong giỏ (tăng/giảm/xóa)
            function handleCartAction(e) {
                const button = e.currentTarget;
                const itemId = button.getAttribute('data-id');
                const action = button.getAttribute('data-action');
                
                const itemIndex = cart.findIndex(item => item.id === itemId);
                if (itemIndex > -1) {
                    if (action === 'increase') {
                        cart[itemIndex].quantity += 1;
                    } else if (action === 'decrease') {
                        cart[itemIndex].quantity -= 1;
                        if (cart[itemIndex].quantity <= 0) {
                            cart.splice(itemIndex, 1);
                        }
                    } else if (action === 'remove') {
                        cart.splice(itemIndex, 1);
                    }
                }
                renderCart();
            }

            // Thêm món ăn vào giỏ (Đã cập nhật: Gọi renderCart() để cập nhật danh sách)
            cartButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const itemElement = e.target.closest('.menu-item-card');
                    const itemId = itemElement.getAttribute('data-id');
                    const itemName = itemElement.getAttribute('data-name');
                    const itemPrice = parseInt(itemElement.getAttribute('data-price'));

                    const existingItem = cart.find(item => item.id === itemId);

                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
                    }

                    showCustomMessage(`Đã thêm 1 x ${itemName} vào giỏ hàng!`, true);
                    renderCart(); // Gọi renderCart để cập nhật cả totals và danh sách món ăn
                });
            });

            // Nút "Tiến Hành Đặt Bàn (Đã Kèm Món)"
            proceedToReservationBtn.addEventListener('click', () => {
                cartModal.classList.add('hidden');
                document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
                // Đảm bảo tóm tắt được hiển thị khi chuyển từ giỏ hàng
                updateCartTotals();
            });
            
            // -----------------------------------------------------
            // 3. Logic Thanh Toán Mô Phỏng (MỚI)
            // -----------------------------------------------------
            
            let currentReservationData = {}; // Lưu dữ liệu đặt bàn tạm thời

            function showPaymentModal(data) {
                currentReservationData = data;
                
                const total = parseInt(data.pre_order_total);
                const deposit = parseInt(data.pre_order_deposit);
                
                paymentTotalValue.textContent = formatCurrency(total);
                paymentDepositValue.textContent = formatCurrency(deposit);
                
                paymentModal.classList.remove('hidden');
            }
            // -----------------------------------------------------
            // 5. Logic Chatbox Mô Phỏng
            // -----------------------------------------------------

            // Mở Chat Modal
            openChatBtn.addEventListener('click', () => {
                chatModal.classList.remove('hidden', 'scale-95', 'opacity-0');
                chatModal.classList.add('scale-100', 'opacity-100');
                openChatBtn.classList.add('hidden');
                chatBody.scrollTop = chatBody.scrollHeight;
            });

            // Đóng Chat Modal
            closeChatBtn.addEventListener('click', () => {
                chatModal.classList.remove('scale-100', 'opacity-100');
                chatModal.classList.add('scale-95', 'opacity-0');
                openChatBtn.classList.remove('hidden');
                setTimeout(() => chatModal.classList.add('hidden'), 300);
            });

            // Xử lý khi khách hàng "Thanh toán"
            paymentOptionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    paymentModal.classList.add('hidden');
                    
                    // Gửi thông báo thành công sau khi thanh toán cọc
                    const depositAmount = formatCurrency(parseInt(currentReservationData.pre_order_deposit));
                    showCustomMessage(
                        `✅ Thanh toán cọc ${depositAmount} thành công! Đơn hàng & Đặt bàn của bạn đã được xác nhận! Mã đơn hàng: R${Date.now().toString().slice(-6)}`,
                        true
                    );
                    
                    // Reset mọi thứ sau khi thanh toán và xác nhận
                    reservationForm.reset();
                    cart = [];
                    updateCartTotals(); // Cập nhật lại UI giỏ hàng và form
                });
            });

            // Xử lý khi hủy thanh toán
            closePaymentModalBtn.addEventListener('click', () => {
                paymentModal.classList.add('hidden');
                showCustomMessage('Bạn đã hủy thanh toán. Yêu cầu đặt món trước chưa được gửi đi. Vui lòng thử lại.', false);
            });


            // -----------------------------------------------------
            // 4. Logic Form Đặt Bàn (Đã chỉnh sửa)
            // -----------------------------------------------------
            
            reservationForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Kiểm tra validation đơn giản (dựa vào required attribute)
                if (!reservationForm.checkValidity()) {
                     showCustomMessage('Vui lòng điền đầy đủ các trường có dấu (*).', false);
                     return;
                }
                
                const formData = new FormData(reservationForm);
                const reservationData = {};
                formData.forEach((value, key) => {
                    reservationData[key] = value;
                });
                
                const preOrderTotal = parseInt(reservationData.pre_order_total || '0');

                if (preOrderTotal > 0) {
                    // SCENARIO 1: CÓ ĐẶT MÓN TRƯỚC -> CHUYỂN SANG THANH TOÁN
                    console.log("Dữ liệu Đặt Bàn & Đặt Món:", reservationData);
                    showPaymentModal(reservationData);

                } else {
                    // SCENARIO 2: CHỈ ĐẶT BÀN THÔNG THƯỜNG
                    console.log("Dữ liệu Đặt Bàn thông thường:", reservationData);
                    
                    showCustomMessage(
                        `✅ Đặt bàn thành công cho ngày ${reservationData.date} lúc ${reservationData.time} (Không đặt món trước). Chúng tôi sẽ liên hệ xác nhận.`,
                        true
                    );
                    
                    // Reset form sau khi đặt bàn thường
                    reservationForm.reset();
                }
            });
            
            // Khởi tạo giỏ hàng khi tải trang
            renderCart();
        });
    </script>
</body>
</html>
<?php /**PATH /var/www/resources/views/welcome.blade.php ENDPATH**/ ?>