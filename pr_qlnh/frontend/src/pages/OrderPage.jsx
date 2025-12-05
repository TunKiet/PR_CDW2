import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MenuList from "../components/MenuList";
import OrderSummary from "../components/OrderSummary";
import axiosClient from "../api/axiosClient";

const OrderPage = () => {
  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);

  // 🚀 Load dữ liệu từ localStorage
  const [tableCarts, setTableCarts] = useState(() =>
    JSON.parse(localStorage.getItem("tableCarts") || "{}")
  );

  const [tableCustomers, setTableCustomers] = useState(() =>
    JSON.parse(localStorage.getItem("tableCustomers") || "{}")
  );

  const [tableStatus, setTableStatus] = useState(() =>
    JSON.parse(localStorage.getItem("tableStatus") || "{}")
  );
  const clearTableCart = (tableId) => {
  setTableCarts(prev => ({ ...prev, [tableId]: [] }));

  setTableStatus(prev => ({ ...prev, [tableId]: "available" }));

  setTableCustomers(prev => ({ ...prev, [tableId]: null }));
};


useEffect(() => {
  const newStatus = {};

  Object.keys(tableCarts).forEach((tableId) => {
    newStatus[tableId] = tableCarts[tableId].length > 0 ? "in_use" : "available";
  });

  setTableStatus(newStatus);
}, [tableCarts]);

  // Save to localStorage each time changes
  useEffect(() => {
    localStorage.setItem("tableCarts", JSON.stringify(tableCarts));
  }, [tableCarts]);

  useEffect(() => {
    localStorage.setItem("tableCustomers", JSON.stringify(tableCustomers));
  }, [tableCustomers]);

  useEffect(() => {
    localStorage.setItem("tableStatus", JSON.stringify(tableStatus));
  }, [tableStatus]);

  // Load danh sách bàn từ API
  useEffect(() => {
    axiosClient.get("/tables").then((res) => {
      const data = res.data?.data || res.data || [];
      setTables(data);
    });
  }, []);

  // Khi chọn bàn
  const handleSelectTable = (table) => {
    setSelectedTable(table);

    setTableCarts((prev) => ({
      ...prev,
      [table.table_id]: prev[table.table_id] || []
    }));
  };

  // thêm món
  // thêm món
const addOrIncrementItem = (tableId, item) => {
  setTableCarts(prev => {
    const cart = prev[tableId] || [];

    // Kiểm tra món đã tồn tại chưa
    const existIndex = cart.findIndex(i => i.menu_item_id === item.menu_item_id);

    let updatedCart;

    if (existIndex !== -1) {
      // ✔ Nếu món đã tồn tại → tăng qty và đưa lên đầu
      const existItem = { 
        ...cart[existIndex], 
        qty: cart[existIndex].qty + 1 
      };

      const newCart = [...cart];
      newCart.splice(existIndex, 1); // xóa vị trí cũ

      updatedCart = [existItem, ...newCart]; // đưa món đó lên đầu
    } else {
      // ✔ Món mới → thêm lên đầu
      updatedCart = [{ ...item, qty: 1 }, ...cart];
    }

    // ✔ Khi thêm món => chuyển bàn sang đang sử dụng
    setTableStatus(s => ({ ...s, [tableId]: "in_use" }));

    return { ...prev, [tableId]: updatedCart };
  });
};


  const onUpdateQty = (tableId, menuId, qty) => {
  setTableCarts(prev => ({
    ...prev,
    [tableId]: prev[tableId].map(i =>
      i.menu_item_id === menuId ? { ...i, qty } : i
    )
  }));
};


  const onRemoveItem = (tableId, menuId) => {
  setTableCarts(prev => ({
    ...prev,
    [tableId]: prev[tableId].filter(i => i.menu_item_id !== menuId)
  }));
};


  // chọn thành viên
  const setCustomerForTable = (tableId, customerObj) => {
    setTableCustomers(prev => ({
      ...prev,
      [tableId]: customerObj
    }));
  };

  // chuyển món
  const transferItem = (fromTable, toTable, menuId, qty) => {
    setTableCarts(prev => {
      const from = [...prev[fromTable]];
      const to = [...(prev[toTable] || [])];

      const idx = from.findIndex(i => i.menu_item_id === menuId);
      if (idx === -1) return prev;

      const item = { ...from[idx] };

      if (qty >= item.qty) {
        from.splice(idx, 1);
      } else {
        item.qty -= qty;
        from[idx] = item;
      }

      const existTo = to.find(i => i.menu_item_id === menuId);
      if (existTo) {
        existTo.qty += qty;
      } else {
        to.push({ ...item, qty });
      }

      return { ...prev, [fromTable]: from, [toTable]: to };
    });

    // bàn đích chuyển sang in_use
    setTableStatus(s => ({ ...s, [toTable]: "in_use" }));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <MenuList
        tables={tables}
        selectedTable={selectedTable}
        tableStatus={tableStatus}
        tableCarts={tableCarts}
        onSelectTable={handleSelectTable}
        addOrIncrementItem={addOrIncrementItem}
      />

      <OrderSummary
        tables={tables}
        table={selectedTable}
        cartItems={selectedTable ? tableCarts[selectedTable.table_id] : []}
        onUpdateQty={onUpdateQty}
        onRemoveItem={onRemoveItem}
        transferItem={transferItem}
        tableCustomers={tableCustomers}
        setCustomerForTable={setCustomerForTable}
        clearTableCart={clearTableCart}       
        setSelectedTable={setSelectedTable}
      />
    </div>
  );
};

export default OrderPage;