import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import { X, User, MapPin, Users, Info } from "lucide-react";

export default function TableModal({ isOpen, onClose, onSave, table }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [zone, setZone] = useState("Khu vực sảnh");
  const [status, setStatus] = useState("Trống");
  const [error, setError] = useState("");

  useEffect(() => {
    if (table) {
      setName(table.name || "");
      setCapacity(table.capacity || 2);
      setZone(table.zone || "Khu vực sảnh");
      setStatus(table.status || "Trống");
    } else {
      setName("");
      setCapacity(2);
      setZone("Khu vực sảnh");
      setStatus("Trống");
    }
    setError("");
  }, [table, isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!name.trim() || !zone) {
      setError("Vui lòng điền đầy đủ thông tin bàn.");
      return;
    }
    if (Number(capacity) < 1) {
      setError("Sức chứa phải là số >= 1.");
      return;
    }

    onSave({
      id: table?.id,
      name: name.trim(),
      capacity: Number(capacity),
      zone,
      status,
    });
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
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-indigo-100">
              <h3 className="text-xl font-semibold text-gray-800">
                {table ? "Sửa thông tin bàn" : "Thêm bàn mới"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-100 border border-rose-300 text-rose-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Tên bàn */}
              <div>
                <label
                  htmlFor="tableName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <Info size={14} /> Tên Bàn
                  </div>
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="tableName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="Nhập tên bàn (ví dụ: Bàn A01)"
                  />
                </div>
              </div>

              {/* Sức chứa */}
              <div>
                <label
                  htmlFor="tableCapacity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <Users size={14} /> Sức Chứa
                  </div>
                </label>
                <input
                  id="tableCapacity"
                  type="number"
                  value={capacity}
                  min="1"
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Khu vực */}
              <div>
                <label
                  htmlFor="tableZone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <MapPin size={14} /> Khu Vực / Vị Trí
                  </div>
                </label>
                <select
                  id="tableZone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option>Khu vực sảnh</option>
                  <option>Phòng VIP</option>
                  <option>Sân thượng</option>
                  <option>Gần cửa sổ</option>
                </select>
              </div>

              {/* Trạng thái */}
              <div>
                <label
                  htmlFor="tableStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <Info size={14} /> Trạng Thái
                  </div>
                </label>
                <select
                  id="tableStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option>Trống</option>
                  <option>Đang sử dụng</option>
                  <option>Đã đặt</option>
                </select>
              </div>
            </form>

            {/* Footer */}
            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                {table ? "Cập nhật bàn" : "Thêm bàn mới"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
