import React, { useEffect, useState } from "react";
import Sidebar from '../Sidebar';
import { IoIosWarning } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

import axios from "axios";

const statusBadge = {
    good: "bg-green-500",
    warning: "bg-blue-300",
    low: "bg-orange-400",
    out: "bg-red-500",
};

const MOCK_INGREDIENTS = [
    {
        id: 1,
        name: "Ức gà phi lê",
        code: "ING-010",
        category: "Thịt",
        unit: "Kg",
        price: 85000,
        stock: 2,
        minStock: 10,
        orderQty: 20,
        badge: "low",
        img: "https://images.unsplash.com/photo-1604908177760-0e6b0b2b8c31?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=bdc6d2b3b3b6a4d2c4e6f1f1e1a3d0f3",
        note: "Ngày cập nhật: 2 ngày trước · Tồn tối thiểu: 10 Kg",
    },
    {
        id: 2,
        name: "Cá hồi Na Uy",
        code: "ING-022",
        category: "Hải sản",
        unit: "Kg",
        price: 320000,
        stock: 1.5,
        minStock: 5,
        orderQty: 15,
        badge: "low",
        img: "https://images.unsplash.com/photo-1546491764-2b5d6d6f2b6b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef1234567890",
        note: "HSD: 7 ngày · Tồn tối thiểu: 5 Kg",
    },
    {
        id: 3,
        name: "Xả (lá xả tươi)",
        code: "ING-033",
        category: "Rau thơm",
        unit: "Kg",
        price: 25000,
        stock: 3.5,
        minStock: 5,
        orderQty: 20,
        badge: "warn",
        img: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=123456abcdef7890",
        note: "Thời gian lưu kho: 3 ngày · Tồn tối thiểu: 5 Kg",
    },
    {
        id: 4,
        name: "Hành tây",
        code: "ING-041",
        category: "Rau củ",
        unit: "Kg",
        price: 18000,
        stock: 4,
        minStock: 3,
        orderQty: 25,
        badge: "warn",
        img: "https://images.unsplash.com/photo-1584205078759-3c8b24b1f8f7?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdabcdabcdabcd",
        note: "Tồn tối thiểu: 3 Kg",
    },
    {
        id: 5,
        name: "Tỏi tươi",
        code: "ING-055",
        category: "Gia vị",
        unit: "Kg",
        price: 45000,
        stock: 5.5,
        minStock: 4,
        orderQty: 15,
        badge: "warn",
        img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdefabcdefabcd",
        note: "Tồn tối thiểu: 4 Kg",
    },
];

const CreateOrder = () => {
    //Fomat money
    const formatVND = (value) => {
        return Number(value).toLocaleString('vi-VN') + ' đ';
    };

    const navigate = useNavigate();
    const handleCreateOrderPuscher = () => {
        navigate("/puscher-order"); // đường dẫn tới CreateOrder.jsx
    };

    const [showAll, setShowAll] = useState(false);
    const [ingredientAlert, setIngredientAlert] = useState([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);

    const [ingredients, setIngredients] = useState(
        MOCK_INGREDIENTS.map(item => ({ ...item, checked: false }))
    );

    //Fetch api wanning ingredient
    useEffect(() => {
        const fetchAlert = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8000/api/alert");
                setIngredientAlert(res.data.data);
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
        const updated = ingredients.map(i =>
            i.id === id ? { ...i, checked: !i.checked } : i
        );
        setIngredients(updated);
    };

    //

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
                                                                        value={ingredient.orderQty}
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
                                            <select className="p-2 border rounded-lg">
                                                <option>Chọn nhà cung cấp</option>
                                                <option>Công ty ABC</option>
                                                <option>Nhà cung cấp XYZ</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-sm text-gray-900">Ngày giao dự kiến</label>
                                            <input type="date" className="p-2 border rounded-lg" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-sm text-gray-900">Phương thức thanh toán</label>
                                            <select className="p-2 border rounded-lg">
                                                <option>Chuyển khoản</option>
                                                <option>Tiền mặt</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-sm text-gray-900">Kho nhận hàng</label>
                                            <select className="p-2 border rounded-lg">
                                                <option>Kho trung tâm - Quận 1</option>
                                                <option>Kho chi nhánh - Quận 3</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="font-semibold text-sm text-gray-900">Ghi chú đơn hàng</label>
                                            <textarea placeholder="Nhập ghi chú cho đơn hàng (nếu có)..." className="p-2 border rounded-lg min-h-20" />
                                        </div>
                                    </div>
                                    <div className="text-gray-400 text-sm mt-2">Bạn có thể lưu đơn dưới dạng nháp hoặc tạo đơn ngay.</div>
                                </div>

                            </div>

                            {/* Right column: summary */}
                            <aside className="w-full md:w-80 shrink-0">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col gap-2">
                                    <h3 className="text-sm font-bold">Tóm tắt đơn hàng</h3>
                                    <div className="flex justify-between text-gray-400 font-semibold"><span>Số nguyên liệu đã chọn</span><span>5</span></div>
                                    <div className="flex justify-between text-gray-400 font-semibold"><span>Tổng số lượng</span><span>100</span></div>
                                    <div className="flex justify-between text-gray-400 font-semibold"><span>Tạm tính</span><span>0 đ</span></div>
                                    <div className="flex justify-between text-gray-400 font-semibold"><span>Phí vận chuyển</span><span>50.000 đ</span></div>
                                    <hr className="border-t border-gray-200 my-1" />
                                    <div className="flex justify-between text-green-600 font-extrabold text-lg"><span>Tổng cộng</span><span>50.000 đ</span></div>

                                    <div className="flex flex-col gap-2 mt-2">
                                        <button onClick={handleCreateOrderPuscher} className="bg-green-500 text-white font-bold py-2 rounded-lg!">Tạo đơn nhập kho</button>
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
