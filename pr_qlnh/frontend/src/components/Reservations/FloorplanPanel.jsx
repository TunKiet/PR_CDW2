import React from "react";

export default function FloorplanPanel({ layout, floorData, onOpenTable }) {
  return (
    <section className="bg-white/50 p-6 rounded-xl shadow-inner min-h-[420px] border border-gray-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Trạng Thái Bàn Hiện Tại</h2>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "minmax(120px, auto)" }}>
        
        {/* Khu A */}
        <div className="p-4 rounded-lg border-2 border-indigo-400 bg-indigo-50/70">
          <h3 className="text-lg font-bold text-indigo-800 mb-3 border-b pb-2">Khu A (Bàn 2 Chỗ)</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(layout)
              .filter((id) => layout[id].area === "A")
              .map((id) => (
                <TableCard
                  key={id}
                  id={id}
                  table={layout[id]}
                  status={floorData[id]}
                  onClick={() => onOpenTable(id)}
                />
              ))}
          </div>
        </div>

        {/* Khu B */}
        <div className="p-4 rounded-lg border-2 border-green-400 bg-green-50/70">
          <h3 className="text-lg font-bold text-green-800 mb-3 border-b pb-2">Khu B (Bàn 4 Chỗ)</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.keys(layout)
              .filter((id) => layout[id].area === "B")
              .map((id) => (
                <TableCard
                  key={id}
                  id={id}
                  table={layout[id]}
                  status={floorData[id]}
                  onClick={() => onOpenTable(id)}
                />
              ))}
          </div>
        </div>

        {/* Khu C */}
        <div className="p-4 rounded-lg border-2 border-yellow-400 bg-yellow-50/70">
          <h3 className="text-lg font-bold text-yellow-800 mb-3 border-b pb-2">Khu C (Bàn 6 Chỗ)</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.keys(layout)
              .filter((id) => layout[id].area === "C")
              .map((id) => (
                <TableCard
                  key={id}
                  id={id}
                  table={layout[id]}
                  status={floorData[id]}
                  onClick={() => onOpenTable(id)}
                />
              ))}
          </div>
        </div>

        {/* Khu dịch vụ */}
        <div className="p-4 rounded-lg border-2 border-gray-400 bg-gray-200/70 flex items-center justify-center col-span-2">
          <p className="text-xl font-bold text-gray-700">Khu Dịch Vụ / Bar</p>
        </div>
      </div>
    </section>
  );
}


// COMPONENT CARD BÀN
function TableCard({ id, table, status, onClick }) {
  const color =
    status.status === "Available"
      ? "text-green-600"
      : status.status === "Reserved"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div
      className="table-card p-3 rounded-lg border-2 hover:scale-[1.03] transition transform cursor-pointer bg-white"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-bold text-gray-900">
          {id} ({table.seats} chỗ)
        </h4>
        <span className={color}>{status.status}</span>
      </div>

      <p className="text-xs text-gray-600">
        {status.status !== "Available" ? (
          <>
            <span className="font-medium">Người quản lý:</span>{" "}
            <span className="text-xs font-mono">{status.reservedBy}</span>
          </>
        ) : (
          "Sẵn sàng phục vụ"
        )}
      </p>

      <button className="mt-3 w-full py-1.5 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700">
        Hành động
      </button>
    </div>
  );
}
