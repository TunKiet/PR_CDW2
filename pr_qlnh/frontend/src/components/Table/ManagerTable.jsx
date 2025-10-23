import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TableList from "../components/TableList";
import TableModal from "../components/TableModal";
import DeleteModal from "../components/DeleteModal";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [deleteTable, setDeleteTable] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("restaurant_tables");
    if (stored) setTables(JSON.parse(stored));
  }, []);

  const saveTable = (table) => {
    let updated;
    if (editingTable) {
      updated = tables.map((t) => (t.id === editingTable.id ? { ...t, ...table } : t));
    } else {
      updated = [...tables, { ...table, id: Date.now() }];
    }
    setTables(updated);
    localStorage.setItem("restaurant_tables", JSON.stringify(updated));
    setModalOpen(false);
    setEditingTable(null);
  };

  const confirmDelete = () => {
    const updated = tables.filter((t) => t.id !== deleteTable.id);
    setTables(updated);
    localStorage.setItem("restaurant_tables", JSON.stringify(updated));
    setDeleteOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <header className="mb-6 border-b-2 border-indigo-600 pb-2">
          <h1 className="text-3xl font-extrabold text-gray-900">Quản Lý Bàn Ăn</h1>
          <p className="text-gray-600 mt-1">Thêm, sửa, xóa cấu trúc các bàn trong nhà hàng.</p>
        </header>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Danh Sách Bàn ({tables.length})
          </h2>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
            </svg>
            Thêm Bàn Mới
          </button>
        </div>

        <TableList
          tables={tables}
          onEdit={(t) => {
            setEditingTable(t);
            setModalOpen(true);
          }}
          onDelete={(t) => {
            setDeleteTable(t);
            setDeleteOpen(true);
          }}
        />

        <TableModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={saveTable}
          editingTable={editingTable}
        />

        <DeleteModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
          table={deleteTable}
        />
      </main>
    </div>
  );
};

export default TableManagement;
