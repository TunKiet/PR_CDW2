// src/pages/Dashboard/StatisticDashboard.jsx
import React, { useState, useEffect } from "react";
import "./Sales_Statistics_Dashboard.css";
import Sidebar from "../../components/Sidebar";
import { BarChart2, Users, Coffee, User, Info, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

// === API CONFIGURATION ===
const API_BASE_URL = "http://127.0.0.1:8000/api/statistics";

// === HELPER FUNCTIONS ===
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

const StatisticDashboard = () => {
  // === STATES ===
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [dashboardData, setDashboardData] = useState({
    total_revenue: 0,
    total_customers: 0,
    top_dish: null,
    top_customer: null,
  });
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [topDishesData, setTopDishesData] = useState([]);
  const [comparison, setComparison] = useState({
    revenue_change_percent: 0,
    customers_change_percent: 0,
  });

  // === API CALLS ===

  // Fetch Dashboard Overview
  const fetchDashboard = async (days) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard?days=${days}`);
      const result = await response.json();

      if (result.status === "success") {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      alert("Có lỗi khi tải dữ liệu dashboard");
    }
  };

  // Fetch Revenue Chart
  const fetchRevenueChart = async (days) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/revenue-chart?days=${days}`
      );
      const result = await response.json();

      if (result.status === "success") {
        setRevenueChartData(result.data);
      }
    } catch (error) {
      console.error("Error fetching revenue chart:", error);
    }
  };

  // Fetch Top Dishes
  const fetchTopDishes = async (days) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/top-dishes?days=${days}&limit=5`
      );
      const result = await response.json();

      if (result.status === "success") {
        setTopDishesData(result.data);
      }
    } catch (error) {
      console.error("Error fetching top dishes:", error);
    }
  };

  // Fetch Comparison
  const fetchComparison = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comparison`);
      const result = await response.json();

      if (result.status === "success") {
        setComparison(result.data);
      }
    } catch (error) {
      console.error("Error fetching comparison:", error);
    }
  };

  // Load tất cả data khi component mount
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchDashboard(selectedPeriod),
        fetchRevenueChart(selectedPeriod),
        fetchTopDishes(selectedPeriod),
        fetchComparison(),
      ]);
      setIsLoading(false);
    };

    loadAllData();
  }, [selectedPeriod]);

  // === RENDER ===

  if (isLoading) {
    return (
      <div className="dish-layout">
        <Sidebar />
        <main className="dish-main">
          <div className="flex items-center justify-center h-screen">
            <p className="text-xl text-gray-500">
              Đang tải dữ liệu thống kê...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dish-layout">
      <Sidebar />

      <main className="dish-main">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Bảng Điều Khiển Thống Kê Bán Hàng
        </h1>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600 mt-1">
              Thống kê <strong>{selectedPeriod} ngày gần nhất</strong>
            </p>
          </div>

          {/* ⭐ DROPDOWN FILTER */}
          <div className="flex items-center space-x-3">
            <Calendar className="text-gray-500" size={20} />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            >
              <option value={7}>7 ngày qua</option>
              <option value={30}>30 ngày qua</option>
              <option value={90}>90 ngày qua</option>
              <option value={180}>6 tháng qua</option>
              <option value={365}>1 năm qua</option>
            </select>
          </div>
        </div>

        {/* 4 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Doanh thu */}
          <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                TỔNG DOANH THU ({selectedPeriod} NGÀY)
              </h3>
              <Info className="text-green-500" size={16} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(dashboardData.total_revenue)}
            </p>
            <p
              className={`text-sm mt-1 ${
                comparison.revenue_change_percent >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {comparison.revenue_change_percent >= 0 ? "↑" : "↓"}
              {Math.abs(comparison.revenue_change_percent)}% so với tháng trước
            </p>
          </div>

          {/* Card 2: Lượt khách */}
          <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                TỔNG LƯỢT KHÁCH ({selectedPeriod} NGÀY)
              </h3>
              <Users className="text-blue-500" size={16} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {dashboardData.total_customers} khách
            </p>
            <p
              className={`text-sm mt-1 ${
                comparison.customers_change_percent >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {comparison.customers_change_percent >= 0 ? "↑" : "↓"}
              {Math.abs(comparison.customers_change_percent)}% so với tháng
              trước
            </p>
          </div>

          {/* Card 3: Món bán chạy */}
          <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                MÓN ĂN BÁN CHẠY NHẤT
              </h3>
              <Coffee className="text-orange-500" size={16} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {dashboardData.top_dish?.name || "N/A"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Đã bán: {dashboardData.top_dish?.sold || 0} lần
            </p>
          </div>

          {/* Card 4: Khách VIP */}
          <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                KHÁCH HÀNG THÂN THIẾT (TOP 1)
              </h3>
              <User className="text-pink-500" size={16} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {dashboardData.top_customer?.name || "N/A"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Tổng chi tiêu:{" "}
              {formatCurrency(dashboardData.top_customer?.total_spent || 0)}
            </p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart - Doanh thu */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              1. Doanh Thu {selectedPeriod} Ngày Gần Nhất (Triệu đồng)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueChartData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} triệu`, "Doanh thu"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-center text-green-500 text-sm mt-2">
              • Doanh Thu
            </p>
          </div>

          {/* Bar Chart - Top món */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              2. Top 5 Món Ăn Bán Chạy (Đơn vị: Lần bán)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topDishesData} layout="vertical">
                <CartesianGrid stroke="#e5e7eb" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="sold" fill="#000" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-gray-600 text-sm mt-2">
              ▪ Số Lượng Bán
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatisticDashboard;
