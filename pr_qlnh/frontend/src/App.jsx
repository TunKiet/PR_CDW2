import React from "react";
import { BrowserRouter as BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import React from 'react'
import './App.css'
import MenuList from "./components/MenuList";

import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import Review from './components/Review/Review'
import ReviewModerator from './components/ReviewModerator/ReviewModerator'
import Invertory from './components/Inventory/Inventory'
import IngredientInOut from './components/Inventory/IngredientInOut'
import TableManagementAdmin from './pages/TableManagementAdmin'
import InventoryOverview from './components/InventoryOverview/InventoryOverview'

// Import các component trang của bạn
import OrderPage from './pages/OrderPage';
import OrderManagementPage from './pages/OrderManagementPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import UserDashboard from './pages/Dashboard/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage';
import ForgotPassword from "./pages/ForgotPasswordPage";

//import  chức năng 08_hao
import DishTable from './components/08_hao-QLMonAn/DishTable';
import HomePage from "./components/08_hao-QLMonAn/HomePage";
import RestaurantInforManage from './components/08_hao-QLMonAn/RestaurantInforManage'
import CategoryModal from "./components/08_hao-QLMonAn/CategoryModal";
import CategoryManager from "./components/08_hao-QLMonAn/CategoryManager";
import DishModal from "./components/08_hao-QLMonAn/DishModal";
import UserChat from "./components/Chat/UserChat";
import AdminChat from "./components/Chat/AdminChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/homepage" element={<HomePage />} />
        <Route path="/dishtable" element={<DishTable />} />
        <Route path="/moderator" element={<ReviewModerator />} />


        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/review" element={<Review />} />
        <Route path="/inventory" element={<Invertory />} />
        <Route path="/export" element={<IngredientInOut />} />
        <Route path="/inventory-overview" element={<InventoryOverview />} />
        <Route path="/restaurant-info" element={<RestaurantInforManage />} />
        <Route path="/category-manager" element={<CategoryManager />} />
        <Route path="/table" element={<TableManagementAdmin />} />
        <Route path="/chat" element={<UserChat />} />
        <Route path="/admin-chat" element={<AdminChat />} />

        {/* Định tuyến cho các trang khác nhau */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/analytics' element={<UserDashboard />} />

        {/* Route cho trang Đơn Hàng Mới (tạo đơn) */}
        <Route path="/order-page" element={<OrderPage />} />


        {/* Route cho trang Quản Lý Đơn Hàng (bảng danh sách) */}
        <Route path="/order-management" element={<OrderManagementPage />} />

        {/* ROUTE MỚI: Trang Quản Lý Khách Hàng */}
        <Route path="/customers" element={<CustomerManagementPage />} />

        {/* Thêm các route khác nếu có: /invoices, /menu, ... */}
        {/* <Route path="/invoices" element={<InvoicePage />} /> */}

        {/* Route xử lý trường hợp không tìm thấy trang (404) */}
        {/* <Route path="*" element={<h1>404 - Trang không tồn tại</h1>} /> */}
      </Routes>

    </BrowserRouter>
  )
}
export default App