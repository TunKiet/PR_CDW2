import React, { useState } from "react";
import {
    FaBars,
    FaChartLine,
    FaFileAlt,
    FaBoxOpen,
    FaUsers,
    FaReceipt,
    FaCog,
    FaQuestionCircle,
    FaSearch,
    FaBell,
    FaFileExcel,
    FaPlus,
    FaShoppingBag,
    FaHourglassHalf,
    FaSyncAlt,
    FaTruck,
    FaCheckCircle,
    FaEllipsisV,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";


const orders = [
    {
        code: "#ORD-7829",
        customer: { name: "Trần Minh", phone: "0912***456", avatar: "tm" },
        products: [{ img: "path/to/product-image-1.jpg", count: 2 }],
        total: "2.450.000₫",
        status: "Chờ xác nhận",
        statusType: "warning",
        date: "10:30 SA, Hôm nay",
    },
    {
        code: "#ORD-7828",
        customer: { name: "Lê Thị Hoa", phone: "lethihoa@gmail.com", avatar: "lh" },
        products: [{ img: "path/to/product-image-2.jpg" }],
        total: "3.200.000₫",
        status: "Đã đóng gói",
        statusType: "info",
        date: "09:55 SA, Hôm nay",
    },
    {
        code: "#ORD-7827",
        customer: { name: "Nguyễn Kiến", phone: "0988***123", avatar: "nk" },
        products: [{ img: "path/to/product-image-3.jpg" }],
        total: "1.850.000₫",
        status: "Đang giao",
        statusType: "primary",
        date: "Hôm qua",
    },
    {
        code: "#ORD-7826",
        customer: { name: "Phạm Văn B", phone: "phamvanb@gmail.com", avatar: "pb" },
        products: [{ img: "path/to/product-image-4.jpg", count: 1 }],
        total: "950.000₫",
        status: "Hoàn thành",
        statusType: "success",
        date: "20/10/2023",
    },
    {
        code: "#ORD-7825",
        customer: { name: "Trường Hồng", phone: "0904***189", avatar: "th" },
        products: [{ img: "path/to/product-image-5.jpg" }],
        total: "4.500.000₫",
        status: "Đã hủy",
        statusType: "danger",
        date: "19/10/2023",
    },
];

const statusCards = [
    { title: "Tổng đơn hàng", count: "1,245", trend: "+12% tuần này", icon: <FaShoppingBag />, type: "primary" },
    { title: "Chờ xác nhận", count: "24", icon: <FaHourglassHalf />, type: "warning" },
    { title: "Đang xử lý", count: "56", icon: <FaSyncAlt />, type: "info" },
    { title: "Đang vận chuyển", count: "1,165", icon: <FaTruck />, type: "primary" },
    { title: "Đã giao thành công", count: "1,165", icon: <FaCheckCircle />, type: "success" },
];

const SupplierOrder = () => {
    const statusColor = {
        warning: "bg-orange-400",
        info: "bg-teal-400",
        primary: "bg-blue-500",
        success: "bg-green-500",
        danger: "bg-red-500",
    };

    const avatarColor = {
        tm: "bg-blue-600",
        lh: "bg-red-600",
        nk: "bg-yellow-400 text-black",
        pb: "bg-green-600",
        th: "bg-gray-500",
    };
    const navigate = useNavigate();
    const handleSupplierDetail = () => {
        navigate("/supplier-detail"); // đường dẫn tới CreateOrder.jsx
    };

    const tabs = ["Tất cả", "Chờ xác nhận", "Đang xử lý", "Đang giao", "Đã hủy"];
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="section">
            <div className="flex min-h-screen">
                <div className="w-[15%]"><Sidebar /></div>

                <div className="w-[85%] h-screen bg-gray-100 mx-auto overflow-y-auto">
                    {/* Top header */}
                    <div className="flex justify-between items-center bg-white p-4 rounded shadow sticky top-0 z-10">
                        <div className="flex items-center border border-gray-200 rounded px-3 py-1 w-96">
                            <FaSearch className="text-gray-400 mr-2" />
                            <input type="text" placeholder="Tìm kiếm đơn hàng, khách hàng..." className="outline-none w-full text-sm" />
                        </div>
                        <div className="flex items-center gap-4">
                            <FaBell className="text-gray-500 text-lg cursor-pointer" />
                            <FaQuestionCircle className="text-gray-500 text-lg cursor-pointer" />
                            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-medium">NV</div>
                        </div>
                    </div>
                    <main className="flex-1 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-medium">Quản lý đơn hàng</h3>
                                <p className="text-sm text-gray-500">Theo dõi và cập nhật trạng thái đơn hàng từ khách hàng.</p>
                            </div>
                            <div className="md:col-span-2 flex gap-2 justify-start md:justify-end">
                                <button className="px-4 py-2 border border-gray-300 rounded text-gray-500 flex items-center gap-1 text-sm">
                                    <FaFileExcel /> Xuất Excel
                                </button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-1 text-sm">
                                    <FaPlus /> Tạo đơn mới
                                </button>
                            </div>
                        </div>

                        {/* Status cards */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                            {statusCards.map((card, idx) => (
                                <div key={idx} className="bg-white p-4 rounded shadow flex flex-col justify-between">
                                    <div className="flex justify-between mb-3">
                                        <div className="text-sm text-gray-500">{card.title}</div>
                                        {card.trend && <div className="text-xs font-medium text-green-500">{card.trend}</div>}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-2xl font-bold">{card.count}</div>
                                        <div className={`text-3xl opacity-30 ${card.type === "primary" ? "text-blue-500" : card.type === "warning" ? "text-orange-400" : card.type === "info" ? "text-teal-400" : card.type === "success" ? "text-green-500" : ""}`}>
                                            {card.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-7 gap-4 mt-3">
                            <div className="md:col-span-5">
                                <div className="bg-white p-4 rounded shadow">
                                    <div className="flex justify-between mb-4">
                                        <div className="flex gap-2">
                                            {tabs.map((tab, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveTab(idx)}
                                                    className={`px-3 py-1 rounded text-sm font-medium no-underline ${activeTab === idx
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "text-black hover:bg-blue-50 hover:text-blue-500"}`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>
                                    </div>


                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-gray-400 uppercase text-xs">
                                                
                                                <th className="p-2">MÃ ĐƠN HÀNG</th>
                                                <th className="p-2">KHÁCH HÀNG</th>
                                                <th className="p-2">SẢN PHẨM</th>
                                                <th className="p-2">TỔNG TIỀN</th>
                                                <th className="p-2">TRẠNG THÁI</th>
                                                <th className="p-2">NGÀY</th>
                                                <th className="p-2"></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {orders.map((order, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="p-2 text-blue-500 font-medium"><a className="no-underline!" href="#">{order.code}</a></td>

                                                    <td className="p-2">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${avatarColor[order.customer.avatar]}`}>
                                                                {order.customer.avatar.toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{order.customer.name}</span>
                                                                <span className="text-xs text-gray-400">{order.customer.phone}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="p-2 flex items-center gap-1">
                                                        {order.products.map((prod, i) => (
                                                            <div key={i} className="flex items-center gap-1">
                                                                <img src={prod.img} className="w-8 h-8 object-cover rounded" />
                                                                {prod.count && (
                                                                    <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                                                                        +{prod.count}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </td>

                                                    <td className="p-2">{order.total}</td>

                                                    <td className="p-2">
                                                        <span className={`text-white px-2 py-1 rounded text-xs ${statusColor[order.statusType]}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>

                                                    <td className="p-2">{order.date}</td>

                                                    <td className="p-2 text-gray-400 cursor-pointer">
                                                        <FaEllipsisV onClick={handleSupplierDetail} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>


                                    {/* Pagination */}
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="text-sm text-gray-500">Hiển thị 1 đến 5 trong số 128 kết quả</div>
                                        <div className="flex items-center gap-1">
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-50" disabled><FaChevronLeft /></button>
                                            {[1, 2, 3, "...", 8].map((p, idx) => (
                                                <button key={idx} className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm ${p === 1 ? "bg-blue-500 text-white border-blue-500 font-medium" : ""}`}>{p}</button>
                                            ))}
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-500"><FaChevronRight /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick report */}
                            <div className="md:col-span-2 flex flex-col gap-4">
                                <div className="bg-white p-4 rounded shadow">
                                    <h3 className="font-semibold mb-2">Báo cáo nhanh</h3>
                                    <p className="text-sm text-gray-500 mb-2">Xem hiệu suất bán hàng tuần này so với tuần trước.</p>
                                    <button className="w-full py-2 bg-blue-500 text-white rounded">Xem chi tiết</button>
                                </div>

                                <div className="bg-white p-4 rounded shadow">
                                    <h3 className="font-semibold mb-2">Cần xử lý gấp</h3>
                                    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Đơn #ORD-7829 quá hạn</span>
                                        <button className="px-2 py-1 border border-red-500 text-red-500 rounded text-xs">Xử lý</button>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Kho HCM sắp hết hàng</span>
                                        <button className="px-2 py-1 border border-yellow-400 text-yellow-400 rounded text-xs">Nhập</button>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded shadow">
                                    <h3 className="font-semibold mb-2">Hoạt động gần đây</h3>
                                    <div className="relative pl-5 border-l-2 border-gray-200">
                                        <div className="absolute w-2 h-2 rounded-full bg-green-500 left-[-7px] top-2"></div>
                                        <p className="text-sm font-medium">Nguyễn Văn A đã xác nhận đơn hàng #ORD-7829</p>
                                        <span className="text-xs text-gray-400 block mt-1">5 phút trước</span>
                                    </div>
                                    <div className="relative pl-5 mt-2 border-l-2 border-gray-200">
                                        <div className="absolute w-2 h-2 rounded-full bg-blue-500 left-[-7px] top-2"></div>
                                        <p className="text-sm font-medium">Hệ thống đã cập nhật tồn kho</p>
                                        <span className="text-xs text-gray-400 block mt-1">1 giờ trước</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SupplierOrder;
