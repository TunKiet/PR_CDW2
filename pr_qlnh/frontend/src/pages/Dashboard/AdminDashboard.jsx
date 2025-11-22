// src/pages/Dashboard/StatisticDashboard.jsx
import React from "react";
import './Sales_Statistics_Dashboard.css';
import Sidebar from "../../components/Sidebar";
import {
  BarChart2,
  Users,
  Coffee,
  User,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { name: "13 thg 9", value: 38 },
  { name: "18 thg 9", value: 32 },
  { name: "23 thg 9", value: 28 },
  { name: "28 thg 9", value: 30 },
  { name: "3 thg 10", value: 25 },
  { name: "9 thg 10", value: 22 },
  { name: "15 thg 10", value: 20 },
];

const topFoods = [
  { name: "Phở Bò", sold: 450 },
  { name: "Bún Chả", sold: 370 },
  { name: "Bánh Mì", sold: 330 },
  { name: "Gỏi Cuốn", sold: 290 },
  { name: "Cơm Tấm", sold: 250 },
];

const StatisticDashboard = () => {
  return (
    <div className="dish-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="dish-main">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Bảng Điều Khiển Thống Kê Bán Hàng
        </h1>
        <p className="text-gray-600 mt-1 mb-8">
          <strong>“Thống kê”</strong>.
        </p>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                TỔNG DOANH THU (30 NGÀY)
              </h3>
              <Info className="text-green-500" size={16} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              819.216.408 đ
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Mục tiêu tháng: 1 tỷ
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                TỔNG LƯỢT KHÁCH (30 NGÀY)
              </h3>
              <Users className="text-blue-500" size={16} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">2.324 khách</p>
            <p className="text-sm text-gray-500 mt-1">
              Tăng 12% so với tháng trước
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                MÓN ĂN BÁN CHẠY NHẤT
              </h3>
              <Coffee className="text-orange-500" size={16} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">Phở Bò</p>
            <p className="text-sm text-gray-500 mt-1">Đã bán: 450 lần</p>
          </div>

          <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                KHÁCH HÀNG THÂN THIẾT (TOP 1)
              </h3>
              <User className="text-pink-500" size={16} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              Nguyễn Văn A
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Tổng chi tiêu: 7.500.000 đ
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line chart */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              1. Doanh Thu 30 Ngày Gần Nhất
            </h2>
            <LineChart width={500} height={250} data={revenueData}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
            <p className="text-center text-green-500 text-sm mt-2">
              • Doanh Thu
            </p>
          </div>

          {/* Bar chart */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              2. Top 5 Món Ăn Bán Chạy (Đơn vị: Lần bán)
            </h2>
            <BarChart width={500} height={250} data={topFoods} layout="vertical">
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="sold" fill="#000" />
            </BarChart>
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
