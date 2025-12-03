// src/components/SystemSettings.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { User, Lock, Shield, Settings, History } from "lucide-react";
import "../pages/Dashboard/Sales_Statistics_Dashboard.css";
import ProfileSection from "./Settings/ProfileSection";
import SecuritySection from "./Settings/SecuritySection";
import ActivityLogSection from "./Settings/ActivityLogSection";

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = () => {
    // Lấy thông tin user từ localStorage hoặc API
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (err) {
        console.error("Lỗi parse user:", err);
      }
    }
  };

  const tabs = [
    {
      id: "profile",
      name: "Thông tin cá nhân",
      icon: User,
      description: "Quản lý thông tin tài khoản của bạn",
    },
    {
      id: "security",
      name: "Mật khẩu & Bảo mật",
      icon: Lock,
      description: "Thay đổi mật khẩu và cài đặt xác thực 2 yếu tố",
    },
    {
      id: "activity",
      name: "Nhật ký hoạt động",
      icon: History,
      description: "Xem lịch sử đăng nhập và hoạt động tài khoản",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="w-64" />
      <main className="dish-main">
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Settings size={28} />
              Cài đặt Hệ thống
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin cá nhân và cài đặt bảo mật
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-left">{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* User Info Card */}
              {currentUser && (
                <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="text-indigo-600" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {currentUser.full_name || currentUser.username}
                      </p>
                      <p className="text-sm text-gray-500">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Tab Header */}
                <div className="border-b border-gray-200 px-6 py-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    if (tab.id === activeTab) {
                      return (
                        <div key={tab.id}>
                          <div className="flex items-center gap-2 mb-1">
                            <Icon size={20} className="text-indigo-600" />
                            <h2 className="text-xl font-semibold text-gray-900">
                              {tab.name}
                            </h2>
                          </div>
                          <p className="text-sm text-gray-600">{tab.description}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "profile" && (
                    <ProfileSection user={currentUser} onUpdate={loadUserInfo} />
                  )}
                  {activeTab === "security" && (
                    <SecuritySection user={currentUser} />
                  )}
                  {activeTab === "activity" && (
                    <ActivityLogSection user={currentUser} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemSettings;
