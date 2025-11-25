import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TableList from "../components/Table/TableList";
import TableModal from "../components/Table/TableModal";
import axiosClient from "../api/axiosClient";
import { notify, confirmAction } from "../utils/notify";

export default function TableManagementAdmin() {
  const [tables, setTables] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalTables, setTotalTables] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  const fetchTables = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/tables?page=${page}`);

      if (res.data?.success === false) {
        notify.error(res.data.error || "Lỗi khi tải danh sách!");
        setLoading(false);
        return;
      }

      setTables(res.data.data);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
      setTotalTables(res.data.total_tables);
    } catch (err) {
      notify.error("Lỗi kết nối tới server");
    } finally {
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
    notify.success("Lưu thành công");
    fetchTables(currentPage);
  };

  const handleDelete = async (table) => {
    const ok = await confirmAction("Xác nhận xóa", `Bạn có muốn xóa bàn ${table.table_name}?`);
    if (!ok) return;

    try {
      const res = await axiosClient.delete(`/tables/${table.table_id}`);

      if (res.data?.success === false) {
        notify.error(res.data.error || "Không thể xóa");
        return;
      }

      notify.success("Xóa thành công");
      // nếu page rỗng sau xóa, chuyển về trang trước nếu có
      // refresh current page
      fetchTables(currentPage);
    } catch (err) {
      notify.error(err?.response?.data?.error || "Lỗi khi xóa");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Quản lý Bàn</h2>

          <span className="text-sm text-gray-600">
            Tổng số bàn: <strong>{totalTables}</strong>
          </span>

          <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg">
            Thêm bàn mới
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6">Đang tải...</div>
        ) : (
          <TableList tables={tables} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        <div className="flex justify-center items-center gap-3 mt-6">
          <button disabled={currentPage === 1} onClick={() => fetchTables(currentPage - 1)} className="px-4 py-2 rounded border">
            Trang trước
          </button>
          <span>Trang {currentPage} / {lastPage}</span>
          <button disabled={currentPage === lastPage} onClick={() => fetchTables(currentPage + 1)} className="px-4 py-2 rounded border">
            Trang sau
          </button>
        </div>

        <TableModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} editingTable={editingTable} onSaved={handleSaved} />
      </main>
    </div>
  );
}
