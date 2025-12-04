import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { notify } from "../../utils/notify";

export default function TableModal({ isOpen, onClose, editingTable, onSaved }) {
  const [tableName, setTableName] = useState("");
  const [tableType, setTableType] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("Trống");
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
  }, [editingTable, isOpen]);

  const validate = () => {
    if (!tableName.trim()) return "Tên bàn không được để trống.";
    if (Number(capacity) < 1) return "Sức chứa phải >= 1.";
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const err = validate();
    if (err) return notify.error(err);

    setLoading(true);
    try {
      const payload = {
        table_name: tableName.trim(),
        table_type: tableType.trim() || null,
        capacity: Number(capacity),
        note: note.trim() || null,
        status,
      };

      let res;
      if (editingTable?.table_id) {
        res = await axiosClient.put(`/tables/${editingTable.table_id}`, payload);
      } else {
        res = await axiosClient.post(`/tables`, payload);
      }

      if (res.data?.success === false) {
        notify.error(res.data.error || "Lỗi API");
      } else {
        notify.success(res.data?.message || "Thành công");
        onSaved && onSaved();
        onClose();
      }
    } catch (error) {
      const msg = error?.response?.data?.error || error?.message || "Lỗi kết nối";
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b bg-indigo-50">
              <h3 className="text-lg font-semibold">
                {editingTable ? "Sửa bàn" : "Thêm bàn mới"}
              </h3>
              <button onClick={onClose} className="text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Tên bàn</label>
                <input
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  placeholder="Ví dụ: Bàn A01"
                />
              </div>

              <div>
  <label className="block text-sm font-medium">Loại bàn</label>
  <select
    value={tableType}
    onChange={(e) => setTableType(e.target.value)}
    className="w-full p-2 border rounded mt-1"
  >
    <option value="Sảnh máy lạnh">Sảnh máy lạnh</option>
    <option value="Ngoài trời">Ngoài trời</option>
    <option value="Phòng VIP">Phòng VIP</option>
  </select>
</div>


              <div>
                <label className="block text-sm font-medium flex items-center gap-2">
                  <Users size={14} /> Sức chứa
                </label>
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Ghi chú</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Trạng thái</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                >
                  <option>Trống</option>
                  <option>Đang sử dụng</option>
                  <option>Đã đặt</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                  Hủy
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
                  {loading ? "Đang xử lý..." : editingTable ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}