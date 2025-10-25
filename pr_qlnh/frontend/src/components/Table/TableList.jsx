import React from 'react';

const getStatusClass = (status) => {
  switch (status) {
    case 'Trống':
      return 'bg-emerald-100 text-emerald-800';
    case 'Đang sử dụng':
      return 'bg-red-100 text-red-800';
    case 'Đã đặt':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TableList({ tables, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Bàn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sức Chứa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khu Vực</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tables.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Chưa có bàn nào được thêm.</td>
              </tr>
            ) : (
              tables.sort((a,b)=>a.name.localeCompare(b.name)).map((table) => (
                <tr key={table.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{table.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{table.capacity} người</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{table.zone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(table.status)}`}>
                      {table.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => onEdit(table)} aria-label={`Sửa ${table.name}`} title="Sửa"
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150 p-2 rounded-full hover:bg-indigo-50">
                      Sửa
                    </button>
                    <button onClick={() => onDelete(table)} aria-label={`Xóa ${table.name}`} title="Xóa"
                      className="text-red-600 hover:text-red-900 transition duration-150 p-2 rounded-full hover:bg-red-50">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
