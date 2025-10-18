import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; 
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderTable from '../components/OrderTable'; 

// DỮ LIỆU GIẢ LẬP ĐẦY ĐỦ (Đã thêm vào đây)
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

    // Hàm mở modal và hiển thị chi tiết (đã sửa để tạo bản sao sâu)
    const handleViewDetails = (order) => {
        setSelectedOrder(JSON.parse(JSON.stringify(order))); 
    };

    // Hàm lưu chỉnh sửa (Đã hoàn thiện)
    const handleSaveOrder = (updatedOrder) => {
        setCurrentOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === updatedOrder.id ? updatedOrder : order
            )
        );
        setSelectedOrder(null); 
    };

    // HÀM XỬ LÝ HOÀN THÀNH ĐƠN HÀNG (ĐÃ HOÀN THIỆN)
    const handleCompleteOrder = (orderId) => {
        setCurrentOrders(prevOrders => 
            prevOrders.map(order => {
                if (order.id === orderId) {
                    return {
                        ...order,
                        status: 'Đã thanh toán',
                        statusColor: 'bg-green-100 text-green-700',
                        // Đảm bảo tổng tiền được giữ nguyên, không reset về 0 (đã sửa lỗi logic trước đó)
                        total: order.total 
                    };
                }
                return order;
            })
        );
        setSelectedOrder(null); 
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 p-6"> 
                {/* Header & Controls (có thể thêm Search/Filter nếu cần) */}
                {/* Ví dụ: */}
                {/* <div className='mb-4'>... Search bar code ...</div> */}
                
                <OrderTable 
                    orders={currentOrders} 
                    onViewDetails={handleViewDetails} 
                    onEdit={handleViewDetails}
                    onCompleteOrder={handleCompleteOrder} // Truyền action hoàn thành
                />
            </div>
            
            {/* Modal Chi Tiết/Chỉnh Sửa */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onSave={handleSaveOrder}
                    onCompleteOrder={handleCompleteOrder} // Truyền action hoàn thành
                />
            )}
        </div>
    );
};

export default OrderManagementPage;