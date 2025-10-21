import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các component trang của bạn
import OrderPage from './pages/OrderPage'; 
import OrderManagementPage from './pages/OrderManagementPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
function App() {
  return (
    // 1. BrowserRouter bao bọc toàn bộ ứng dụng để kích hoạt định tuyến
    <BrowserRouter>
      {/* 2. Routes định nghĩa các nhóm Route */}
      <Routes>
        
        {/* Route mặc định (Trang OrderPage) */}
        <Route path="/" element={<Navigate to="/order-page" replace />} />
        
        {/* Route cho trang Đơn Hàng Mới (tạo đơn) */}
        <Route path="/order-page" element={<OrderPage />} />
        
        
        {/* Route cho trang Quản Lý Đơn Hàng (bảng danh sách) */}
        <Route path="order-management/" element={<OrderManagementPage />} />
        
        {/* ROUTE MỚI: Trang Quản Lý Khách Hàng */}
        <Route path="/customers" element={<CustomerManagementPage />} />

        {/* Thêm các route khác nếu có: /invoices, /menu, ... */}
        {/* <Route path="/invoices" element={<InvoicePage />} /> */}

        {/* Route xử lý trường hợp không tìm thấy trang (404) */}
        <Route path="*" element={<h1>404 - Trang không tồn tại</h1>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;