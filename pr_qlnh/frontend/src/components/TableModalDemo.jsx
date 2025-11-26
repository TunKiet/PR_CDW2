import React, { useEffect, useState } from "react";
import axios from "axios";

const TableModal = ({ isOpen, onClose, onSelectTable }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return; // 🔹 chỉ fetch khi modal mở
    const fetchTables = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/tables");
        setTables(res.data);
      } catch (err) {
        console.error("Lỗi tải danh sách bàn:", err);
        setError("Không thể tải danh sách bàn!");
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, [isOpen]);

  if (!isOpen) return null; // 🔹 không render khi đóng

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[9999]">

      <div className="bg-white rounded-2xl shadow-xl w-[400px] max-h-[80vh] overflow-y-auto p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Chọn Bàn</h2>

        {loading && <p className="text-gray-500 text-center">Đang tải danh sách bàn...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-3">
            {tables.map((table) => (
              <button
                key={table.table_id}
                onClick={() => {
                  onSelectTable(table);
                  onClose();
                }}
                className={`p-3 rounded-xl border transition ${
                  table.status === "occupied"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-300"
                }`}
                disabled={table.status === "occupied"}
              >
                <h3 className="font-medium">{table.table_name}</h3>
                <p className="text-sm">{table.capacity} người</p>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TableModal;