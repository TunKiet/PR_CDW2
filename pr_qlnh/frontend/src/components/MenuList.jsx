import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import SelectTableModal from "../components/Table/SelectTableModal";

const MenuList = ({ 
  selectedTable,
  onSelectTable,
  addOrIncrementItem,
  tables,
  tableStatus,
  tableCarts      
}) => {


  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/categories").then((res) => {
      const list = res.data?.data || [];
      setCategories([{ category_id: "all", category_name: "Tất cả" }, ...list]);
    });
  }, []);

  const loadMenu = async (pageNum = 1, category = selectedCategory) => {
    setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/menu-items", {
        params: { page: pageNum, category_id: category },
      });
const items = (res.data.data || []).sort(
  (a, b) => new Date(b.created_at) - new Date(a.created_at)
);

setMenuItems(items);
    setLastPage(res.data.last_page);
    setPage(res.data.current_page);
    setLoading(false);
  };

  useEffect(() => {
    loadMenu(1, selectedCategory);
  }, [selectedCategory]);

  const addToCart = (item) => {
    if (!selectedTable) {
      alert("⚠️ Vui lòng chọn bàn trước!");
      return;
    }
    addOrIncrementItem(selectedTable.table_id, item);
  };

  return (
    <div className="flex-1 ml-64 p-6">
      <div className="bg-white rounded-2xl shadow-lg border px-5 py-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Đơn hàng mới</h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`px-4 py-2 rounded-lg text-white shadow transition
            ${
              selectedTable
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {selectedTable ? `${selectedTable.table_name}` : "Chọn bàn"}
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm px-5 mb-3"
            placeholder="Tìm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.category_id}
              onClick={() => setSelectedCategory(c.category_id)}
              className={`px-4 py-2 mb-3 rounded-full text-sm font-medium transition ${
                selectedCategory === c.category_id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {c.category_name}
            </button>
          ))}
        </div>

        {/* MENU LIST */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">Đang tải...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 mb-3">
            {menuItems
              .filter((i) =>
                i.menu_item_name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.menu_item_id}
                  onClick={() => addToCart(item)}
                  className="p-2 bg-white border rounded-xl shadow hover:border-indigo-400 cursor-pointer transition"
                >
                  <img
                    src={item.image_url}
                    className="rounded-xl w-full h-36 object-cover mb-3"
                  />
                  <h5 className="font-semibold truncate">{item.menu_item_name}</h5>
                  <p className="text-indigo-600 font-bold">
                    {Number(item.price).toLocaleString()}đ
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            disabled={page <= 1}
            onClick={() => loadMenu(page - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Trang trước
          </button>

          <button
            disabled={page >= lastPage}
            onClick={() => loadMenu(page + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>

      <SelectTableModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSelectTable={(table) => {
    onSelectTable(table);
    setIsModalOpen(false);
  }}
  selectedTable={selectedTable}
  tableCarts={tableCarts}
  tableStatus={tableStatus}
/>

    </div>
  );
};

export default MenuList;