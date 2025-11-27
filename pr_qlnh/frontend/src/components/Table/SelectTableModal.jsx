import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Users } from "lucide-react";
import axiosClient from "../../api/axiosClient";


export default function SelectTableModal({
  isOpen,
  onClose,
  onSelectTable,
  selectedTable,
  tableCarts = {},
  tableStatus
}) {
  const [tables, setTables] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  const statusMap = {
    available: "Trống",
    in_use: "Đang sử dụng",
    reserved: "Đã đặt",
  };

  const areas = ["all", "Sảnh máy lạnh", "Ngoài trời", "Phòng VIP"];

  // Load danh sách bàn
  useEffect(() => {
    if (isOpen) {
      axiosClient.get("/tables").then((res) => {
        const data = res.data?.data || res.data || [];
        setTables(data);
      });
    }
  }, [isOpen]);

  // Filter bàn theo khu vực + trạng thái
  const filteredTables = tables.filter((t) => {
    const statusMatch =
      statusFilter === "all" ||
      t.status === statusFilter;

    const areaMatch =
      areaFilter === "all" ||
      (t.table_type &&
        t.table_type.toLowerCase() === areaFilter.toLowerCase());

    return statusMatch && areaMatch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl px-4 py-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-2xl font-bold">Chọn bàn</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-black">
                <X size={22} />
              </button>
            </div>

            {/* Filter */}
            <div className="flex flex-col gap-6 py-4">
              {/* Khu vực */}
              <div>
                <div className="font-semibold mb-2">Khu vực</div>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => setAreaFilter(area)}
                      className={`px-4 py-1.5 rounded-full text-sm border transition ${
                        areaFilter === area
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {area === "all" ? "Tất cả khu vực" : area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trạng thái */}
              {/* <div>
                <div className="font-semibold mb-2">Trạng thái</div>
                <div className="flex flex-wrap gap-2">
                  {["all", "available", "in_use", "reserved"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${
                        statusFilter === s
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {s === "all" ? "Tất cả trạng thái" : statusMap[s]}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Grid bàn */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[450px] overflow-y-auto">

              {filteredTables.map((t) => {
                const isSelected = selectedTable?.table_id === t.table_id;
                const hasItems = (tableCarts[t.table_id]?.length ?? 0) > 0; // bàn có món

                return (
                  <motion.div
                    key={t.table_id}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => {
                      onSelectTable(t);
                      onClose();
                    }}
                    className={`
                      border rounded-xl p-4 shadow-sm cursor-pointer transition flex flex-col gap-2

                      ${isSelected ? "bg-green-500 text-white border-green-600 shadow-lg" : ""}
                      ${!isSelected && hasItems ? "bg-green-100 border-green-300" : ""}
                      ${!isSelected && !hasItems ? "bg-white hover:shadow-md" : ""}
                    `}
                  >
                    <div className="text-lg font-bold">{t.table_name}</div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} />
                      <span>{t.table_type || "Không có khu vực"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users size={16} />
                      <span>Sức chứa: {t.capacity}</span>
                    </div>

                    <span
                      className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full border
                        ${isSelected ? "bg-green-700 text-white border-green-800" : ""}
                        ${!isSelected && hasItems ? "bg-green-200 text-green-800 border-green-300" : ""}
                        ${!isSelected && !hasItems ? "bg-gray-100 text-gray-700" : ""}
                      `}
                    >
                     {(hasItems || t.status === "in_use")
    ? "Đang sử dụng"
    : "Trống"
}

                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
