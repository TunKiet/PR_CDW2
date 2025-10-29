import React from 'react'
import Button from '@mui/material/Button';
import { RiFileList2Line } from "react-icons/ri";
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
const IngredientAlert = () => {
    return (
        <>
            <div className="boxIngredient-alert">
                <div className="boxIngredient-alert-head flex my-2">
                    <div className="alert-title ms-2 text-red-500 font-bold">
                        <h5>Nguyên liệu sắp hết hàng</h5>
                    </div>
                    <div className="boxIngredient-button ms-auto">
                        <div className="boxIngredient-button-name me-3">
                            <Button variant='contained' color='primary'><RiFileList2Line size={20} />Tạo đơn nhập hàng</Button>

                            <Dialog>
                                Don hang nhap nguyen lieu
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div className="boxIngredient-table">
                    <table className='min-w-full border border-gray-300'>
                        <thead className='bg-gray-200'>
                            <tr>

                                <th className='px-4 py-2 text-center border-b'>Mã NL</th>
                                <th className='px-4 py-2 text-center border-b'>Tên NL</th>
                                <th className='px-4 py-2 text-center border-b'>Danh mục</th>
                                <th className='px-4 py-2 text-center border-b'>Tồn kho</th>
                                <th className='px-4 py-2 text-center border-b'>Ngưỡng</th>
                                <th className='px-4 py-2 text-center border-b'>Đơn vị</th>
                                <th className='px-4 py-2 text-center border-b'>Tiêu thụ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='border border-b-2'>
                                
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>Gà</td>
                                <td className='px-4 py-2 text-center border-b'>Thịt</td>
                                <td className='px-4 py-2 text-center border-b'>10</td>
                                <td className='px-4 py-2 text-center border-b'>15</td>
                                <td className='px-4 py-2 text-center border-b'>Con</td>
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
                            </tr>

                            <tr className='border border-b-2'>
                                
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>Gà</td>
                                <td className='px-4 py-2 text-center border-b'>Thịt</td>
                                <td className='px-4 py-2 text-center border-b'>10</td>
                                <td className='px-4 py-2 text-center border-b'>15</td>
                                <td className='px-4 py-2 text-center border-b'>Con</td>
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
                            </tr>

                            <tr className='border border-b-2'>
                               
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>Gà</td>
                                <td className='px-4 py-2 text-center border-b'>Thịt</td>
                                <td className='px-4 py-2 text-center border-b'>10</td>
                                <td className='px-4 py-2 text-center border-b'>15</td>
                                <td className='px-4 py-2 text-center border-b'>Con</td>
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
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default IngredientAlert