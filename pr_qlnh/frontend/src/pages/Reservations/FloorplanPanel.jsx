// src/pages/ReservationCenter/FloorplanPanel.jsx
import React from "react";

/**
 * FloorplanPanel
 * Props:
 *  - TABLE_LAYOUT: object
 *  - floorData: object
 *  - openTableModal(tableId): function
 *
 * Pure UI (no state). Keeps same markup + classes as original file.
 */

export default function FloorplanPanel({ TABLE_LAYOUT, floorData, openTableModal }) {
  return (
    <section className="bg-white/50 p-6 rounded-xl shadow-inner min-h-[420px] border border-gray-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Trạng Thái Bàn Hiện Tại</h2>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "minmax(120px, auto)" }}>
        {/* Area A */}
        <div className="p-4 rounded-lg border-2 border-indigo-400 bg-indigo-50/70" style={{ gridColumn: "1 / 3", gridRow: "1 / 4" }}>
          <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b pb-2">Khu A (Bàn 2 Chỗ)</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(TABLE_LAYOUT).filter((id) => TABLE_LAYOUT[id].area === "A").map((id) => {
              const t = floorData[id] || { status: "Available", reservedBy: "" };
              return (
                <div key={id} className="table-card p-3 rounded-lg border-2 hover:scale-[1.03] transition transform" onClick={() => openTableModal(id)}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{id} ({TABLE_LAYOUT[id].seats} chỗ)</h4>
                    <span className={t.status === "Available" ? "text-green-600" : t.status === "Reserved" ? "text-yellow-600" : "text-red-600"}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t.status !== "Available" ? <><span className="font-medium">Người quản lý:</span> <span className="text-xs font-mono">{t.reservedBy}</span></> : "Sẵn sàng phục vụ"}
                  </p>
                  <button className="mt-3 w-full py-1.5 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Hành động</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Area B */}
        <div className="p-4 rounded-lg border-2 border-green-400 bg-green-50/70" style={{ gridColumn: "3 / 4", gridRow: "1 / 3" }}>
          <h3 className="text-lg font-bold text-green-800 mb-3 border-b pb-2">Khu B (Bàn 4 Chỗ)</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.keys(TABLE_LAYOUT).filter((id) => TABLE_LAYOUT[id].area === "B").map((id) => {
              const t = floorData[id] || { status: "Available", reservedBy: "" };
              return (
                <div key={id} className="table-card p-3 rounded-lg border-2 hover:scale-[1.03] transition transform" onClick={() => openTableModal(id)}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{id} ({TABLE_LAYOUT[id].seats} chỗ)</h4>
                    <span className={t.status === "Available" ? "text-green-600" : t.status === "Reserved" ? "text-yellow-600" : "text-red-600"}>{t.status}</span>
                  </div>
                  <p className="text-xs text-gray-600">{t.status !== "Available" ? `Người quản lý: ${t.reservedBy}` : "Sẵn sàng phục vụ"}</p>
                  <button className="mt-3 w-full py-1.5 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Hành động</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Area C */}
        <div className="p-4 rounded-lg border-2 border-yellow-400 bg-yellow-50/70" style={{ gridColumn: "4 / 5", gridRow: "1 / 3" }}>
          <h3 className="text-lg font-bold text-yellow-800 mb-3 border-b pb-2">Khu C (Bàn 6 Chỗ)</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.keys(TABLE_LAYOUT).filter((id) => TABLE_LAYOUT[id].area === "C").map((id) => {
              const t = floorData[id] || { status: "Available", reservedBy: "" };
              return (
                <div key={id} className="table-card p-3 rounded-lg border-2 hover:scale-[1.03] transition transform" onClick={() => openTableModal(id)}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{id} ({TABLE_LAYOUT[id].seats} chỗ)</h4>
                    <span className={t.status === "Available" ? "text-green-600" : t.status === "Reserved" ? "text-yellow-600" : "text-red-600"}>{t.status}</span>
                  </div>
                  <p className="text-xs text-gray-600">{t.status !== "Available" ? `Người quản lý: ${t.reservedBy}` : "Sẵn sàng phục vụ"}</p>
                  <button className="mt-3 w-full py-1.5 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Hành động</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service area */}
        <div className="p-4 rounded-lg border-2 border-gray-400 bg-gray-200/70 flex items-center justify-center" style={{ gridColumn: "3 / 5", gridRow: "3 / 4" }}>
          <p className="text-xl font-bold text-gray-700">Khu Dịch Vụ / Bar</p>
        </div>
      </div>
    </section>
  );
}
