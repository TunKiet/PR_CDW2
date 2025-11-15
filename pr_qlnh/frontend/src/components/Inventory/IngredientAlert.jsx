import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { RiFileList2Line } from "react-icons/ri";
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
// import axios from "axios";

const IngredientAlert = ({ loading, ingredientAlert }) => {
    const [checked, setChecked] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (ingredientAlert && ingredientAlert.length > 0) {
            setChecked(new Array(ingredientAlert.length).fill(false));
            setQuantities(new Array(ingredientAlert.length).fill(""));
        } else {
            setChecked([]);
            setQuantities([]);
        }
    }, [ingredientAlert])

    const handleParentCheck = (event) => {
        const checkAll = event.target.checked;
        setChecked(checked.map(() => checkAll));
    };

    // ✅ Check từng dòng
    const handleChildChange = (index) => (event) => {
        const updated = [...checked];
        updated[index] = event.target.checked;
        setChecked(updated);
    };

    // ✅ Nhập số lượng
    const handleQuantityChange = (index) => (event) => {
        const updated = [...quantities];
        updated[index] = event.target.value;
        setQuantities(updated);
    };

    const allChecked = checked.length > 0 && checked.every(Boolean);
    const someChecked = checked.some(Boolean);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <>
            <div className="boxIngredient-alert">
                <div className="boxIngredient-alert-head flex my-2">
                    <div className="alert-title ms-2 text-red-500 font-bold">
                        <h5>Nguyên liệu sắp hết hàng</h5>
                    </div>
                    <div className="boxIngredient-button ms-auto">
                        <Button variant="contained" color="primary" onClick={handleOpen}>
                            <RiFileList2Line size={20} /> Tạo đơn nhập hàng
                        </Button>

                        <Dialog open={open} onClose={handleClose}>
                            Đơn hàng nhập nguyên liệu
                        </Dialog>
                    </div>
                </div>

                <div className="boxIngredient-table">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th>
                                    <Checkbox
                                        checked={allChecked}
                                        indeterminate={someChecked && !allChecked}
                                        onChange={handleParentCheck}
                                    />
                                </th>
                                <th className="px-4 py-2 text-center border-b">STT</th>
                                <th className="px-4 py-2 text-center border-b">Tên NL</th>
                                <th className="px-4 py-2 text-center border-b">Danh mục</th>
                                <th className="px-4 py-2 text-center border-b">Tồn kho</th>
                                <th className="px-4 py-2 text-center border-b">Ngưỡng</th>
                                <th className="px-4 py-2 text-center border-b">Tiêu thụ</th>
                                <th className="text-center border-b">Số lượng nhập</th>
                                <th className="px-4 py-2 text-center border-b">Đơn vị</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-4 text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : ingredientAlert.length > 0 ? (
                                ingredientAlert.map((item, index) => (
                                    <tr key={item.ingredient_id} className="border border-b-2">
                                        <td>
                                            <Checkbox
                                                checked={!!checked[index]}
                                                onChange={handleChildChange(index)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center border-b">{index + 1}</td>
                                        <td className="px-4 py-2 text-center border-b">{item.ingredient_name}</td>
                                        <td className="px-4 py-2 text-center border-b">{item.category_ingredient.category_ingredient_name || '—'}</td>
                                        <td className="px-4 py-2 text-center border-b">{item.stock_quantity}</td>
                                        <td className="px-4 py-2 text-center border-b">{item.min_stock_level}</td>

                                        <td className="px-4 py-2 border-b">
                                            <div className="relative w-full max-w-[200px] mx-auto h-5">
                                                <progress
                                                    max={item.min_stock_level}
                                                    value={item.stock_quantity}
                                                    className="alert-progress w-full h-full appearance-none [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-orange-500 rounded"
                                                ></progress>
                                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                                                    {Math.min(
                                                        Math.round((item.stock_quantity / item.min_stock_level) * 100),
                                                        100
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </td>

                                        <td className="w-40 text-center border-b">
                                            {checked[index] ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="border border-gray-400 rounded text-center p-1"
                                                    value={quantities[index]}
                                                    onChange={handleQuantityChange(index)}
                                                    placeholder="Nhập SL"
                                                />
                                            ) : (
                                                <span className="text-gray-400 italic">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-center border-b">{item.unit || '—'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center py-4 text-gray-500">
                                        Không có nguyên liệu sắp hết
                                    </td>
                                </tr>
                            )}
                        </tbody>


                    </table>
                </div>

                <div className="pagination-ingredient-input flex justify-center pt-3">
                    <Pagination count={10} variant="outlined" color="primary" />
                </div>
            </div>
        </>
    );
};

export default IngredientAlert;
