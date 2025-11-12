// src/components/CustomerDetailsModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { formatCurrency, getRankColor } from '../data/customerData'; // ✅ Import đầy đủ

const CustomerDetailsModal = ({ customer, onClose, onSave }) => {
    const [editedCustomer, setEditedCustomer] = useState(customer || {});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(editedCustomer);
        onClose();
    };

    // ✅ Tính tooltip điểm
    const pointsTooltip = customer?.totalSpent
        ? `Tổng chi tiêu: ${formatCurrency(customer.totalSpent)} / 10.000 đ = ${customer.points} Điểm`
        : '';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        Chi Tiết Khách Hàng {customer?.id || ''}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4">
                    {/* Tên khách hàng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tên khách hàng
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={editedCustomer.name || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={editedCustomer.phone || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    {/* Tổng chi tiêu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tổng chi tiêu (VNĐ)
                        </label>
                        <input
                            type="text"
                            name="totalSpent"
                            value={formatCurrency(editedCustomer.totalSpent || 0)}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 bg-gray-50 rounded-md shadow-sm p-2"
                        />
                    </div>

                    {/* Điểm */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Điểm hiện tại
                        </label>
                        <input
                            type="text"
                            name="points"
                            value={editedCustomer.points || 0}
                            readOnly
                            title={pointsTooltip}
                            className="mt-1 block w-full border border-gray-300 bg-gray-50 rounded-md shadow-sm p-2 text-orange-600 font-bold"
                        />
                    </div>

                    {/* Hạng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Hạng Thành viên:
                        </label>
                        <span
                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRankColor(
                                editedCustomer.rank || 'Đồng'
                            )} mt-1`}
                        >
                            {editedCustomer.rank || 'Đồng'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                            Hạng thành viên tự động dựa trên Điểm tích lũy.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Lưu Thay Đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsModal;
