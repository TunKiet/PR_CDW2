import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TableList from "../components/TableList";
import TableModal from "../components/TableModal";
import DeleteModal from "../components/DeleteModal";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Load data từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem("restaurant_tables");
    if (stored) setTables(JSON.parse(stored));
    else {
      const sample = [
        { id: 1, name: "Bàn VIP 01", capacity: 8, zone: "Phòng VIP", status: "Trống" },
        { id: 2, name: "Bàn Sảnh 05", capacity: 4, zone: "Sảnh", status: "Trống" },
        { id: 3, name: "Bàn Tầng 2", capacity: 2, zone: "Tầng 2", status: "Trống" },
      ];
      setTables(sample);
      localStorage.setItem("restaurant_tables", JSON.stringify(sample));
    }
  }, []);

  const saveTables = (updated) => {
    setTables(updated);
    localStorage.setItem("restaurant_tables", JSON.stringify(updated));
  };

  const handleAdd = () => {
    setSelectedTable(null);
    setShowModal(true);
  };

  const handleEdit = (table) => {
    setSelectedTable(table);
    setShowModal(true);
  };

  const handleDelete = (table) => {
    setSelectedTable(table);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    const updated = tables.filter((t) => t.id !== selectedTable.id);
    saveTables(updated);
    setShowDelete(false);
  };

  const handleSave = (data) => {
    let updated;
    if (selectedTable) {
      updated = tables.map((t) => (t.id === selectedTable.id ? data : t));
    } else {
      updated = [...tables, { ...data, id: Date.now(), status: "Trống" }];
    }
    saveTables(updated);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen lg:flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 w-full p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bàn ăn</h1>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Thêm bàn
          </button>
        </div>

        <TableList tables={tables} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {showModal && (
        <TableModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          table={selectedTable}
        />
      )}
      {showDelete && (
        <DeleteModal
          onClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
          table={selectedTable}
        />
      )}
    </div>
  );
}
function ManageTablePage() {
  return (
    <div>
      <h1>Trang Quản Lý Bàn Ăn</h1>
      <p>Đây là nội dung của trang quản lý bàn ăn.</p>
    </div>
  );
}


