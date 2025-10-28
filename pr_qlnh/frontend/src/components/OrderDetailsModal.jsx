// src/components/OrderDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Edit, Trash2, CheckCircle } from 'lucide-react'; // Đảm bảo import CheckCircle

const formatCurrency = (amount) => {
    // Đảm bảo xử lý đúng số
    const num = Number(amount);
    return num.toLocaleString('vi-VN') + ' đ';
};

// THAY ĐỔI: Nhận onCompleteOrder qua props
const OrderDetailsModal = ({ order, onClose, onSave, onCompleteOrder }) => { 
    // Logic quản lý chỉnh sửa (ĐÃ BỔ SUNG)
    const [isEditing, setIsEditing] = useState(order.isEditing || false);
    const [editedOrder, setEditedOrder] = useState(order);

    // Tính toán lại tổng tiền khi chỉnh sửa (ĐÃ BỔ SUNG)
    useEffect(() => {
        const newTotal = editedOrder.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        setEditedOrder(prev => ({ ...prev, total: newTotal }));
    }, [editedOrder.items]);

    const handleQuantityChange = (itemName, newQuantity) => {
        const q = parseInt(newQuantity);
        if (q < 1 || isNaN(q)) return; // Không cho phép số lượng nhỏ hơn 1
        
        setEditedOrder(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.name === itemName ? { ...item, quantity: q } : item
            )
        }));
    };
    
    const handleRemoveItem = (itemName) => {
        setEditedOrder(prev => ({
            ...prev,
            items: prev.items.filter(item => item.name !== itemName)
        }));
    };

    const handleSave = () => {
        onSave(editedOrder);
        setIsEditing(false);
    };

    // Hàm Hoàn thành Đơn hàng trong modal
    const handleComplete = () => {
        onCompleteOrder(order.id); // Gọi hàm từ props
        onClose(); // Đóng modal
    };
    
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isEditing ? `CHỈNH SỬA ĐƠN HÀNG ${order.id}` : `CHI TIẾT ĐƠN HÀNG ${order.id}`}
                    </h2>
                    <div className='flex space-x-2'>
                        
                        {/* Nút Thanh toán/Hoàn thành */}
                        {order.status !== 'Đã thanh toán' && !isEditing && (
                            <button
                                onClick={handleComplete} // GỌI HÀM HOÀN THÀNH
                                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition"
                            >
                                <CheckCircle size={18} />
                                <span>Thanh Toán & Hoàn Thành</span>
                            </button>
                        )}
                        
                        {/* Nút Chỉnh Sửa / Lưu Lại */}
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-lg transition"
                            >
                                <Edit size={18} />
                                <span>Chỉnh Sửa</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition"
                            >
                                <Save size={18} />
                                <span>Lưu Lại</span>
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800 transition p-2"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 grid grid-cols-3 gap-6">
                    {/* Cột Chi tiết đơn hàng */}
                    <div className="col-span-2 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2 text-gray-700">Danh sách món</h3>
                        <div className="space-y-3">
                            {editedOrder.items.map((item) => (
                                <div key={item.name} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                                                    className="w-16 text-center border rounded-md p-1"
                                                />
                                                <button onClick={() => handleRemoveItem(item.name)} className='text-red-500 hover:text-red-700'>
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-lg font-bold text-blue-600">x{item.quantity}</span>
                                        )}
                                        
                                    </div>
                                    <span className="ml-4 font-bold w-32 text-right">
                                        {formatCurrency(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cột Tóm tắt */}
                    <div className="col-span-1 p-4 bg-blue-50 rounded-lg h-min sticky top-20">
                        <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-blue-700">Tóm Tắt</h3>
                        <div className="space-y-3">
                            <p><strong>Mã đơn:</strong> {order.id}</p>
                            <p><strong>Bàn/Khách hàng:</strong> {order.table}</p>
                            <p><strong>Thời gian:</strong> {order.time}</p>
                            <p><strong>Trạng thái:</strong> <span className='font-bold text-orange-600'>{order.status}</span></p>
                            
                            <div className='pt-3 border-t'>
                                <p className="flex justify-between font-bold text-xl text-blue-800">
                                    <span>Thành tiền:</span>
                                    <span>{formatCurrency(editedOrder.total)}</span>
                                </p>
                            </div>
                            
                            <div className='pt-3 border-t'>
                                <p className='text-sm text-gray-600'><strong>Ghi chú:</strong> {order.notes || 'Không có'}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderDetailsModal;