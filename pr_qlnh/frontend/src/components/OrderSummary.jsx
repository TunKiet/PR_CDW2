// src/components/OrderSummary.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import axiosClient from "../api/axiosClient";

const OrderSummary = ({
  tables = [],
  table,
  cartItems = [],
  tableCustomers = {},
  setCustomerForTable,
  onUpdateQty,
  onRemoveItem,
  transferItem,
}) => {
  const navigate = useNavigate();

  const [openPayment, setOpenPayment] = useState(false);
  const [note, setNote] = useState("");

  const [customerPhone, setCustomerPhone] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  const [kitchenToast, setKitchenToast] = useState(false);

  const [transferState, setTransferState] = useState({
    isOpen: false,
    menuItem: null,
  });

  // ==========================
  // Tính tổng tiền
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // ==========================
  // Load thông tin thành viên khi đổi bàn
  
  useEffect(() => {
    if (!table) return;

    const info = tableCustomers[table.table_id];

    if (info) {
      setCustomerPhone(info.phone || "");
      setSearchMessage("");
    } else {
      setCustomerPhone("");
      setSearchMessage("");
    }
  }, [table]);

  // ==========================
  // Auto search customer khi gõ số điện thoại
  useEffect(() => {
  if (!table) return;

  // Nếu input trống → reset luôn
  if (!customerPhone.trim()) {
    setCustomerForTable(table.table_id, null);
    setSearchMessage("");
    return;
  }

  const delay = setTimeout(async () => {
    try {
      const res = await axiosClient.get(`/customers/search?phone=${customerPhone}`);

      if (!res.data || !res.data.customer_name) {
        setCustomerForTable(table.table_id, null);
        setSearchMessage("❌ Không tìm thấy thành viên");
      } else {
        setCustomerForTable(table.table_id, res.data);
        setSearchMessage("");
      }

    } catch (err) {
      console.error(err);
      setCustomerForTable(table.table_id, null);
      setSearchMessage("❌ Không tìm thấy thành viên");
    }
  }, 300); // debounce 300ms chống spam API

  return () => clearTimeout(delay);
}, [customerPhone, table]);


  // ==========================
  // Gửi bếp
  const handleSendToKitchen = () => {
    setKitchenToast(true);
    setTimeout(() => setKitchenToast(false), 2000);
  };

  // ==========================
  // Modal chuyển món
  const openTransferModal = (menuItem) => {
    setTransferState({ isOpen: true, menuItem });
  };

  const closeTransferModal = () => {
    setTransferState({ isOpen: false, menuItem: null });
  };

  const doTransfer = (toTableId, qty) => {
    if (!table) return;
    transferItem(table.table_id, toTableId, transferState.menuItem.menu_item_id, qty);
    closeTransferModal();
  };

  const assignedCustomer = table ? tableCustomers[table.table_id] : null;

  return (
    <>
      <div className="w-96 bg-white rounded-2xl shadow-lg border p-5 flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Đơn hàng</h2>
          <span className="text-gray-600 text-sm">
            Bàn: <b>{table ? table.table_name : "--"}</b>
          </span>
        </div>

        {/* CUSTOMER SEARCH */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Thành viên:</label>

          <input
  value={customerPhone}
  onChange={(e) => {
    let v = e.target.value.replace(/\D/g, ""); // chỉ lấy số
    if (v.length > 11) v = v.slice(0, 11);
    setCustomerPhone(v);
  }}
  maxLength={11}
  className="flex-1 border p-2 text-sm rounded-md"
  placeholder="Nhập số điện thoại"
/>


          {assignedCustomer && assignedCustomer.customer_name ? (
            <div className="mt-2 bg-green-50 border p-3 rounded text-sm">
              <b> 👤{assignedCustomer.customer_name}</b>
              <div>📞 {assignedCustomer.phone}</div>
              <div className="text-yellow-600">⭐ {assignedCustomer.points} điểm</div>
            </div>
          ) : (
            searchMessage && (
              <div className="mt-2 bg-red-50 border p-3 rounded text-sm text-red-600">
                {searchMessage}
              </div>
            )
          )}
        </div>

        {/* CART LIST */}
        <div className="mb-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-sm italic">Chưa có món nào.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.menu_item_id}
                className="flex justify-between items-center border-b pb-2 mb-2"
              >
                {/* LEFT */}
                <div className="w-40">
                  <span className="font-medium block truncate">
                    {item.menu_item_name}
                  </span>

                  <div className="flex mt-1 bg-gray-100 rounded overflow-hidden w-fit">
                    <button
                      className="px-2 hover:bg-gray-200"
                      onClick={() =>
                        onUpdateQty(
                          table.table_id,
                          item.menu_item_id,
                          Math.max(1, item.qty - 1)
                        )
                      }
                    >
                      –
                    </button>

                    <input
                      className="w-12 text-center border-x bg-white outline-none"
                      value={item.qty}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, ""); // chỉ số
                        if (v === "") v = 1;
                        v = Math.min(999, Math.max(1, Number(v)));
                        onUpdateQty(table.table_id, item.menu_item_id, v);
                      }}
                    />

                    <button
                      className="px-2 hover:bg-gray-200"
                      onClick={() =>
                        onUpdateQty(table.table_id, item.menu_item_id, item.qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-1">
                  <span>{(item.price * item.qty).toLocaleString()}đ</span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openTransferModal(item)}
                      className="px-2 py-1 text-xs bg-yellow-100 border rounded hover:bg-yellow-200"
                    >
                      ⇆
                    </button>

                    <button
                      onClick={() => onRemoveItem(table.table_id, item.menu_item_id)}
                      className="px-2 py-1 text-xs bg-red-100 border text-red-600 rounded hover:bg-red-200"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* TOTAL */}
        <div className="border-t pt-3">
          <div className="flex justify-between text-gray-700 text-sm">
            <span>Tổng cộng</span>
            <b>{total.toLocaleString()}đ</b>
          </div>
        </div>

        {/* NOTE */}
        <textarea
          rows={3}
          className="mt-3 border p-2 rounded w-full text-sm"
          placeholder="Ghi chú..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* BUTTONS */}
        <div className="flex mt-4 gap-2">
          <button
            onClick={handleSendToKitchen}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded"
          >
            Gửi bếp
          </button>

          <button
            disabled={cartItems.length === 0}
            onClick={() => setOpenPayment(true)}
            className={`flex-1 py-2 rounded text-white ${
              cartItems.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Thanh toán
          </button>
        </div>
      </div>

      {/* TOAST */}
      {kitchenToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-3 rounded shadow">
          ✔ Đã gửi bếp
        </div>
      )}

      {/* TRANSFER MODAL */}
      {transferState.isOpen && (
        <TransferModal
          menuItem={transferState.menuItem}
          tables={tables}
          fromTable={table}
          onClose={closeTransferModal}
          onConfirm={doTransfer}
        />
      )}

      {/* PAYMENT */}
      <PaymentModal
        isOpen={openPayment}
        onClose={() => setOpenPayment(false)}
        orderItems={cartItems}
        customer={assignedCustomer}
        note={note}
        tableId={table?.table_id}
        onCompletePayment={(order) => {
          localStorage.setItem("lastOrder", JSON.stringify(order));
          navigate("/order-management");
        }}
      />
    </>
  );
};

export default OrderSummary;

/* =========================================================
   TRANSFER MODAL
   ========================================================= */
const TransferModal = ({ tables = [], fromTable, menuItem, onClose, onConfirm }) => {
  const [toTableId, setToTableId] = useState(null);
  const [qty, setQty] = useState(1);

  if (!menuItem) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        
        <h3 className="text-xl font-bold mb-4">
          Chuyển: {menuItem.menu_item_name}
        </h3>

        {/* TABLE LIST */}
        <label className="block text-sm mb-2 font-medium">Chọn bàn đích:</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {tables
            .filter(t => t.table_id !== fromTable.table_id)
            .map(t => (
              <button
                key={t.table_id}
                onClick={() => setToTableId(t.table_id)}
                className={`px-3 py-2 rounded-lg border transition ${
                  toTableId === t.table_id
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {t.table_name}
              </button>
            ))}
        </div>

        {/* QTY */}
        <label className="block text-sm mb-2 font-medium">Số lượng</label>
        <input
          type="number"
          min="1"
          max={menuItem.qty}
          className="border rounded-lg px-3 py-2 w-28 mb-4"
          value={qty}
          onChange={e => {
            let v = Number(e.target.value);
            if (v < 1) v = 1;
            if (v > menuItem.qty) v = menuItem.qty;
            setQty(v);
          }}
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button className="px-4 py-2 rounded-lg bg-gray-200" onClick={onClose}>
            Hủy
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
            onClick={() => {
              if (!toTableId) return alert("Vui lòng chọn bàn đích!");
              onConfirm(toTableId, qty);
            }}
          >
            Xác nhận
          </button>
        </div>

      </div>
    </div>
  );
};
