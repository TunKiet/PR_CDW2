import React, { useEffect, useState } from "react";
import Sidebar from '../Sidebar';
import { IoIosWarning } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { confirmDialog, confirmSuccess } from '../../utils/notify'

import axios from "axios";

const endPoint = 'http://localhost:8000/api';

const statusBadge = {
    good: "bg-green-500",
    warning: "bg-blue-300",
    low: "bg-orange-400",
    out: "bg-red-500",
};

const CreateOrder = () => {
    //Fomat money
    const formatVND = (value) => {
        return Number(value).toLocaleString('vi-VN') + ' đ';
    };

    // const navigate = useNavigate();
    // const handleCreateOrderPuscher = () => {
    //     navigate("/puscher-order"); // đường dẫn tới CreateOrder.jsx
    // };

    const [showAll, setShowAll] = useState(false);
    const [ingredientAlert, setIngredientAlert] = useState([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);
    const [supplierName, setSupplierName] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");


    //validate checked ingredient
    const validateIngredients = () => {
        let hasChecked = false;
        let hasQty = false;

        for (const item of ingredientAlert) {
            const checked = item.checked;
            const qty = Number(item.order_quantity);

            if (checked) hasChecked = true;
            if (qty > 0) hasQty = true;

            // CASE 1: Check nhưng không nhập
            if (checked && (!qty || qty <= 0)) {
                return { valid: false, message: "Bạn đã chọn nguyên liệu nhưng chưa nhập số lượng" };
            }

            // CASE 2: Nhập nhưng không check
            if (!checked && qty > 0) {
                return { valid: false, message: "Bạn đã nhập số lượng nhưng chưa chọn nguyên liệu" };
            }
        }

        if (!hasChecked && hasQty) {
            return { valid: false, message: "Bạn đã nhập số lượng nhưng không chọn nguyên liệu nào" };
        }

        if (hasChecked && !hasQty) {
            return { valid: false, message: "Bạn đã chọn nguyên liệu nhưng chưa nhập số lượng" };
        }

        if (!hasChecked && !hasQty) {
            return { valid: false, message: "Bạn chưa chọn nguyên liệu nào" };
        }

        return { valid: true };
    };

    //Fetch api wanning ingredient
    useEffect(() => {
        const fetchAlert = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${endPoint}/alert`);

                const dataAlert = res.data.data.map(alert => ({
                    ...alert,
                    checked: false,
                    order_quantity: ""
                }));
                setIngredientAlert(dataAlert);
                setCount(res.data.count);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchAlert();
    }, []);

    const displayedIngredients = showAll ? ingredientAlert : ingredientAlert.slice(0, 5);

    //Count checked ingredient
    const selectedCount = ingredientAlert.filter(i => i.checked).length;

    //Total quantity input
    const totalQuantity = ingredientAlert
        .filter(i => i.checked)
        .reduce((sum, item) => sum + Number(item.order_quantity || 0), 0);

    //Total money
    const subTotal = ingredientAlert
        .filter(i => i.checked)
        .reduce((sum, item) => sum + (item.price * item.order_quantity), 0);

    const grandTotal = subTotal;

    // Chọn tất cả
    const handleSelectAll = () => {
        const updated = ingredientAlert.map(i => ({ ...i, checked: true }));
        setIngredientAlert(updated);
    };

    // Bỏ chọn tất cả
    const handleUnselectAll = () => {
        const updated = ingredientAlert.map(i => ({ ...i, checked: false }));
        setIngredientAlert(updated);
    };

    // Chọn từng nguyên liệu
    const handleToggleItem = (id) => {
        const updated = ingredientAlert.map(i =>
            i.ingredient_id === id
                ? { ...i, checked: !i.checked }
                : i
        );
        setIngredientAlert(updated);
    };

    const handleChangeQuantity = (id, qty) => {
        const updated = ingredientAlert.map(i =>
            i.ingredient_id === id
                ? { ...i, order_quantity: qty }
                : i
        );
        setIngredientAlert(updated);
    };
    const handleSubmit = async () => {
        const validate = validateIngredients();

        if (!validate.valid) {
            await confirmDialog('Không thể tạo đơn hàng', 'Vui lòng kiểm tra lại các thông tin');
            return;
        }

        // Chỉ lấy nguyên liệu đã chọn
        const selectedItems = ingredientAlert
            .filter(i => i.checked)
            .map(i => ({
                ingredient_id: i.ingredient_id,
                quantity: i.order_quantity,   // đổi qty -> quantity
                price: i.price,
                total: i.price * i.order_quantity
            }));

        // Tính tổng tiền
        const total_cost = selectedItems.reduce((sum, item) => sum + item.total, 0);

        try {
            const payload = {
                supplier_name: supplierName,
                order_date: deliveryDate,
                total_cost: total_cost,
                items: selectedItems,
            };

            const res = await axios.post(`${endPoint}/purchase-order`, payload);

            console.log("Order created:", res.data);

            await confirmSuccess(
                "Đơn hàng đã được đặt thành công",
                "Vui lòng theo dõi trạng thái đơn hàng"
            );
        } catch (error) {
            console.log("API Error:", error?.response?.data || error.message);
        }



        console.log("Dữ liệu gửi API:", selectedItems);
    };

    return (
        <div className="section">
            <div className="flex min-h-screen">
                <div className="w-[15%]"><Sidebar /></div>
                <div className="w-[85%] h-screen p-4 bg-gray-100 mx-auto overflow-y-auto">
                    <main className="flex-1 flex flex-col gap-4">
                        {/* Header */}
                        <header className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">Tạo đơn nhập kho</h3>
                                <p className="text-gray-500 text-sm m-0">Chọn nguyên liệu sắp hết để tạo đơn nhập thêm</p>
                            </div>

                        </header>

                        {/* Banner */}
                        <div className="flex items-center gap-2 bg-red-100 border border-red-200 text-red-700 p-2 rounded-xl shadow-sm">
                            <div className="flex justify-center items-center p-2 bg-red-200 rounded-lg">
                                <IoIosWarning size={20} />
                            </div>
                            <div>
                                <strong>Cảnh báo tồn kho thấp</strong>
                                <div className="text-gray-500 mt-1">Hiện có {count} nguyên liệu sắp hết hàng. Vui lòng chọn và tạo đơn nhập kho để đảm bảo hoạt động kinh doanh.</div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Left column */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <strong>Nguyên liệu sắp hết hàng</strong>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={handleSelectAll} className="px-3 py-2 bg-green-400 border rounded-lg! font-bold text-sm">Chọn tất cả</button>
                                            <button onClick={handleUnselectAll} className="px-3 py-2 bg-yellow-200 border rounded-lg! font-bold text-sm">Bỏ chọn</button>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className='text-center'>
                                            <div>
                                                <CircularProgress />
                                            </div>
                                        </div>
                                    ) : ingredientAlert.length > 0 ? (

                                        displayedIngredients.map((ingredient) => {
                                            const badge = ingredient.status;

                                            return (
                                                <div
                                                    key={ingredient.ingredient_id}
                                                    className="flex gap-3 items-start p-3 border rounded-lg border-gray-100 bg-white mb-2"
                                                >
                                                    {/* Checkbox */}
                                                    <div className="mt-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={ingredient.checked}
                                                            onChange={() => handleToggleItem(ingredient.ingredient_id)}
                                                        />
                                                    </div>

                                                    {/* Image */}
                                                    <div className="w-18 h-18 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                                                        <img src="https://images.unsplash.com/photo-1584205078759-3c8b24b1f8f7?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdabcdabcdabcd" alt={ingredient.ingredient_name} className="w-full h-full object-cover" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div>
                                                                <div className="font-bold text-sm text-gray-900">{ingredient.ingredient_name}</div>
                                                                <div className="text-gray-400 text-xs mt-1">
                                                                    Mã: NL{ingredient.ingredient_id} • Danh mục: {ingredient.category_ingredient.category_ingredient_name} • Đơn vị: {ingredient.unit}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <div className="text-right min-w-[120px]">
                                                                    <div className="font-bold text-gray-900">
                                                                        {formatVND(ingredient.price)}/{ingredient.unit}
                                                                    </div>
                                                                    <div className="text-gray-400 text-xs">
                                                                        Tồn {ingredient.stock_quantity} {ingredient.unit}
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col items-end gap-1 w-30">
                                                                    <div className="text-gray-400 text-xs">Số lượng nhập</div>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={ingredient.order_quantity}
                                                                        onChange={(e) => handleChangeQuantity(ingredient.ingredient_id, e.target.value)}
                                                                        className="w-20 p-2 border rounded-lg text-right font-bold border-gray-200"
                                                                    />
                                                                </div>

                                                                <div className="ml-1">
                                                                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${statusBadge[badge]}`}>
                                                                        {badge === "good" ? "Tốt" : badge === "warning" ? "Có thể nhập" : badge === "low" ? "Gần hết" : "Hết"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="text-gray-400 text-xs">Tồn tối thiểu: {ingredient.min_stock_level} {ingredient.unit}</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className='text-center'>
                                            <div>Không có dữ liệu</div>
                                        </div>
                                    )}

                                    <div className="text-center mt-2">
                                        {
                                            !showAll && ingredientAlert.length > 5 && (
                                                <button onClick={() => setShowAll(!showAll)} className="w-auto px-4 py-2 bg-white border rounded-lg! font-bold text-sm">{showAll ? "Thu gọn" : "Xem thêm"}</button>
                                            )
                                        }
                                    </div>
                                </div>

                                {/* Order form */}
                                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col gap-4">
                                    <strong>Thông tin đơn hàng</strong>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-sm text-gray-900">Nhà cung cấp</label>
                                            <select
                                                className="p-2 border rounded-lg"
                                                value={supplierName}
                                                onChange={(e) => setSupplierName(e.target.value)}
                                            >
                                                <option value="">Chọn nhà cung cấp</option>
                                                <option value="Công ty ABC">Công ty ABC</option>
                                                <option value="Nhà cung cấp XYZ">Nhà cung cấp XYZ</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-sm text-gray-900">Ngày giao dự kiến</label>
                                            <input
                                                type="date"
                                                className="p-2 border rounded-lg"
                                                value={deliveryDate}
                                                onChange={(e) => setDeliveryDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-gray-400 text-sm mt-2">Bạn có thể lưu đơn dưới dạng nháp hoặc tạo đơn ngay.</div>
                                </div>
                            </div>

                            {/* Right column: summary */}
                            <aside className="w-full md:w-80 shrink-0">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col gap-2">
                                    <h3 className="text-sm font-bold">Tóm tắt đơn hàng</h3>
                                    <div className="flex justify-between text-gray-400 font-semibold"><span>Số nguyên liệu đã chọn</span><span>{selectedCount}</span></div>
                                    <div className="flex justify-between text-gray-400 font-semibold"><span>Tổng số lượng</span><span>{totalQuantity}</span></div>
                                    <div className="flex justify-between text-gray-400 font-semibold"><span>Tạm tính</span><span>{formatVND(subTotal)}</span></div>
                                    <div className="flex justify-between text-gray-400 font-semibold"><span>Phí vận chuyển</span><span>0 đ</span></div>
                                    <hr className="border-t border-gray-200 my-1" />
                                    <div className="flex justify-between text-green-600 font-extrabold text-lg"><span>Tổng cộng</span><span>{formatVND(grandTotal)}</span></div>

                                    <div className="flex flex-col gap-2 mt-2">
                                        <button onSubmit={handleSubmit()} className="bg-green-500 text-white font-bold py-2 rounded-lg!">Tạo đơn nhập kho</button>
                                        <button className="bg-white text-red-500 border border-red-200 py-2 rounded-lg! cursor-pointer">Hủy bỏ</button>
                                    </div>
                                    <div className="text-gray-400 text-xs mt-2">
                                        Lưu ý: Đơn này sẽ được gửi nhà cung cấp sau khi bạn hoàn tất thông tin và chọn <strong>Tạo đơn nhập kho</strong>.
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default CreateOrder;
