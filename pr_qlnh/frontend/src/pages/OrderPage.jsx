import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import OrderList from "../components/OrderList";
import CartPanel from "../components/CartPanel";

const menuItems = [
  { name: "Phở Bò cái con c", price: 55000 },
  { name: "Bún Chả", price: 45000 },
  { name: "Nem Cua Bể", price: 60000 },
  { name: "Chả Cá Lã Vọng", price: 120000 },
  { name: "Gỏi Cuốn", price: 40000 },
  { name: "Cà Phê Sữa Đá", price: 25000 },
  { name: "Nước Dừa", price: 20000 },
  { name: "Trà Chanh", price: 20000 },
];

const membersData = {
  "0901234567": { name: "Nguyễn Văn A", rank: "Kim Cương" },
  "0987654321": { name: "Trần Thị B", rank: "Vàng" },
};

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState({});
  const [selectedTable, setSelectedTable] = useState("Chưa chọn");
  const [showModal, setShowModal] = useState(false);
  const [memberPhone, setMemberPhone] = useState("");
  const [memberFound, setMemberFound] = useState(null);

  const addItem = (item) => {
    setOrderItems((prev) => {
      const newItems = { ...prev };
      if (newItems[item.name]) newItems[item.name].quantity += 1;
      else newItems[item.name] = { ...item, quantity: 1 };
      return newItems;
    });
  };

  const removeItem = (name) => {
    setOrderItems((prev) => {
      const newItems = { ...prev };
      delete newItems[name];
      return newItems;
    });
  };

  const lookupMember = () => {
    if (membersData[memberPhone]) setMemberFound(membersData[memberPhone]);
    else setMemberFound(false);
  };

  const subtotal = Object.values(orderItems).reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-grow flex h-full space-x-6 p-6">
        <OrderList
          menuItems={menuItems}
          addItem={addItem}
          setShowModal={setShowModal}
        />
        <CartPanel
          orderItems={orderItems}
          removeItem={removeItem}
          subtotal={subtotal}
          selectedTable={selectedTable}
          memberPhone={memberPhone}
          setMemberPhone={setMemberPhone}
          memberFound={memberFound}
          lookupMember={lookupMember}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-5 rounded-lg w-full sm:w-4/5 lg:w-3/5 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Chọn Bàn</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {["Bàn 01", "Bàn 02", "Bàn 05", "Bàn 06", "Mang về"].map((b) => (
                <div
                  key={b}
                  onClick={() => {
                    setSelectedTable(b);
                    setShowModal(false);
                  }}
                  className="p-4 rounded-lg text-center cursor-pointer bg-green-100 hover:bg-green-200"
                >
                  <div className="text-xl font-bold text-green-800">{b}</div>
                  <div className="text-sm text-green-600 mt-1">Đang trống</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400"
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
