import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const statusClass = (s) => {
  if (s === 'Trống') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (s === 'Đang sử dụng') return 'bg-rose-50 text-rose-700 border border-rose-200';
  if (s === 'Đã đặt') return 'bg-amber-50 text-amber-700 border border-amber-200';
  return 'bg-gray-50';
};

export default function TableList({ tables = [], onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600">
              <th className="p-3">#</th>
              <th className="p-3">Tên Bàn</th>
              <th className="p-3">Loại</th>
              <th className="p-3">Sức chứa</th>
              <th className="p-3">Ghi chú</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tables.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-sm text-gray-500">
                  Chưa có bàn nào.
                </td>
              </tr>
            ) : (
              tables.map((t, idx) => (
                <tr key={t.table_id} className="border-t hover:bg-indigo-50/10">
                  <td className="p-3 align-top">{idx + 1}</td>
                  <td className="p-3 align-top font-medium">{t.table_name}</td>
                  <td className="p-3 align-top">{t.table_type || '-'}</td>
                  <td className="p-3 align-top">{t.capacity}</td>
                  <td className="p-3 align-top">{t.note || '-'}</td>
                  <td className={`p-3 align-top ${statusClass(t.status)} rounded-full px-3 py-1 text-sm inline-block`}>
                    {t.status}
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(t)} className="px-3 py-1 bg-yellow-500 text-white rounded inline-flex items-center gap-2">
                        <Edit2 size={14} /> Sửa
                      </button>
                      <button onClick={() => onDelete(t)} className="px-3 py-1 bg-red-600 text-white rounded inline-flex items-center gap-2">
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
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
