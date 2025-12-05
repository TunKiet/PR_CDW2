import React, { useEffect, useState } from 'react';
import {
    FaChartLine, FaFileAlt, FaBoxes, FaBuilding, FaReceipt, FaCoins,
    FaDollarSign, FaSignOutAlt, FaPrint, FaFilePdf, FaChevronDown, FaUser,
    FaCalendarAlt, FaCalendarCheck, FaTruck, FaPhoneAlt, FaEnvelope,
    FaMapMarkerAlt, FaUserTie, FaListAlt, FaMoneyBillWave, FaHistory,
    FaCheckCircle, FaCircleNotch, FaTimes, FaShareSquare, FaCheck
} from 'react-icons/fa';
import Sidebar from '../Sidebar';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';


const endPoint = 'http://localhost:8000/api';

const OrderPuscherDetail = () => {

    const { purchase_order_id } = useParams();

    console.log(purchase_order_id);

    const [orderDetail, setOrderDetail] = useState(null);
    const [ingredients, setIngredients] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);

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

    const formatVND = (value) => {
        return Number(value).toLocaleString('vi-VN') + ' đ';
    };

    useEffect(() => {
        const fetchOrderDetail = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${endPoint}/purchase-orders/${purchase_order_id}`);
                setOrderDetail(res.data);

                // Set activeStep dựa vào status trong DB
                const stepIndex = orderSteps.findIndex(step => step.key === res.data.status);
                setActiveStep(stepIndex !== -1 ? stepIndex : 0);
                setIngredients(res.data.items);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [purchase_order_id]);

    const orderSteps = [
        {
            key: 'ordered',
            label: 'Đơn hàng đã được tạo',
            description: '24/10/2023 | 08:30 AM | bởi Nguyễn Văn A',
            icon: <FaCheckCircle className="text-green-500" />,
        },
        {
            key: 'pending',
            label: 'Đơn hàng đang được xử lý',
            description: 'Đang chờ xử lý...',
            icon: <FaCircleNotch className="text-yellow-500" />,
        },
        {
            key: 'shipping',
            label: 'Đang giao hàng',
            description: 'Nhân viên giao nhận đang di chuyển tới địa chỉ',
            icon: <FaTruck className="text-blue-500" />,
        },
        {
            key: 'received',
            label: 'Hoàn tất đơn hàng',
            description: 'Đơn hàng đã giao thành công',
            icon: <FaCheckCircle className="text-green-500" />,
        },
        {
            key: 'cancelled',
            label: 'Đơn hàng bị hủy',
            description: 'Đơn hàng đã bị hủy',
            icon: <FaTimes className="text-red-500" />,
        },
    ];


    // const [activeStep, setActiveStep] = useState(
    //     orderDetail ? orderSteps.findIndex(step => step.key === orderDetail.status) : 0
    // );


    const handleNext = async () => {
        const nextStep = Math.min(activeStep + 1, orderSteps.length - 1);
        setActiveStep(nextStep);

        const newStatus = orderSteps[nextStep].key; // lấy key trực tiếp từ orderSteps

        try {
            await axios.patch(
                `${endPoint}/purchase-orders/${purchase_order_id}/update-status`,
                { status: newStatus }
            );
            console.log('Cập nhật trạng thái thành công:', newStatus);

            // Cập nhật trạng thái trong state orderDetail để UI luôn đồng bộ
            setOrderDetail(prev => ({ ...prev, status: newStatus }));
        } catch (err) {
            console.error('Cập nhật trạng thái lỗi:', err);
        }
    };


    const handleBack = () => {
        setActiveStep(prev => Math.max(prev - 1, 0));
    };


    return (
        <div className="section">
            <div className="flex min-h-screen">
                <div className="w-[15%]"><Sidebar /></div>

                <div className="w-[85%] h-screen bg-gray-100 mx-auto overflow-y-auto">
                    {/* Top Header */}
                    <header className="bg-white p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
                        <div className="flex gap-2 items-center ms-auto">
                            <button className="px-3 py-1 border border-gray-300 rounded hover:border-blue-600 hover:text-blue-600 flex items-center"><FaPrint className="mr-1" /> In đơn</button>
                            <button className="px-3 py-1 border border-gray-300 rounded hover:border-blue-600 hover:text-blue-600 flex items-center"><FaFilePdf className="mr-1" /> Tải PDF</button>

                        </div>
                    </header>
                    <main className="flex-1 p-2 ml-56">
                        <div className="p-6!">
                            {/* Order Summary */}
                            <div className="bg-blue-900 text-white p-6!  rounded-lg mb-6 grid grid-cols-12 gap-6">
                                <div className="col-span-8 flex flex-col gap-4">
                                    {orderDetail && (
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-bold">#DH{orderDetail.purchase_order_id}</span>
                                            <span className="px-2 py-1 bg-green-500 rounded-full text-xs font-medium">{orderDetail.status === 'ordered' ? 'Đã đặt' : orderDetail.status === 'pending' ? 'Chờ xử lý' : orderDetail.status === 'shipping' ? 'Đang giao' : orderDetail.status === 'received' ? 'Đã nhập kho' : 'Đã huỷ'}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-8">
                                        <div className="flex items-start gap-2">
                                            <FaCalendarAlt className="mt-1" />
                                            {orderDetail && (
                                                <div>
                                                    <div className="text-xs opacity-70">Ngày tạo đơn</div>
                                                    <div className="font-medium">{formatDateTime(orderDetail.created_at).date}</div>
                                                    <div className="text-xs opacity-70">{formatDateTime(orderDetail.created_at).time}</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <FaCalendarCheck className="mt-1" />
                                            {orderDetail && (
                                                <div>
                                                    <div className="text-xs opacity-70">Ngày giao dự kiến</div>
                                                    <div className="font-medium">{formatDateTime(orderDetail.order_date).date}</div>
                                                    <div className="text-xs opacity-70">{formatDateTime(orderDetail.order_date).time}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {orderDetail && (
                                    <div className="col-span-4 flex flex-col items-end justify-center">
                                        <div className="text-sm opacity-70">Giá trị đơn hàng</div>
                                        <div className="text-3xl font-bold text-yellow-300">{formatVND(orderDetail.total_cost)}</div>
                                    </div>
                                )}
                            </div>

                            {/* Order Content Grid */}
                            <div className="grid grid-cols-12 gap-6 mt-4">
                                <div className="col-span-4 flex flex-col gap-6">
                                    {/* Supplier Info */}
                                    <div className="bg-white p-4 rounded shadow">
                                        <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4 flex items-center gap-2"><FaBuilding size={20} color='green' /> Thông tin nhà cung cấp</h4>
                                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
                                            {orderDetail && (
                                                <div>
                                                    <div className="font-semibold text-sm">{orderDetail.supplier_name}</div>
                                                    <div className="text-xs text-gray-400">Mã NCC: NCC-001</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <div className="flex items-center gap-2 p-2"><FaPhoneAlt className="w-4" /> 0911 224 564</div>
                                            <div className="flex items-center gap-2 p-2"><FaEnvelope className="w-4" /> contact@nongsansach.vn</div>
                                            <div className="flex items-center gap-2 p-2"><FaMapMarkerAlt className="w-4" /> Đường Cộng Hòa, Q.Tân Bình, TP.HCM</div>
                                            <div className="flex items-center gap-2 p-2"><FaUserTie className="w-4" /> Nguyễn Văn B</div>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="bg-white p-4 rounded shadow">
                                        <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4 flex items-center gap-2"><FaMapMarkerAlt size={20} color='green' /> Địa chỉ giao hàng</h4>
                                        <div className="text-sm">
                                            <div className="font-medium text-sm mb-1">Nhà hàng D</div>
                                            <div className="text-gray-600 mb-3">53 Võ Văn Ngân</div>
                                            <div className="text-gray-600 mb-1">Người nhận: Quản lý</div>
                                            <div className="text-gray-600 mb-1">SĐT: 0912 345 678</div>
                                            <div className="mt-2 border-l-4 p-2 border-blue-600 bg-green-50 text-green-600 text-sm">Ghi chú giao hàng: Vui lòng giao hàng trước 08:30 phút.</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-span-8 flex flex-col gap-6">
                                    {/* Material List */}
                                    <div className="bg-white p-4 rounded shadow overflow-x-auto">
                                        <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4 flex items-center gap-2"><FaListAlt size={20} color='green' /> Danh sách nguyên liệu</h4>
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-600 font-medium">
                                                    <th className="p-2 text-left">Nguyên liệu</th>
                                                    <th className="p-2 text-left">Đơn vị</th>
                                                    <th className="p-2 text-left">Số lượng</th>
                                                    <th className="p-2 text-left">Đơn giá</th>
                                                    <th className="p-2 text-left">Thành tiền</th>
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
                                                    ) : ingredients.length > 0 ? (
                                                        ingredients.map((ingredient) => (

                                                            <tr key={ingredient.ingredient_id} className="border-b border-gray-200 last:border-none">
                                                                <td className="flex items-center gap-2 p-2">
                                                                    {/* <img src={ingredient.img} alt={ingredient.name} className="w-10 h-10 object-cover rounded" /> */}
                                                                    <div>
                                                                        <div className="font-medium">{ingredient.ingredient_name}</div>
                                                                        <div className="text-xs text-gray-400">#NL{ingredient.ingredient_id}</div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-2">{ingredient.unit}</td>
                                                                <td className="p-2">{ingredient.quantity}</td>
                                                                <td className="p-2">{formatVND(ingredient.price)}</td>
                                                                <td className="p-2">{formatVND(ingredient.total)}</td>
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
                                    {/* Order Status */}

                                    <Box className="bg-white p-4 mb-5 rounded shadow">
                                        <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                                            <FaTruck size={20} color="green" /> Trạng thái đơn hàng
                                        </h4>
                                        <Stepper activeStep={activeStep} orientation="vertical">
                                            {orderSteps.map((step, index) => (
                                                <Step key={step.key}>
                                                    <StepLabel optional={index === orderSteps.length - 1 ? <Typography variant="caption">Hoàn tất</Typography> : null}>
                                                        <div className="flex items-center gap-2">
                                                            {step.icon}
                                                            <span>{step.label}</span>
                                                        </div>
                                                    </StepLabel>
                                                    <StepContent>
                                                        <Typography className="text-gray-500 text-xs">{step.description}</Typography>
                                                        <Box sx={{ mb: 2 }}>
                                                            <Button
                                                                variant="contained"
                                                                onClick={handleNext}
                                                                sx={{ mt: 1, mr: 1 }}
                                                                disabled={activeStep === orderSteps.length - 1}
                                                            >
                                                                {index === orderSteps.length - 1 ? 'Hoàn tất' : 'Tiếp theo'}
                                                            </Button>
                                                            <Button
                                                                onClick={handleBack}
                                                                sx={{ mt: 1, mr: 1 }}
                                                                disabled={activeStep === 0}
                                                            >
                                                                Quay lại
                                                            </Button>
                                                        </Box>
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="fixed bottom-0 left-56 right-0 bg-white border-t border-gray-200 p-3 flex justify-end gap-3 shadow">
                        <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-red-600"><FaTimes /> Hủy đơn</button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default OrderPuscherDetail;
