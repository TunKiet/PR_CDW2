import MenuItem from "../components/MenuItem";
import CartPanel from "../components/CartPanel";

export default function OrderPage() {
  const menu = [
    { name: "Phở Bò", price: 55000 },
    { name: "Bún Chả", price: 45000 },
    { name: "Nem Cua Bể", price: 60000 },
    { name: "Chả Cá Lã Vọng", price: 120000 },
    { name: "Gỏi Cuốn", price: 40000 },
    { name: "Cà Phê Sữa Đá", price: 25000 },
    { name: "Nước Dừa", price: 20000 },
    { name: "Trà Chanh", price: 20000 },
  ];

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Đơn hàng mới</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Chọn bàn
          </button>
        </div>

        <div className="flex space-x-2 mb-6">
          {["Tất cả", "Đồ uống", "Món khai vị", "Món chính", "Tráng miệng", "Hải sản"].map((tab) => (
            <button
              key={tab}
              className="px-4 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 text-sm"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {menu.map((item) => (
            <MenuItem key={item.name} name={item.name} price={item.price} />
          ))}
        </div>
      </div>

      <CartPanel />
    </div>
  );
}
