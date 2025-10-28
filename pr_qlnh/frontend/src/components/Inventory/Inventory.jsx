import React, { useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Ingredient from './Ingredient'
import IngredientAlert from './IngredientAlert'
import IngredientInOut from './IngredientInOut'


const Invertory = () => {

    const [activeTab, setActiveTab] = useState(1);

    const tabs = [
        { id: 2, label: "Quản lý nguyên liệu" },
        { id: 1, label: "Cảnh báo nguyên liệu" },
        { id: 3, label: "Thống kê Nhập/Xuất" },
    ];
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
                                        {tabs.map((tab) => (
                                            <div
                                                key={tab.id}
                                                className={`relative cursor-pointer pb-1 transition-all duration-300 ${activeTab === tab.id
                                                    ? "text-orange-500 font-bold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300"
                                                    : "text-gray-600 hover:text-orange-400 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-0.5 after:bg-orange-400 after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full"
                                                    }`}
                                                onClick={() => setActiveTab(tab.id)}
                                            >
                                                <p className="mb-0">{tab.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="boxIngredient-content mt-4">
                                {activeTab === 2 && <Ingredient />}
                                {activeTab === 1 && <IngredientAlert />}
                                {activeTab === 3 && <IngredientInOut />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Invertory