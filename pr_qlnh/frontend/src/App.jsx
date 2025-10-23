import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Import các trang
import LoginPage from "./components/LoginPage";
import ForgotPassword from "./components/ForgotPassword";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import Sidebar from "./components/Sidebar";

// Layout bọc ngoài để hiển thị sidebar khi cần
function LayoutWithSidebar({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, background: "#f8f9fb", minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  // Xác định khi nào hiển thị sidebar
  const showSidebar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user");

  return (
    <>
      {showSidebar ? (
        <LayoutWithSidebar>
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Routes>
        </LayoutWithSidebar>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
