import React from 'react';
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
import { useNavigate } from "react-router-dom";

const OrderPuscherDetail = () => {

    const orderSteps = [
        {
            label: 'Đơn hàng đã được tạo',
            description: '24/10/2023 | 08:30 AM | bởi Nguyễn Văn A',
            icon: <FaCheckCircle className="text-green-500" />,
        },
        {
            label: 'Chờ xác nhận từ nhà cung cấp',
            description: 'Đang chờ xử lý...',
            icon: <FaCircleNotch className="text-yellow-500" />,
        },
        {
            label: 'Đang giao hàng',
            description: 'Nhân viên giao nhận đang di chuyển tới địa chỉ',
            icon: <FaTruck className="text-blue-500" />,
        },
        {
            label: 'Hoàn tất đơn hàng',
            description: 'Đơn hàng đã giao thành công',
            icon: <FaCheckCircle className="text-green-500" />,
        },
    ];

    const [activeStep, setActiveStep] = React.useState(1); // ví dụ đang ở bước 1

    const handleNext = () => {
        setActiveStep((prev) => Math.min(prev + 1, orderSteps.length - 1));
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const navigate = useNavigate();
    const handleSupplier = () => {
        navigate("/supplier"); // đường dẫn tới CreateOrder.jsx
    };
    return (
        <div className="section">
            <div className="flex min-h-screen">
                <div className="w-[15%]"><Sidebar /></div>

                <div className="w-[85%] h-screen bg-gray-100 mx-auto overflow-y-auto">
                    {/* Top Header */}
                    <header className="bg-white p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
                        <div className="text-gray-600">
                            <a href="#" className="hover:underline">Quay lại</a>
                            <span className="ml-1">/ Chi Tiết Đơn Hàng</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <button className="px-3 py-1 border border-gray-300 rounded hover:border-blue-600 hover:text-blue-600 flex items-center"><FaPrint className="mr-1" /> In đơn</button>
                            <button className="px-3 py-1 border border-gray-300 rounded hover:border-blue-600 hover:text-blue-600 flex items-center"><FaFilePdf className="mr-1" /> Tải PDF</button>
                            <div className="flex items-center gap-1 text-gray-800 cursor-pointer border border-blue-100 bg-blue-50 rounded px-2 py-1 font-medium">
                                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex justify-center items-center text-xs">NV</div>
                                <span>Chỉnh sửa</span>
                                <FaChevronDown className="text-sm" />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-2 ml-56">
                        <div className="p-6!">
                            {/* Order Summary */}
                            <div className="bg-blue-900 text-white p-6!  rounded-lg mb-6 grid grid-cols-12 gap-6">
                                <div className="col-span-8 flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-bold">#NK-2023-001</span>
                                        <span className="px-2 py-1 bg-green-500 rounded-full text-xs font-medium">Đã duyệt</span>
                                    </div>
                                    <div className="flex gap-8">
                                        <div className="flex items-start gap-2">
                                            <FaUser className="mt-1" />
                                            <div>
                                                <div className="text-xs opacity-70">Người lập đơn</div>
                                                <div className="font-medium">Nguyễn Văn A</div>
                                                <div className="text-xs opacity-70">Quản lý</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <FaCalendarAlt className="mt-1" />
                                            <div>
                                                <div className="text-xs opacity-70">Ngày tạo đơn</div>
                                                <div className="font-medium">08/10/2023</div>
                                                <div className="text-xs opacity-70">08:30 AM</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <FaCalendarCheck className="mt-1" />
                                            <div>
                                                <div className="text-xs opacity-70">Ngày giao dự kiến</div>
                                                <div className="font-medium">10/10/2023</div>
                                                <div className="text-xs opacity-70">Trước 10:00 AM</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-4 flex flex-col items-end justify-center">
                                    <div className="text-sm opacity-70">Giá trị đơn hàng</div>
                                    <div className="text-3xl font-bold text-yellow-300">5.250.000 ₫</div>
                                </div>
                            </div>

                            {/* Order Content Grid */}
                            <div className="grid grid-cols-12 gap-6 mt-4">
                                <div className="col-span-4 flex flex-col gap-6">
                                    {/* Supplier Info */}
                                    <div className="bg-white p-4 rounded shadow">
                                        <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4 flex items-center gap-2"><FaBuilding size={20} color='green' /> Thông tin nhà cung cấp</h4>
                                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
                                            <div className="w-10 h-10 bg-red-600 text-white flex justify-center items-center font-medium rounded mr-2">NS</div>
                                            <div>
                                                <div className="font-semibold text-sm">Nông sản Sạch Việt</div>
                                                <div className="text-xs text-gray-400">Mã NCC: NCC-001</div>
                                            </div>
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
                                            <div className="font-medium text-sm mb-1">Nhà hàng KitchenFlow</div>
                                            <div className="text-gray-600 mb-3">Đường Lê Lợi, Quận 1, TP.HCM</div>
                                            <div className="text-gray-600 mb-1">Người nhận: Nguyễn Văn A</div>
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
                                                {[
                                                    { name: 'Cà chua bi', code: 'NL-004', unit: 'Kg', qty: 25, price: '23.000 ₫', total: '1.250.000 ₫', img: 'path/to/image1.jpg' },
                                                    { name: 'Cải xanh', code: 'NL-002', unit: 'Kg', qty: 30, price: '20.000 ₫', total: '1.050.000 ₫', img: 'path/to/image2.jpg' },
                                                    { name: 'Cà rốt Đà Lạt', code: 'NL-003', unit: 'Kg', qty: 40, price: '21.000 ₫', total: '900.000 ₫', img: 'path/to/image3.jpg' },
                                                    { name: 'Bí đỏ baby', code: 'NL-007', unit: 'Kg', qty: 20, price: '24.000 ₫', total: '950.000 ₫', img: 'path/to/image4.jpg' },
                                                    { name: 'Nước giải khát', code: 'NL-008', unit: 'Lít', qty: 25, price: '28.000 ₫', total: '1.100.000 ₫', img: 'path/to/image5.jpg' },
                                                ].map((item, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 last:border-none">
                                                        <td className="flex items-center gap-2 p-2">
                                                            <img src={item.img} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                                            <div>
                                                                <div className="font-medium">{item.name}</div>
                                                                <div className="text-xs text-gray-400">{item.code}</div>
                                                            </div>
                                                        </td>
                                                        <td className="p-2">{item.unit}</td>
                                                        <td className="p-2">{item.qty}</td>
                                                        <td className="p-2">{item.price}</td>
                                                        <td className="p-2">{item.total}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="bg-white p-4 rounded shadow">
                                        <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4 flex items-center gap-2"><FaMoneyBillWave size={20} color='green' /> Thanh toán</h4>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Tạm tính</span><span>4.250.000 ₫</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Chiết khấu (0%)</span><span className="text-red-500">0 ₫</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Phí vận chuyển</span><span className="text-green-500 font-medium">Miễn phí</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">VAT (10%)</span><span>527.000 ₫</span></div>
                                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 font-bold text-red-600 text-lg"><span>Tổng cộng</span><span>5.797.000 ₫</span></div>
                                        </div>
                                        <div className="border-t border-dashed border-gray-200 mt-3 pt-2 text-sm flex flex-col gap-1">
                                            <div className="flex justify-between"><span className="text-gray-500">Phương thức thanh toán</span><span>Chuyển khoản</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Trạng thái thanh toán</span><span className="text-yellow-400 font-medium"><FaCircleNotch className="inline mr-1 text-xs" /> Chờ xác nhận</span></div>
                                        </div>
                                    </div>

                                    {/* Order History */}

                                    <Box className="bg-white p-4 mb-5 rounded shadow">
                                        <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                                            <FaTruck size={20} color="green" /> Trạng thái đơn hàng
                                        </h4>
                                        <Stepper activeStep={activeStep} orientation="vertical">
                                            {orderSteps.map((step, index) => (
                                                <Step key={step.label}>
                                                    <StepLabel
                                                        optional={
                                                            index === orderSteps.length - 1 ? (
                                                                <Typography variant="caption">Hoàn tất</Typography>
                                                            ) : null
                                                        }
                                                    >
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
                                                            >
                                                                {index === orderSteps.length - 1 ? 'Hoàn tất' : 'Tiếp theo'}
                                                            </Button>
                                                            <Button
                                                                disabled={index === 0}
                                                                onClick={handleBack}
                                                                sx={{ mt: 1, mr: 1 }}
                                                            >
                                                                Quay lại
                                                            </Button>
                                                        </Box>
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>
                                        {activeStep === orderSteps.length && (
                                            <Paper square elevation={0} sx={{ p: 3 }}>
                                                <Typography>Tất cả các bước đã hoàn tất</Typography>
                                                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                                    Reset
                                                </Button>
                                            </Paper>
                                        )}
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="fixed bottom-0 left-56 right-0 bg-white border-t border-gray-200 p-3 flex justify-end gap-3 shadow">
                        <button onClick={handleSupplier} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-700"><FaShareSquare /> Gửi cho nhà cung cấp</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-red-600"><FaTimes /> Hủy đơn</button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default OrderPuscherDetail;
