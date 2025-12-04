import React from "react";
import { FaChartLine, FaFileAlt, FaBoxOpen, FaUsers, FaTruck, FaReceipt, FaChartBar, FaWarehouse, FaSignOutAlt, FaPrint, FaExclamationTriangle, FaCheck, FaUserAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUserTie, FaEdit, FaEye, FaFilePdf, FaBolt, FaPhoneVolume, FaCommentAlt, FaFileDownload, FaListAlt, FaFileInvoiceDollar, FaCalendarCheck, FaTimesCircle, FaCheckCircle, FaDownload } from "react-icons/fa";
import Sidebar from "../Sidebar";
import {
    FaBoxes, FaBuilding, FaCoins,
    FaDollarSign, FaChevronDown, FaUser,
    FaCalendarAlt, FaMoneyBillWave, FaHistory, FaCircleNotch, FaTimes, FaShareSquare
} from 'react-icons/fa';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
const SupplierOrderDetail = () => {
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
    return (
        <div className="section">
            <div className="flex min-h-screen">
                <div className="w-[15%]"><Sidebar /></div>
                <div className="w-[85%] h-screen bg-gray-100 mx-auto overflow-y-auto">
                    <header className="sticky top-0 z-50 flex justify-between items-center bg-white border-b border-gray-200 px-8 py-4">
                        <button className="flex items-center gap-2 border px-3 py-1 ms-auto rounded hover:bg-gray-100"><FaPrint /> In đơn</button>
                    </header>
                    <main className="flex-1 ml-56 p-4">
                        <div className="p-8 space-y-6!">
                            {/* <div className="flex items-center bg-yellow-50 border border-yellow-300 text-yellow-600 px-4 py-3 rounded">
                                <FaExclamationTriangle className="mr-2" /> Vui lòng xác nhận đơn hàng này trong vòng 24 giờ. Thời gian giao hàng dự kiến: <strong>26/10/2023</strong>
                            </div> */}

                            <div className="bg-white border border-gray-200 rounded p-3 grid grid-cols-12 gap-6">
                                <div className="col-span-8 space-y-4">
                                    <div className="flex justify-between border-b border-gray-200 pb-4">
                                        <div>
                                            <div className="text-2xl font-bold text-red-500">#NK-2023-001</div>
                                            <div className="text-sm text-gray-500">Đơn hàng từ <strong>KitchenFlow Restaurant</strong></div>
                                        </div>

                                    </div>

                                    <div className="flex gap-8 text-sm text-gray-500">
                                        <div>
                                            <div>Ngày tạo đơn</div>
                                            <div className="font-medium text-gray-700">24/10/2023</div>
                                            <div>14:00 PM</div>
                                        </div>
                                        <div>
                                            <div>Giao hàng dự kiến</div>
                                            <div className="font-medium text-gray-700">26/10/2023</div>
                                            <div>Trước 10:00 AM</div>
                                        </div>
                                        <div>
                                            <div>Thanh toán</div>
                                            <div className="font-medium text-gray-700">Chuyển khoản</div>
                                            <div className="text-yellow-500 font-medium">Chờ thanh toán</div>
                                        </div>
                                        {/* <div>
                                            <div>Thời gian còn lại</div>
                                            <div className="text-red-500 font-semibold text-lg">20 giờ 50 phút</div>
                                            <div>để xác nhận</div>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-span-4 text-right flex flex-col justify-center">
                                    <div className="text-sm text-gray-500">Tổng giá trị đơn hàng</div>
                                    <div className="text-3xl font-bold text-red-500">5.250.000 ₫</div>
                                </div>
                            </div>

                            {/* Order Content Grid */}
                            <div className="grid grid-cols-12 gap-6 mb-4">
                                <div className="col-span-5 space-y-6!">
                                    {/* Customer Info */}
                                    <div className="bg-white p-4 rounded shadow space-y-3!">
                                        <div className="flex items-center gap-2 font-semibold text-lg"><FaUserAlt /> Thông tin khách hàng</div>
                                        <div className="flex items-center gap-2 border-b border-dashed pb-2">
                                            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded">KF</div>
                                            <div>
                                                <div className="font-medium">KitchenFlow Restaurant</div>
                                                <div className="text-xs text-gray-400">Mã KH: KH-2023-045</div>
                                            </div>
                                        </div>
                                        <div className="text-sm space-y-1!">
                                            <div className="flex items-start gap-2"><FaPhoneAlt /> 0912 345 678</div>
                                            <div className="flex items-start gap-2"><FaEnvelope /> contact@kitchenflow.vn</div>
                                            <div className="flex items-start gap-2"><FaMapMarkerAlt /> 456 Đường Lê Lợi, Quận 1, TP.HCM</div>
                                            <div className="flex items-start gap-2"><FaUserTie /> Nguyễn Văn A - Quản lý kho</div>
                                        </div>
                                    </div>

                                    {/* Delivery Note */}
                                    <div className="bg-white p-4 rounded shadow space-y-3!">
                                        <div className="flex items-center gap-2 font-semibold text-lg"><FaEdit /> Ghi chú giao hàng</div>
                                        <p className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-500">Giao hàng vào buổi sáng, lên hệ trước 30 phút. Đảm bảo bảo quản nguyên liệu tươi và đóng gói cẩn thận.</p>
                                        <div className="flex gap-2 border-t border-dashed pt-2">
                                            <a href="#" className="flex items-center gap-1 text-blue-600"><FaEye /> Yêu cầu đính kèm</a>
                                            <a href="#" className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs"><FaFilePdf /> Hóa đơn</a>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-span-7 space-y-6!">
                                    {/* Product List */}
                                    <div className="bg-white p-4 rounded shadow overflow-x-auto">
                                        <div className="flex items-center gap-2 font-semibold text-lg mb-2"><FaListAlt /> Danh sách sản phẩm</div>
                                        <table className="min-w-full text-sm border-collapse">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="p-2 text-left">Sản phẩm</th>
                                                    <th className="p-2 text-left">Danh mục</th>
                                                    <th className="p-2 text-left">Đơn vị</th>
                                                    <th className="p-2 text-left">Số lượng</th>
                                                    <th className="p-2 text-left">Đơn giá</th>
                                                    <th className="p-2 text-left">Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {[
                                                    { name: "Cà chua bi", sku: "NL-001", qty: 50, unit: "Kg", price: 25000, total: 1250000, stock: "green", img: "path/to/image1.jpg" },
                                                    { name: "Xà lách xoăn", sku: "NL-002", qty: 30, unit: "Kg", price: 35000, total: 1050000, stock: "green", img: "path/to/image2.jpg" },
                                                    { name: "Củ su hào", sku: "NL-005", qty: 20, unit: "Kg", price: 45000, total: 900000, stock: "red", img: "path/to/image3.jpg" },
                                                    { name: "Dưa chuột baby", sku: "NL-003", qty: 40, unit: "Kg", price: 28000, total: 1120000, stock: "green", img: "path/to/image4.jpg" },
                                                    { name: "Bông cải xanh", sku: "NL-006", qty: 25, unit: "Kg", price: 38000, total: 950000, stock: "green", img: "path/to/image5.jpg" },
                                                ].map((p, i) => (
                                                    <tr key={i}>
                                                        <td className="flex items-center gap-2 p-2">
                                                            <img src={p.img} alt={p.name} className="w-10 h-10 object-cover rounded" />
                                                            <div>
                                                                <div className="font-medium">{p.name}</div>
                                                                <div className="text-xs text-gray-400">SKU: {p.sku}</div>
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            Thịt
                                                        </td>
                                                        <td className="p-2">{p.unit}</td>
                                                        <td className="p-2">{p.qty}</td>
                                                        <td className="p-2">{p.price.toLocaleString()} ₫</td>
                                                        <td className="p-2">{p.total.toLocaleString()} ₫</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="bg-white p-4 rounded shadow space-y-2">
                                        <div className="flex justify-between"><span>Tạm tính (5 sản phẩm)</span><span>5.270.000 ₫</span></div>
                                        <div className="flex justify-between"><span>Giảm giá</span><span>0 ₫</span></div>
                                        <div className="flex justify-between text-green-600"><span>Phí vận chuyển</span><span>Miễn phí</span></div>
                                        <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-red-500 text-lg"><span>Tổng cộng</span><span>5.270.000 ₫</span></div>
                                    </div>

                                    {/* Order Confirmation */}
                                    <Box className="bg-white p-4 mb-5 rounded shadow">
                                        <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                                            <FaCalendarCheck size={20} color="green" /> Xác nhận đơn hàng
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

                    <footer className="fixed bottom-0 left-56 right-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-4 shadow">
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"><FaCheckCircle /> Xác nhận đơn hàng</button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default SupplierOrderDetail;
