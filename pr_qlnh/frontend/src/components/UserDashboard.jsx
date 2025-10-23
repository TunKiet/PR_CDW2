import React from "react";
import "./css/UserDashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="filters">
          <button className="active">Hôm nay</button>
          <button>Tháng này</button>
          <button>Năm nay</button>
          <button>Tất cả</button>
        </div>
      </div>

      <div className="stats">
        <div className="card purple">
          <p>Hóa đơn</p>
          <h3>24%</h3>
        </div>
        <div className="card green">
          <p>Doanh thu</p>
          <h3>15.600.000 đ</h3>
        </div>
        <div className="card orange">
          <p>Khách hàng</p>
          <h3>11%</h3>
        </div>
      </div>

      <div className="chart-section">
        <h4>Tất cả</h4>
        <div className="chart">
          <div className="line blue"></div>
          <div className="line green"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
