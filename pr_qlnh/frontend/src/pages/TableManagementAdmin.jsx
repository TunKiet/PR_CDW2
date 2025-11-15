import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
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
      setLoading(true);
      const response = await axiosClient.get(`/tables?page=${page}`);
      
      setTables(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotalTables(response.data.total_tables);

      setLoading(false);
    } catch (error) {
      console.error("fetchTables error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const openCreate = () => {
    setEditingTable(null);
    setModalOpen(true);
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setModalOpen(true);
  };

  const handleSaved = () => {
    fetchTables(currentPage);
  };

  const handleDelete = (table) => {
    setDeleteInfo({ open: true, table });
  };

  const handleDeleted = (deletedTable) => {
    setTables((prev) => prev.filter((t) => t.table_id !== deletedTable.table_id));
  };

  const handleCloseDelete = () =>
    setDeleteInfo({ open: false, table: null });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Quản lý Bàn</h2>

          <span className="text-sm text-gray-600">
            Tổng số bàn: <strong>{totalTables}</strong>
          </span>

          <button
            onClick={openCreate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Thêm bàn mới
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6">Đang tải dữ liệu...</div>
        ) : (
          <TableList
            tables={tables}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-8">
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
