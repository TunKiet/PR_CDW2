import React from "react";
import { MoreVertical, Trash2 } from "lucide-react";

const RoleTable = ({
  roles = [],
  onViewDetails,
  onDelete,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs text-center font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              TÊN VAI TRÒ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              MÔ TẢ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              NGÀY TẠO
            </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              NGÀY CẬP NHẬT
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              THAO TÁC
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : roles.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center px-3 py-8 text-gray-500">
                Chưa có vai trò
              </td>
            </tr>
          ) : (
            roles.map((u) => {
              const id = u.id;
              return (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                    {id}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    {u.name || "Không có tên"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {u.description || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {u.created_at || "—"}
                  </td>
                   <td className="px-6 py-4 text-sm text-gray-500">
                    {u.updated_at || "—"}
                  </td>

                  <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewDetails?.(u)}
                      className="text-gray-500 hover:text-indigo-600 p-1"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {onDelete && (
                      <button
                        onClick={() => onDelete(u.Role_id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center p-4 border-t bg-gray-50">
        <span className="text-sm text-gray-600">
          Hiển thị {roles.length} người dùng
        </span>

        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
            Trước
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg">
            1
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleTable;
