import React, { useEffect, useState } from "react";
import { FaHouse, FaBoxesStacked, FaFileInvoice, FaTruck, FaChartLine, FaMagnifyingGlass, FaPlus, FaChartSimple, FaHourglass, FaWallet, FaFileExport, FaList } from "react-icons/fa6";
import Sidebar from "../Sidebar";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from "react-router-dom";

const statusStyles = {
    ordered: "bg-orange-100 text-orange-700 border border-orange-200",
    pending: "bg-gray-600 text-white",
    shipping: "bg-blue-100 text-blue-800",
    received: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const endPoint = 'http://localhost:8000/api';

const OrderPuscher = () => {
    const navigate = useNavigate();

    const formatVND = (value) => {
        return Number(value).toLocaleString('vi-VN') + ' đ';
    };

    // Hàm format ngày và giờ riêng
    const formatDateTime = (datetime) => {
        const dateObj = new Date(datetime);

        const date = dateObj.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const time = dateObj.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        return { date, time };
    };


    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [dataOrders, setDataOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const fetchDataOrder = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${endPoint}/purchase-orders-all?per_page=5&page=${page}`);
            setOrders(res.data);
            setDataOrders(res.data.orders);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataOrder();
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
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
                        </div>

                        {/* Stats cards */}
                        <div className="grid grid-cols-4 gap-3">
                            <div className="bg-white rounded-xl border border-gray-100 shadow p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-gray-500 text-xs font-semibold">Tổng đơn tháng này</div>
                                    <div className="font-bold text-lg">{orders.total_orders}</div>
                                    <div className="text-green-500 text-xs font-bold">+12.5% so với tháng trước</div>
                                </div>
                                <FaChartSimple className="text-cyan-500 text-2xl" />
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-gray-500 text-xs font-semibold">Chờ xử lý</div>
                                    <div className="font-bold text-lg">{orders.pending_orders}</div>
                                    <div className="text-orange-500 text-xs font-bold">Cần xử lý ngay</div>
                                </div>
                                <FaHourglass className="text-orange-500 text-2xl" />
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-gray-500 text-xs font-semibold">Đang giao hàng</div>
                                    <div className="font-bold text-lg">{orders.delivering_orders}</div>
                                    <div className="text-gray-500 text-xs">Dự kiến đến hôm nay</div>
                                </div>
                                <FaTruck className="text-purple-700 text-2xl" />
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow p-3 flex justify-between items-center">
                                <div>
                                    <div className="text-gray-500 text-xs font-semibold">Chi phí tháng này</div>
                                    <div className="font-bold text-lg">{formatVND(orders.total_cost)}</div>
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
                                            <th className="p-3">Trạng thái</th>
                                            <th className="p-3">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loading ? (
                                                <tr className='text-center'>
                                                    <td>
                                                        <CircularProgress />
                                                    </td>
                                                </tr>
                                            ) : dataOrders.length > 0 ? (
                                                dataOrders.map((order) => (
                                                    <tr key={order.purchase_order_id} className="border-b border-gray-100">
                                                        <td className="p-3 font-bold text-green-600">#DH{order.purchase_order_id}</td>
                                                        <td className="p-3 flex items-center gap-2">
                                                            <div className="flex flex-col">
                                                                <div className="font-bold">{order.supplier_name}</div>
                                                                <div className="text-gray-400 text-xs">Hai san</div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3">{formatDateTime(order.created_at).date}<br /><span className="text-gray-400 text-xs">{formatDateTime(order.created_at).time}</span></td>
                                                        <td className="p-3">{formatVND(order.total_cost)}</td>

                                                        <td className="p-3">
                                                            <span className={`px-2 py-1 rounded-full font-bold text-xs ${statusStyles[order.status]}`}>{order.status === 'ordered' ? 'Đã đặt' : order.status === 'pending' ? 'Chờ xử lý' : order.status === 'shipping' ? 'Đang giao' : order.status === 'received' ? 'Đã nhập kho' : 'Đã huỷ'}</span>
                                                        </td>
                                                        <td className="p-3">
                                                            <button onClick={() => navigate(`/puscher-order-detail/${order.purchase_order_id}`)} className="px-3 py-1 border border-gray-200 rounded font-bold text-sm bg-white">Chi tiết</button>
                                                        </td>
                                                    </tr>

                                                ))
                                            ) : (
                                                <tr className='text-center'>
                                                    <td>Không có dữ liệu</td>
                                                </tr>
                                            )
                                        }

                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination-ingredient-input flex justify-center pt-3">
                                <Pagination count={totalPages} page={page} onChange={handlePageChange} variant="outlined" color="primary" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
export default OrderPuscher;
