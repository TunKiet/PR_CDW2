import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { RiFileList2Line } from "react-icons/ri";
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';

const IngredientAlert = () => {
    const [checked, setChecked] = useState([false, false, false]);
    const [quantities, setQuantities] = useState(["", "", ""]);
    const [open, setOpen] = useState(false);

    // ✅ Check tất cả
    const setParentCheck = (event) => {
        const checkAll = event.target.checked;
        setChecked(new Array(checked.length).fill(checkAll));
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

    const allChecked = checked.every(Boolean);
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
                                        onChange={setParentCheck}
                                    />
                                </th>
                                <th className="px-4 py-2 text-center border-b">Mã NL</th>
                                <th className="px-4 py-2 text-center border-b">Tên NL</th>
                                <th className="px-4 py-2 text-center border-b">Danh mục</th>
                                <th className="px-4 py-2 text-center border-b">Tồn kho</th>
                                <th className="px-4 py-2 text-center border-b">Ngưỡng</th>
                                <th className="px-4 py-2 text-center border-b">Tiêu thụ</th>
                                <th className="px-4 py-2 text-center border-b">Số lượng nhập</th>
                                <th className="px-4 py-2 text-center border-b">Đơn vị</th>
                            </tr>
                        </thead>

                        <tbody>
                            {[0, 1, 2].map((i) => (
                                <tr key={i} className="border border-b-2">
                                    <td>
                                        <Checkbox checked={checked[i]} onChange={handleChildChange(i)} />
                                    </td>
                                    <td className="px-4 py-2 text-center border-b">{i + 1}</td>
                                    <td className="px-4 py-2 text-center border-b">Gà</td>
                                    <td className="px-4 py-2 text-center border-b">Thịt</td>
                                    <td className="px-4 py-2 text-center border-b">10</td>
                                    <td className="px-4 py-2 text-center border-b">15</td>

                                    <td className="px-4 py-2 border-b">
                                        <div className="relative w-full max-w-[200px] mx-auto h-5">
                                            <progress
                                                max={100}
                                                value={90}
                                                className="alert-progress w-full h-full appearance-none [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-orange-500 rounded"
                                            ></progress>
                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                                                90%
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-2 text-center border-b">
                                        {checked[i] ? (
                                            <input
                                                type="number"
                                                min="1"
                                                className="border border-gray-400 rounded w-24 text-center p-1"
                                                value={quantities[i]}
                                                onChange={handleQuantityChange(i)}
                                                placeholder="Nhập SL"
                                            />
                                        ) : (
                                            <span className="text-gray-400 italic">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-center border-b">Con</td>
                                </tr>
                            ))}
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
