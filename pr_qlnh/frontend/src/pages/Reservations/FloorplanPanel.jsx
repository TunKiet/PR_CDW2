import React, { useEffect, useState, useMemo, useCallback } from "react";
import axiosClient from "../../api/axiosClient";
// ĐÃ LOẠI BỎ: import các icon từ @heroicons/react/24/outline;

// ====================================================================
// COMPONENT: FloorplanPanel
// ====================================================================

export default function FloorplanPanel() {
  const [groups, setGroups] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  /** ============================
   * CHUẨN HÓA VÀ STYLE TRẠNG THÁI
   * ============================ */
  const normalize = useCallback((s) =>
    String(s ?? "")
      .trim()
      .toLowerCase()
      .replace("đang sử dụng", "đang dùng")
      .replace("dang dung", "đang dùng")
  , []);

  const STATUS = useMemo(() => ({
    "trống": { 
      border: "border-green-500", bg: "bg-green-50", badgeBg: "bg-green-200", badgeText: "text-green-800", 
      iconText: "✅" // Thay icon bằng emoji hoặc text
    },
    "đã đặt": { 
      border: "border-yellow-500", bg: "bg-yellow-50", badgeBg: "bg-yellow-200", badgeText: "text-yellow-800",
      iconText: "🔔"
    },
    "đang dùng": { 
      border: "border-red-500", bg: "bg-red-50", badgeBg: "bg-red-200", badgeText: "text-red-800",
      iconText: "🍽️"
    },
    "chờ dọn": { 
      border: "border-purple-500", bg: "bg-purple-50", badgeBg: "bg-purple-200", badgeText: "text-purple-800",
      iconText: "⏳"
    },
    "bảo trì": { 
      border: "border-gray-500", bg: "bg-gray-100", badgeBg: "bg-gray-300", badgeText: "text-gray-800",
      iconText: "🛠️"
    },
  }), []);


  /** ============================
   * LOAD SƠ ĐỒ BÀN
   * ============================ */
  const loadTables = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/floorplan");
      let data = res.data.data || {};

      if (Array.isArray(data)) {
        const grouped = {};
        data.forEach((tb) => {
          const capKey = String(tb.capacity); 
          if (!grouped[capKey]) grouped[capKey] = [];
          grouped[capKey].push(tb);
        });
        data = grouped;
      }
      setGroups(data);
    } catch (err) {
      console.error("Lỗi load bàn:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTables();
  }, [loadTables]);


  /** ============================
   * UPDATE TRẠNG THÁI BÀN
   * ============================ */
  const updateStatus = useCallback(async (id, newStatus) => {
    setActionLoadingId(id);
    setSelectedTable(null);
    
    try {
      await axiosClient.put(`/tables/${id}/status`, { status: newStatus });
      await loadTables(); 
    } catch (err) {
      console.error("Lỗi đổi trạng thái:", err);
    } finally {
      setActionLoadingId(null);
    }
  }, [loadTables]);


  /** ============================
   * SMART BUTTONS – RENDER
   * ============================ */
  const renderButtons = useCallback((tb) => {
    const st = normalize(tb.status);
    const isLoading = actionLoadingId === tb.table_id;
    
    const StatusButton = ({ newStatus, label, bgColor, disabled = false }) => (
      <button
        className={`flex items-center justify-center ${bgColor} text-white rounded py-2 transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90`}
        onClick={(e) => { 
          e.stopPropagation(); 
          updateStatus(tb.table_id, newStatus); 
        }}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          // Thay thế loading spinner bằng text
          <span className="animate-pulse">... Đang xử lý ...</span> 
        ) : (
          label
        )}
      </button>
    );

    return (
      <div className="mt-4 flex flex-col gap-2">

        {/* TRỐNG */}
        {st === "trống" && (
          <>
            <StatusButton newStatus="Đang Dùng" label="Sử dụng (Khách tới)" bgColor="bg-green-600" />
            <StatusButton newStatus="Đã Đặt" label="Đặt trước" bgColor="bg-yellow-600" />
            <StatusButton newStatus="Bảo Trì" label="Bảo trì" bgColor="bg-gray-600" />
          </>
        )}

        {/* ĐÃ ĐẶT */}
        {st === "đã đặt" && (
          <>
            <StatusButton newStatus="Đang Dùng" label="Khách tới (Bắt đầu dùng)" bgColor="bg-green-600" />
            <StatusButton newStatus="Trống" label="Hủy đặt (Về Trống)" bgColor="bg-red-600" />
          </>
        )}

        {/* ĐANG DÙNG */}
        {st === "đang dùng" && (
          <>
            <StatusButton newStatus="Chờ Dọn" label="Trả bàn (Chờ dọn)" bgColor="bg-red-600" />
          </>
        )}

        {/* CHỜ DỌN */}
        {st === "chờ dọn" && (
          <>
            <StatusButton newStatus="Trống" label="Hoàn tất dọn (Về Trống)" bgColor="bg-indigo-600" />
            <StatusButton newStatus="Bảo Trì" label="Bảo trì" bgColor="bg-gray-600" />
          </>
        )}

        {/* BẢO TRÌ */}
        {st === "bảo trì" && (
          <StatusButton newStatus="Trống" label="Mở lại bàn (Về Trống)" bgColor="bg-green-600" />
        )}
      </div>
    );
  }, [actionLoadingId, normalize, updateStatus]);


  /** ============================
   * SEARCH & FILTER
   * ============================ */
  const filteredGroups = useMemo(() => {
    const results = {};
    const k = searchKeyword.toLowerCase().trim();

    Object.keys(groups).forEach((cap) => {
      const filteredTables = groups[cap].filter((tb) => {
        return (
          tb.table_name.toLowerCase().includes(k) ||
          (tb.note ?? "").toLowerCase().includes(k)
        );
      });

      if (filteredTables.length > 0) {
        results[cap] = filteredTables;
      }
    });
    return results;
  }, [groups, searchKeyword]);


  /** ============================
   * RENDER UI
   * ============================ */
  return (
    <div className="space-y-6 pb-10">

      {/* Header và Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Trạng Thái Bàn Hiện Tại</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Tìm bàn (VD: T02)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-64 focus:ring focus:ring-indigo-300"
          />
          <button
            onClick={() => { setSearchKeyword(""); }}
            className="px-3 py-2 bg-gray-100 border rounded-lg ml-2 hidden md:inline-block"
            title="Xóa"
          >
            Xóa
          </button>
        </div>
        
      </div>

      {/* Trạng thái Loading chung */}
      {loading && (
        <div className="text-center py-10 text-indigo-600 flex items-center justify-center">
            <span className="text-lg font-medium">Đang tải sơ đồ bàn...</span>
        </div>
      )}
      
      {/* Danh sách các nhóm bàn */}
      {!loading && Object.keys(filteredGroups).length === 0 && searchKeyword && (
          <div className="text-center py-10 text-gray-500">
              Không tìm thấy bàn nào phù hợp với từ khóa "{searchKeyword}".
          </div>
      )}
      
      {!loading && Object.keys(filteredGroups).map((cap) => {
        const tablesInGroup = filteredGroups[cap];
        
        return (
          <div key={cap} className="border border-gray-200 rounded-xl p-6 shadow-lg bg-white">

            <h3 className="text-xl font-bold mb-5 flex items-center text-gray-700">
              Bàn {cap} Chỗ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tablesInGroup.map((tb) => {
                const st = normalize(tb.status);
                const style = STATUS[st] || STATUS["trống"];

                return (
                  <div
                    key={tb.table_id}
                    onClick={() => setSelectedTable(tb)} 
                    className={`${style.bg} ${style.border} border-2 p-5 rounded-xl shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-200`}
                  >
                    
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-extrabold text-gray-800">
                            {tb.table_name}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            {tb.capacity} chỗ
                        </div>
                    </div>

                    <div
                      className={`mt-3 flex items-center inline-block px-3 py-1 rounded-full text-sm font-semibold ${style.badgeBg} ${style.badgeText}`}
                    >
                      {style.iconText} {/* Sử dụng iconText (emoji) */}
                      <span className="ml-1">{tb.status}</span>
                    </div>

                    <div className="text-sm text-gray-600 mt-3 min-h-[40px] italic border-t pt-2 border-gray-200">
                      Ghi chú: {tb.note || "Không có ghi chú đặc biệt."}
                    </div>

                    {renderButtons(tb)}
                  </div>
                );
              })}
            </div>

          </div>
        );
      })}

      {/* Modal chi tiết bàn */}
      {selectedTable && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTable(null)}
        >
          <div
            className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Chi tiết {selectedTable.table_name}
            </h3>
            
            <div className="space-y-3 text-gray-700">
                <p><strong>Số chỗ:</strong> {selectedTable.capacity}</p>
                <p><strong>Trạng thái:</strong> <span className="font-semibold">{selectedTable.status}</span></p>
                <p><strong>Ghi chú:</strong> {selectedTable.note ?? "Không có"}</p>
            </div>

            <div className="mt-6 border-t pt-4 flex justify-end">
              <button
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                onClick={() => setSelectedTable(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}