import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Table/Sidebar';
import TableList from '../components/Table/TableList';
import TableModal from '../components/Table/TableModal';
import DeleteModal from '../components/Table/DeleteModal';
import { loadTablesFromStorage, saveTablesToStorage } from '../utils/storage';

const initialFallback = [
  { id: Date.now(), name: 'Bàn VIP 01', capacity: 8, zone: 'Phòng VIP', status: 'Trống' },
  { id: Date.now() + 1, name: 'Bàn Sảnh 05', capacity: 4, zone: 'Khu vực sảnh', status: 'Trống' },
  { id: Date.now() + 2, name: 'Bàn Tầng 2', capacity: 2, zone: 'Tầng 2', status: 'Trống' },
];

export default function TableManagementAdmin() {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [deleteInfo, setDeleteInfo] = useState({ open: false, table: null });

  useEffect(() => {
    const stored = loadTablesFromStorage();
    setTables(stored ?? initialFallback);
  }, []);

  useEffect(() => {
    saveTablesToStorage(tables);
    // fire custom event if needed: window.dispatchEvent(new Event('storage-update-tables'));
  }, [tables]);

  const handleOpenAdd = () => {
    setEditingTable(null);
    setModalOpen(true);
  };

  const handleSave = (payload) => {
    if (payload.id) {
      setTables(prev => prev.map(t => t.id === payload.id ? { ...t, ...payload } : t));
    } else {
      setTables(prev => [...prev, { ...payload, id: Date.now(), status: payload.status ?? 'Trống' }]);
    }
    setModalOpen(false);
    setEditingTable(null);
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteInfo.table) return;
    setTables(prev => prev.filter(t => t.id !== deleteInfo.table.id));
    setDeleteInfo({ open: false, table: null });
  };

  return (
    <>
      <Sidebar />
      <main className="flex-1 w-full p-4 sm:p-8 overflow-x-hidden pt-12 lg:pt-8">
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white p-3 border-b shadow-md z-30 flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-900">Quản Lý Bàn Ăn</h1>
        </div>

        <header className="mb-8 mt-4 lg:mt-0">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 border-b-2 border-brand-indigo pb-2">
            Quản Lý Bàn Ăn
          </h1>
          <p className="text-md text-gray-500 mt-1">
            Thêm, sửa và xóa cấu trúc các bàn trong nhà hàng. Dữ liệu này được dùng cho trang Đặt bàn.
          </p>
        </header>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Danh Sách Bàn (<span>{tables.length}</span>)</h2>
          <button
            onClick={handleOpenAdd}
            className="flex items-center px-4 py-2 bg-brand-indigo text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Thêm Bàn Mới
          </button>
        </div>

        <TableList
          tables={tables}
          onEdit={handleEdit}
          onDelete={(table) => setDeleteInfo({ open: true, table })}
        />

        <TableModal
          isOpen={isModalOpen}
          onClose={() => { setModalOpen(false); setEditingTable(null); }}
          onSave={handleSave}
          table={editingTable}
        />

        <DeleteModal
          isOpen={deleteInfo.open}
          onClose={() => setDeleteInfo({ open: false, table: null })}
          onConfirm={handleDeleteConfirm}
          tableName={deleteInfo.table?.name}
        />
      </main>
    </>
  );
}
