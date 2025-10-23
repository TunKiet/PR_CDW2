import React from 'react';

// Chuyển logic ánh xạ và định dạng (giữ lại để định dạng giá và trạng thái)
const categoryMap = {
    'main': 'Món Chính',
    'dessert': 'Tráng Miệng',
    'drink': 'Đồ Uống'
};
const statusMap = {
    'status_available': 'Còn hàng',
    'status_unavailable': 'Hết hàng'
};
const formatCurrency = (amount) => {
    // Xử lý trường hợp amount không phải là số
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const TableRow = ({ dish, openDetailsModal }) => {
    const statusText = statusMap[dish.statusKey] || 'N/A';
    const categoryText = categoryMap[dish.categoryKey] || 'Khác';
    const isAvailable = dish.statusKey === 'status_available';
    const statusClass = isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dish.id || '---'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <img src={dish.image} alt={dish.name} className="h-10 w-10 rounded-lg object-cover" 
                     onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/e5e7eb/4b5563?text=N/A'; }} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dish.name || 'Chưa có tên'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categoryText}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatCurrency(dish.price)}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                    {statusText}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center space-x-2">
                <button onClick={() => openDetailsModal(dish.id)} className="text-indigo-600 hover:text-indigo-900" title="Xem Chi Tiết">
                    {/* Icon View */}
                </button>
                {/* ... Các nút Sửa, Xóa ... */}
            </td>
        </tr>
    );
};

const DishTable = ({ dishes, openDetailsModal, isLoading }) => {
    return (
        <div className="overflow-x-auto custom-scroll border border-gray-200 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên món ăn</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr><td colSpan="7" className="px-6 py-4 text-center text-indigo-600 font-medium">Đang tải dữ liệu món ăn...</td></tr>
                    ) : dishes.length === 0 ? (
                        <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-500 font-medium">Không tìm thấy món ăn nào.</td></tr>
                    ) : (
                        dishes.map(dish => (
                            <TableRow key={dish.id} dish={dish} openDetailsModal={openDetailsModal} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DishTable;