import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderTable from '../components/OrderTable';

const initialOrdersData = [
    { id: 'DH1001', table: 'Bàn 05', total: 155000, status: 'Chờ xử lý', time: '10:30', notes: 'Khách yêu cầu ít đường.', statusColor: 'bg-yellow-100 text-yellow-700', items: [
        { name: 'Phở Bò', price: 55000, quantity: 2 },
        { name: 'Trà Chanh', price: 20000, quantity: 2 },
        { name: 'Nước Dừa', price: 20000, quantity: 1 }
    ] },
    { id: 'DH1002', table: 'Mang về', total: 60000, status: 'Đang phục vụ', time: '10:45', notes: 'Gói mang đi.', statusColor: 'bg-blue-100 text-blue-700', items: [
        { name: 'Bún Chả', price: 45000, quantity: 1 },
        { name: 'Cà Phê Sữa Đá', price: 25000, quantity: 1 }
    ] },
    { id: 'DH1003', table: 'Bàn 01', total: 110000, status: 'Đã thanh toán', time: '09:50', notes: '', statusColor: 'bg-green-100 text-green-700', items: [] },
    { id: 'DH1004', table: 'Bàn 12', total: 0, status: 'Đã hủy', time: '09:00', notes: 'Khách hủy đơn.', statusColor: 'bg-red-100 text-red-700', items: [] },
];

const OrderManagementPage = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentOrders, setCurrentOrders] = useState(initialOrdersData);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 Từ khóa tìm kiếm

    // Hàm mở modal chi tiết
    const handleViewDetails = (order) => {
        setSelectedOrder(JSON.parse(JSON.stringify(order)));
    };

    // Hàm lưu chỉnh sửa
    const handleSaveOrder = (updatedOrder) => {
        setCurrentOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            )
        );
        setSelectedOrder(null);
    };

    // Hoàn thành đơn
    const handleCompleteOrder = (orderId) => {
        setCurrentOrders(prevOrders =>
            prevOrders.map(order => {
                if (order.id === orderId) {
                    return {
                        ...order,
                        status: 'Đã thanh toán',
                        statusColor: 'bg-green-100 text-green-700',
                        total: order.total
                    };
                }
                return order;
            })
        );
        setSelectedOrder(null);
    };

    // 🔍 Lọc đơn hàng theo từ khóa
    const filteredOrders = currentOrders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 p-6">
                {/* 🔍 Thanh tìm kiếm */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Quản Lý Đơn Hàng</h1>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã, bàn hoặc trạng thái..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Bảng đơn hàng */}
                <OrderTable
                    orders={filteredOrders} // ✅ Hiển thị danh sách đã lọc
                    onViewDetails={handleViewDetails}
                    onEdit={handleViewDetails}
                    onCompleteOrder={handleCompleteOrder}
                />
            </div>

            {/* Modal chi tiết */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onSave={handleSaveOrder}
                    onCompleteOrder={handleCompleteOrder}
                />
            )}
        </div>
    );
};

export default OrderManagementPage;
