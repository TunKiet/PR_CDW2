import React from 'react'

const IngredientAlert = () => {
    return (
        <>
            <div className="boxIngredient-alert">
                <div className="boxIngredient-alert-head">
                    <div className="alert-title ms-2 text-red-500 font-bold">
                        <h5>Nguyên liệu sắp hết hàng</h5>
                    </div>
                </div>
                <div className="boxIngredient-table">
                    <table className='min-w-full border border-gray-300'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='px-4 py-2 text-center border-b'>Mã NL</th>
                                <th className='px-4 py-2 text-center border-b'>Tên NL</th>
                                <th className='px-4 py-2 text-center border-b'>Tồn kho</th>
                                <th className='px-4 py-2 text-center border-b'>Ngưỡng</th>
                                <th className='px-4 py-2 text-center border-b'>Đơn vị</th>
                                <th className='px-4 py-2 text-center border-b'>Tiêu thụ</th>
                                <th className='px-4 py-2 text-center border-b'>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='border border-b-2'>
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>Gà</td>
                                <td className='px-4 py-2 text-center border-b'>10</td>
                                <td className='px-4 py-2 text-center border-b'>15</td>
                                <td className='px-4 py-2 text-center border-b'>Con</td>
                                <td className="px-4 py-2 border-b">
                                    <div className="relative w-full max-w-[200px] mx-auto h-[20px]">
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