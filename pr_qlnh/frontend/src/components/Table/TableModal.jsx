import React, { useEffect, useState } from 'react';

export default function TableModal({ isOpen, onClose, onSave, table }) {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(2);
  const [zone, setZone] = useState('Khu vực sảnh');
  const [status, setStatus] = useState('Trống');
  const [error, setError] = useState('');

  useEffect(() => {
    if (table) {
      setName(table.name || '');
      setCapacity(table.capacity || 2);
      setZone(table.zone || 'Khu vực sảnh');
      setStatus(table.status || 'Trống');
    } else {
      setName('');
      setCapacity(2);
      setZone('Khu vực sảnh');
      setStatus('Trống');
    }
    setError('');
  }, [table, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!name.trim() || !zone) {
      setError('Vui lòng điền đầy đủ và chính xác các trường.');
      return;
    }
    if (Number(capacity) < 1) {
      setError('Sức chứa phải là số >= 1.');
      return;
    }

    onSave({
      id: table?.id,
      name: name.trim(),
      capacity: Number(capacity),
      zone,
      status
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">{table ? 'Sửa Thông Tin Bàn' : 'Thêm Bàn Mới'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <span className="sr-only">Đóng</span>✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="tableName" className="block text-sm font-medium text-gray-700 mb-1">Tên Bàn</label>
              <input id="tableName" value={name} onChange={e=>setName(e.target.value)} required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Nhập tên bàn (ví dụ Bàn A01)" />
            </div>

            <div>
              <label htmlFor="tableCapacity" className="block text-sm font-medium text-gray-700 mb-1">Sức Chứa</label>
              <input id="tableCapacity" type="number" value={capacity} min="1" onChange={e=>setCapacity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition" />
            </div>

            <div>
              <label htmlFor="tableZone" className="block text-sm font-medium text-gray-700 mb-1">Khu Vực/Vị Trí</label>
              <select id="tableZone" value={zone} onChange={e=>setZone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option>Khu vực sảnh</option>
                <option>Phòng VIP</option>
                <option>Sân thượng</option>
                <option>Gần cửa sổ</option>
              </select>
            </div>

            <div>
              <label htmlFor="tableStatus" className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
              <select id="tableStatus" value={status} onChange={e=>setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option>Trống</option>
                <option>Đang sử dụng</option>
                <option>Đã đặt</option>
              </select>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Hủy</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-brand-indigo text-white rounded-lg"> {table ? 'Cập Nhật Bàn' : 'Thêm Bàn Mới'}</button>
        </div>
      </div>
    </div>
  );
}
