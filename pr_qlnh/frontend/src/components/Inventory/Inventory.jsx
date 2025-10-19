import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Ingredient from './Ingredient'


const Invertory = () => {

    return (
        <>
            <div className="section">
                <div className="flex min-h-screen">
                    <div className="w-[20%]">
                        <Sidebar />
                    </div>
                    <div className="w-[80%] bg-gray-100 p-6">
                        <div className="boxIngredient">
                            <div className="boxIngredient-head">
                                <div className="boxIngredient-head-title">
                                    <h2>Quan ly kho va nguyen lieu</h2>
                                </div>
                                <hr />
                                <div className="boxIngredient-menu my-2">
                                    <div className="boxIngredient-menu-item flex p-2 gap-4.5">
                                        <div className="item-ingredient cursor-pointer">
                                            <p className='mb-0'>Quản lý nguyên liệu</p>
                                        </div>
                                        <div className="item-inventory cursor-pointer">
                                            <p className='mb-0'>Cảnh báo nguên liệu</p>

                                        </div>
                                        <div className="item-input-output cursor-pointer">
                                            <p className='mb-0'>Thống kê Nhập/Xuất</p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Ingredient />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Invertory