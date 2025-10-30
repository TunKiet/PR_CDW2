// src/components/OrderTable.jsx
import React from 'react';
import { Eye, Edit2, CheckCircle } from 'react-feather'; 

const formatCurrency = (amount) => {
    const num = Number(amount);
    return num.toLocaleString('vi-VN') + ' đ';
};

/**
 * Component hiển thị bảng danh sách đơn hàng.
 * NHẬN PROPS MỚI: onCompleteOrder
 */
const OrderTable = ({ orders, onViewDetails, onEdit, onCompleteOrder }) => { 
    
    // Sử dụng orders nhận từ props
    const currentOrders = orders || []; 
    const totalResults = 4; 

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            
            <table className="min-w-full divide-y divide-gray-200">
                
                {/* 2. HEADER CỦA BẢNG (THEAD) */}
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MÃ ĐƠN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BÀN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TỔNG TIỀN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRẠNG THÁI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">THỜI GIAN</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">THAO TÁC</th>
                    </tr>
                </thead>

                {/* 3. BODY CỦA BẢNG (TODY) */}
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.table}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{formatCurrency(order.total)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.statusColor}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>

                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                                {/* Nút Xem Chi Tiết */}
                                <button 
                                    onClick={() => onViewDetails(order)}
                                    className="text-blue-500 hover:text-blue-700 transition duration-150"
                                >
                                    <Eye size={18} />
                                </button>
                                {/* Nút Chỉnh Sửa */}
                                <button 
                                    onClick={() => onViewDetails({...order, isEditing: true})} 
                                    className="text-yellow-500 hover:text-yellow-700 transition duration-150"
                                >
                                    <Edit2 size={18} />
                                </button>
                                {/* Nút Hoàn thành/Giao hàng */}
                                {order.status !== 'Đã thanh toán' && (
                                    <button 
                                        // GỌI HÀM HOÀN THÀNH VÀ TRUYỀN ID CỦA ĐƠN HÀNG
                                        onClick={() => onCompleteOrder(order.id)}
                                        className="text-green-500 hover:text-green-700 transition duration-150"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 4. PAGINATION / FOOTER */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                <span className="text-sm text-gray-600">
                    Hiển thị 1 đến {currentOrders.length} trên {totalResults} kết quả
                </span>
                <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
                        Trước
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg">
                        1
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
                        2
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderTable;