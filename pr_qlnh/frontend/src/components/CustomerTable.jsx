// src/components/CustomerTable.jsx
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { formatCurrency, getRankColor } from '../data/customerData'; // Giả định import từ data

const CustomerTable = ({ customers, onViewDetails }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MÃ KH</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TÊN KHÁCH HÀNG</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TỔNG CHI TIÊU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ĐIỂM TÍCH LŨY</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HẠNG TV</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">THAO TÁC</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{customer.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(customer.totalSpent)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">{customer.points} Điểm</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRankColor(customer.rank)}`}>
                                    {customer.rank}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <button onClick={() => onViewDetails(customer)} className="text-gray-500 hover:text-indigo-600 p-1">
                                    <MoreVertical size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination / Footer */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                <span className="text-sm text-gray-600">
                    Hiển thị 1 đến {customers.length} trên 5 kết quả
                </span>
                <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">Trước</button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg">1</button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">Sau</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerTable;