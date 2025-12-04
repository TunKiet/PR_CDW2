import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHouse, FaBoxesStacked, FaFileInvoice, FaTruck, FaChartLine, FaMagnifyingGlass, FaPlus, FaChartSimple, FaHourglass, FaWallet, FaFileExport, FaList } from "react-icons/fa6";
import Sidebar from "../Sidebar";

const orders = [
    {
        code: "#NK-2023-001",
        supplier: { name: "Nông sản Sạch Việt", type: "Rau củ quả tươi", chip: "ns" },
        date: "24/10/2023",
        time: "08:30 AM",
        total: "5.250.000 ₫",
        creator: { initials: "NV", name: "Nguyễn Văn A" },
        status: "pending"
    },
    {
        code: "#NK-2023-002",
        supplier: { name: "Thịt Bò Nhập Khẩu", type: "Thịt đông lạnh", chip: "tb" },
        date: "23/10/2023",
        time: "14:15 PM",
        total: "12.800.000 ₫",
        creator: { initials: "TB", name: "Trần Thị B" },
        status: "shipping"
    },
    {
        code: "#NK-2023-003",
        supplier: { name: "Hải Sản Biển Đông", type: "Hải sản tươi sống", chip: "hs" },
        date: "22/10/2023",
        time: "09:00 AM",
        total: "8.450.000 ₫",
        creator: { initials: "NV", name: "Nguyễn Văn A" },
        status: "done"
    },
    {
        code: "#NK-2023-004",
        supplier: { name: "Gia Vị Tổng Hợp", type: "Gia vị & kho", chip: "gv" },
        date: "21/10/2023",
        time: "10:30 AM",
        total: "1.200.000 ₫",
        creator: { initials: "LC", name: "Lê Văn C" },
        status: "cancel"
    },
    {
        code: "#NK-2023-005",
        supplier: { name: "Nông sản Sạch Việt", type: "Rau củ quả tươi", chip: "ns" },
        date: "20/10/2023",
        time: "07:45 AM",
        total: "3.600.000 ₫",
        creator: { initials: "NV", name: "Nguyễn Văn A" },
        status: "done"
    },
];

const statusStyles = {
    pending: "bg-orange-100 text-orange-700 border border-orange-200",
    shipping: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-700",
    cancel: "bg-red-100 text-red-700",
};

const chipStyles = {
    ns: "bg-gradient-to-br from-orange-400 to-orange-500",
    tb: "bg-gradient-to-br from-purple-700 to-cyan-400",
    hs: "bg-gradient-to-br from-blue-400 to-blue-500",
    gv: "bg-gradient-to-br from-green-400 to-green-500",
};
const OrderPuscher = () => {
    const navigate = useNavigate();
    const handleOrderDetail = () => {
        navigate("/puscher-order-detail"); // đường dẫn tới CreateOrder.jsx
    };
    return (
        <div className="section">
            <div className="flex min-h-screen">
                <div className="w-[15%]"><Sidebar /></div>

                <div className="w-[85%] h-screen p-4 bg-gray-100 mx-auto overflow-y-auto">
                    <main className="flex-1 flex flex-col gap-4 min-w-0">
                        {/* Topbar */}
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-1">
                                <div className="font-bold text-lg">Nhập Kho Nguyên Liệu</div>
                                <div className="text-gray-500 text-sm">Theo dõi đơn & quản lý nhập hàng</div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <button className="bg-green-500 text-white px-4 py-2 rounded-lg! font-bold flex items-center gap-2"><FaPlus /> Tạo đơn mới</button>
                            </div>
                        </div>

                        {/* Stats cards */}
                        <div className="grid grid-cols-4 gap-3">
                            <div className="bg-white rounded-xl border border-gray-100 shadow p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-gray-500 text-xs font-semibold">Tổng đơn tháng này</div>
                                    <div className="font-bold text-lg">128</div>
                                    <div className="text-green-500 text-xs font-bold">+12.5% so với tháng trước</div>
                                </div>
                                <FaChartSimple className="text-cyan-500 text-2xl" />
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-gray-500 text-xs font-semibold">Chờ duyệt</div>
                                    <div className="font-bold text-lg">12</div>
                                    <div className="text-orange-500 text-xs font-bold">Cần xử lý ngay</div>
                                </div>
                                <FaHourglass className="text-orange-500 text-2xl" />
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-gray-500 text-xs font-semibold">Đang giao hàng</div>
                                    <div className="font-bold text-lg">5</div>
                                    <div className="text-gray-500 text-xs">Dự kiến đến hôm nay</div>
                                </div>
                                <FaTruck className="text-purple-700 text-2xl" />
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-gray-500 text-xs font-semibold">Chi phí tháng này</div>
                                    <div className="font-bold text-lg">45.2M</div>
                                    <div className="text-red-500 text-xs font-bold">+5% vượt ngân sách</div>
                                </div>
                                <FaWallet className="text-red-500 text-2xl" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow flex flex-col gap-3">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="text-left text-gray-500 font-bold border-b border-gray-100">
                                            <th className="p-3">Mã đơn</th>
                                            <th className="p-3">Nhà cung cấp</th>
                                            <th className="p-3">Ngày tạo</th>
                                            <th className="p-3">Tổng tiền</th>
                                            <th className="p-3">Người tạo</th>
                                            <th className="p-3">Trạng thái</th>
                                            <th className="p-3">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((o) => (
                                            <tr key={o.code} className="border-b border-gray-100">
                                                <td className="p-3 font-bold text-green-600">{o.code}</td>
                                                <td className="p-3 flex items-center gap-2">
                                                    <div className={`w-9 h-9 flex items-center justify-center rounded font-bold text-white ${chipStyles[o.supplier.chip]}`}>{o.supplier.chip.toUpperCase()}</div>
                                                    <div className="flex flex-col">
                                                        <div className="font-bold">{o.supplier.name}</div>
                                                        <div className="text-gray-400 text-xs">{o.supplier.type}</div>
                                                    </div>
                                                </td>
                                                <td className="p-3">{o.date}<br /><span className="text-gray-400 text-xs">{o.time}</span></td>
                                                <td className="p-3">{o.total}</td>
                                                <td className="p-3 flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded font-bold">{o.creator.initials}</div>
                                                    <div>{o.creator.name}</div>
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full font-bold text-xs ${statusStyles[o.status]}`}>{o.status === 'pending' ? 'Chờ duyệt' : o.status === 'shipping' ? 'Đang giao' : o.status === 'done' ? 'Đã nhập kho' : 'Đã huỷ'}</span>
                                                </td>
                                                <td className="p-3">
                                                    <button onClick={handleOrderDetail} className="px-3 py-1 border border-gray-200 rounded font-bold text-sm bg-white">Chi tiết</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div className="text-gray-400 text-xs">Hiển thị 1 đến 5 trong số 128 kết quả</div>
                                <div className="flex gap-1 items-center">
                                    <button className="px-2 py-1 rounded border border-gray-200 text-sm">&laquo;</button>
                                    <button className="px-2 py-1 rounded border border-gray-200 bg-green-50 text-green-600 text-sm font-bold">1</button>
                                    <button className="px-2 py-1 rounded border border-gray-200 text-sm">2</button>
                                    <button className="px-2 py-1 rounded border border-gray-200 text-sm">3</button>
                                    <button className="px-2 py-1 rounded border border-gray-200 text-sm">4</button>
                                    <button className="px-2 py-1 rounded border border-gray-200 text-sm">5</button>
                                    <button className="px-2 py-1 rounded border border-gray-200 text-sm">&rsaquo;</button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
export default OrderPuscher;
