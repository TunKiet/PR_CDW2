// src/pages/CustomerManagementPage.jsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '../components/Sidebar'; 
import CustomerTable from '../components/CustomerTable';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import { initialCustomersData } from '../data/customerData'; // Giả định import từ data

const CustomerManagementPage = () => {
    const [customers, setCustomers] = useState(initialCustomersData);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Hàm cập nhật khách hàng sau khi chỉnh sửa
    const handleSaveCustomer = (updatedCustomer) => {
        setCustomers(prev => 
            prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
        );
    };

    // Hàm tạo khách hàng mới (giả lập)
    const handleAddCustomer = () => {
        const newId = `KH00${customers.length + 1}`;
        const newCustomer = {
            id: newId,
            name: 'Khách hàng mới',
            phone: '',
            totalSpent: 0,
            points: 0,
            rank: 'Thành viên mới',
        };
        setCustomers(prev => [...prev, newCustomer]);
        setSelectedCustomer(newCustomer); // Mở modal để chỉnh sửa ngay
    };

    // Lọc khách hàng
    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.id.includes(searchTerm.toUpperCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            {/* Main Content Area: Sử dụng ml-64 để bù trừ cho Sidebar */}
            <div className="flex-1 ml-64 p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Quản Lý Khách Hàng & Tích Điểm</h1>

                {/* Header & Controls */}
                <div className="flex justify-between items-center space-x-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo Tên, SĐT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    {/* Filter (Tất cả Hạng) */}
                    <button className="flex items-center bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                        Tất cả Hạng
                    </button>

                    {/* Button Thêm Khách Hàng */}
                    <button 
                        onClick={handleAddCustomer}
                        className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md">
                        + Thêm Khách Hàng
                    </button>
                </div>
                
                {/* Customer Table */}
                <CustomerTable 
                    customers={filteredCustomers}
                    onViewDetails={setSelectedCustomer}
                />

            </div>

            {/* Modal Chi Tiết/Chỉnh Sửa */}
            {selectedCustomer && (
                <CustomerDetailsModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                    onSave={handleSaveCustomer}
                />
            )}
        </div>
    );
};

export default CustomerManagementPage;