import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, MapPin, Info } from "lucide-react";
import axiosClient from "../../api/axiosClient";

export default function TableModal({ isOpen, onClose, editingTable, onSaved }) {
  const [tableName, setTableName] = useState("");
  const [tableType, setTableType] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("Trống");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTable) {
      setTableName(editingTable.table_name || "");
      setTableType(editingTable.table_type || "");
      setCapacity(editingTable.capacity ?? 2);
      setNote(editingTable.note || "");
      setStatus(editingTable.status || "Trống");
    } else {
      setTableName("");
      setTableType("");
      setCapacity(2);
      setNote("");
      setStatus("Trống");
    }
    setError("");
  }, [editingTable, isOpen]);

  const validate = () => {
    if (!tableName.trim()) return "Tên bàn không được để trống.";
    if (Number(capacity) < 1) return "Sức chứa phải >= 1.";
    if (!["Trống", "Đang sử dụng", "Đã đặt"].includes(status))
      return "Trạng thái không hợp lệ.";
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    setError("");
    const payload = {
      table_name: tableName.trim(),
      table_type: tableType.trim() || null,
      capacity: Number(capacity),
      note: note.trim() || null,
      status,
    };

    try {
      let res;
      if (editingTable?.table_id) {
        // Update
        res = await axiosClient.put(`/tables/${editingTable.table_id}`, payload);
      } else {
        // Create
        res = await axiosClient.post("/tables", payload);
      }

      onSaved && onSaved(res.data); // notify parent to refresh
      onClose();
    } catch (err) {
      // try to read message from Laravel validation
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors && JSON.stringify(err.response.data.errors)) ||
        err.message ||
        "Lỗi khi gọi API";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-indigo-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingTable ? "Sửa bàn" : "Thêm bàn mới"}
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-100 border border-rose-300 text-rose-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Info size={14} /> Tên bàn
                  </div>
                </label>
                <div className="relative">
                  <input
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    className="w-full pl-3 p-2 border border-gray-300 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-indigo-500"
                    placeholder="Ví dụ: Bàn A01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại bàn</label>
                <input
                  value={tableType}
                  onChange={(e) => setTableType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                  placeholder="VD: VIP, Sảnh, Tầng 2..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Users size={14} /> Sức chứa
                  </div>
                </label>
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                  placeholder="Ghi chú (tùy chọn)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                >
                  <option>Trống</option>
                  <option>Đang sử dụng</option>
                  <option>Đã đặt</option>
                </select>
              </div>
            </form>

            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-60"
              >
                {loading ? (editingTable ? "Đang cập nhật..." : "Đang thêm...") : editingTable ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
