import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // giữ nguyên nếu có
import TableList from "../components/Table/TableList";
import TableModal from "../components/Table/TableModal";
import DeleteModal from "../components/Table/DeleteModal";
import axiosClient from "../api/axiosClient";

export default function TableManagementAdmin() {
  const [tables, setTables] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalTables, setTotalTables] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [deleteInfo, setDeleteInfo] = useState({ open: false, table: null });

 const fetchTables = async (page = 1) => {
    try {
      const response = await axiosClient.get(`/tables?page=${page}`);
      setTables(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotalTables(response.data.total_tables);
    } catch (error) {
      console.error("fetchTables error", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const openCreate = () => {
    setEditingTable(null);
    setModalOpen(true);
  };

  const handleEdit = (t) => {
    setEditingTable(t);
    setModalOpen(true);
  };

  const handleSaved = (saved) => {
    // after create/update — refresh list (simplest)
    fetchTables();
  };

  const handleDelete = (t) => {
    setDeleteInfo({ open: true, table: t });
  };

  const handleDeleted = (deletedTable) => {
    // optimistic update
    setTables((prev) => prev.filter((p) => p.table_id !== deletedTable.table_id));
  };

  const handleCloseDelete = () => setDeleteInfo({ open: false, table: null });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Quản lý Bàn</h2>
          <span className="text-sm text-gray-600">
            Tổng số bàn: <strong>{totalTables}</strong>
          </span>
          <div>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Thêm bàn mới
            </button>
          </div>
        </div>

        {loading ? (
          <div>Đang tải danh sách...</div>
        ) : (
          <TableList tables={tables} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => fetchTables(currentPage - 1)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Trang trước
        </button>

        <span className="text-gray-700">
          Trang {currentPage} / {lastPage}
        </span>

        <button
          disabled={currentPage === lastPage}
          onClick={() => fetchTables(currentPage + 1)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === lastPage
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Trang sau
        </button>
      </div>


        <TableModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          editingTable={editingTable}
          onSaved={handleSaved}
        />

        <DeleteModal
          isOpen={deleteInfo.open}
          onClose={handleCloseDelete}
          table={deleteInfo.table}
          onDeleted={handleDeleted}
        />
      </main>
    </div>
  );
}
