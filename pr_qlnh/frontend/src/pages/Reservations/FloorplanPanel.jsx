import React, { useEffect, useState, useMemo, useCallback } from "react";
import axiosClient from "../../api/axiosClient";

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

  // Đã tối ưu hóa kích thước và thêm các class shadow/ring cho Modal
  const STATUS = useMemo(() => ({
    "trống": { 
      border: "border-green-500", bg: "bg-green-50", badgeBg: "bg-green-200", badgeText: "text-green-800", 
      iconText: "✅"
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
      // Sử dụng mock axiosClient
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
      // Sử dụng mock axiosClient
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
        // Giảm padding từ py-2 xuống py-1.5
        className={`flex items-center justify-center ${bgColor} text-white rounded-lg py-1.5 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 shadow-sm`}
        onClick={(e) => { 
          e.stopPropagation(); 
          updateStatus(tb.table_id, newStatus); 
        }}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <span className="animate-pulse">... Xử lý ...</span> 
        ) : (
          label
        )}
      </button>
    );

    return (
      <div className="mt-3 flex flex-col gap-2"> {/* Giảm margin-top */}

        {/* TRỐNG */}
        {st === "trống" && (
          <>
            <StatusButton newStatus="Đang Dùng" label="Sử dụng" bgColor="bg-green-600" />
            <StatusButton newStatus="Đã Đặt" label="Đặt trước" bgColor="bg-yellow-600" />
            <StatusButton newStatus="Bảo Trì" label="Bảo trì" bgColor="bg-gray-600" />
          </>
        )}

        {/* ĐÃ ĐẶT */}
        {st === "đã đặt" && (
          <>
            <StatusButton newStatus="Đang Dùng" label="Khách tới" bgColor="bg-green-600" />
            <StatusButton newStatus="Trống" label="Hủy đặt" bgColor="bg-red-600" />
          </>
        )}

        {/* ĐANG DÙNG */}
        {st === "đang dùng" && (
          <>
            <StatusButton newStatus="Chờ Dọn" label="Trả bàn" bgColor="bg-red-600" />
          </>
        )}

        {/* CHỜ DỌN */}
        {st === "chờ dọn" && (
          <>
            <StatusButton newStatus="Trống" label="Hoàn tất dọn" bgColor="bg-indigo-600" />
            <StatusButton newStatus="Bảo Trì" label="Bảo trì" bgColor="bg-gray-600" />
          </>
        )}

        {/* BẢO TRÌ */}
        {st === "bảo trì" && (
          <StatusButton newStatus="Trống" label="Mở lại bàn" bgColor="bg-green-600" />
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
    <div className="space-y-6 pb-10 font-sans">

      {/* Header và Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Trạng Thái Bàn Hiện Tại</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Tìm bàn (VD: T02)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
          />
          {searchKeyword && (
            <button
              onClick={() => { setSearchKeyword(""); }}
              className="px-3 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200 transition text-sm"
              title="Xóa tìm kiếm"
            >
              Xóa
            </button>
          )}
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
          <div className="text-center py-10 text-gray-500 border border-dashed rounded-xl">
              Không tìm thấy bàn nào phù hợp với từ khóa "{searchKeyword}".
          </div>
      )}
      
      {!loading && Object.keys(filteredGroups).map((cap) => {
        const tablesInGroup = filteredGroups[cap];
        
        return (
          <div key={cap} className="border border-gray-200 rounded-xl p-4 shadow-md bg-white"> {/* Giảm padding ngoài */}

            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Bàn {cap} Chỗ ({tablesInGroup.length} bàn)
            </h3>

            {/* Điều chỉnh lưới: 2 cột (sm), 4 cột (md), 5 cột (lg), 6 cột (xl) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"> {/* Giảm gap */}
              {tablesInGroup.map((tb) => {
                const st = normalize(tb.status);
                const style = STATUS[st] || STATUS["trống"];

                return (
                  <div
                    key={tb.table_id}
                    onClick={() => setSelectedTable(tb)} 
                    // Giảm padding thẻ bàn từ p-5 xuống p-3
                    className={`${style.bg} ${style.border} border-2 p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-lg hover:ring-2 ring-offset-1 ${style.border} transition-all duration-200`}
                  >
                    
                    <div className="flex flex-col items-center">
                        <div className="text-xl font-extrabold text-gray-800 truncate">
                            {tb.table_name}
                        </div>
                        <div className="text-sm font-medium text-gray-500 mt-0.5">
                            {tb.capacity} chỗ
                        </div>
                    </div>

                    <div
                      className={`mt-2 flex items-center justify-center w-full px-2 py-0.5 rounded-full text-xs font-semibold ${style.badgeBg} ${style.badgeText} text-center`}
                    >
                      {style.iconText} 
                      <span className="ml-1">{tb.status}</span>
                    </div>

                    {/* Vùng ghi chú đã ẩn bớt để item nhỏ hơn, chỉ hiển thị trong Modal */}
                    {/* {tb.note && <p className="text-xs text-gray-600 mt-2 italic truncate">Ghi chú: {tb.note}</p>} */}

                    {renderButtons(tb)}
                  </div>
                );
              })}
            </div>

          </div>
        );
      })}

      {/* Modal chi tiết bàn (Đã làm đẹp) */}
      {selectedTable && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
          onClick={() => setSelectedTable(null)}
        >
          <div
            className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-2xl border border-gray-100 transform scale-100 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header Modal */}
            <div className="border-b pb-3 mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-indigo-700">
                  {selectedTable.table_name}
                </h3>
                <div 
                    className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md ${STATUS[normalize(selectedTable.status)]?.badgeBg} ${STATUS[normalize(selectedTable.status)]?.badgeText}`}
                >
                    {selectedTable.status}
                </div>
            </div>
            
            {/* Thông tin Chi tiết */}
            <div className="space-y-3 text-gray-700 text-base">
                <div className="flex justify-between items-center py-1">
                    <span className="font-medium">Số chỗ ngồi:</span> 
                    <span className="font-bold text-gray-900">{selectedTable.capacity} chỗ</span>
                </div>
                
                <div className="border-t pt-3">
                    <p className="font-semibold text-gray-800 mb-1">Ghi chú:</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm italic min-h-[60px] border">
                        {selectedTable.note || "Không có ghi chú đặc biệt cho bàn này."}
                    </div>
                </div>
            </div>

            {/* Footer Modal & Action */}
            <div className="mt-6 border-t pt-4 flex flex-col items-stretch">
                <p className="text-sm text-gray-600 mb-2">Đổi trạng thái nhanh:</p>
                {/* Tái sử dụng renderButtons cho action trong modal */}
                {renderButtons(selectedTable)}

                <button
                    className="mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium"
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