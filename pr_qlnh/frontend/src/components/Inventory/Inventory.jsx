import React, { useCallback, useEffect, useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Ingredient from './Ingredient'
import IngredientAlert from './IngredientAlert'
import IngredientInOut from './IngredientInOut'
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import axios from "axios";

const Invertory = () => {
    //data ingredient alert
    const [activeTab, setActiveTab] = useState(1);
    const [ingredientAlert, setIngredientAlert] = useState([]);
    const [loading, setLoading] = useState(true);

    //data ingredient list
    const [ingredients, setIngredients] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    //fetch api ingredieng alert
    useEffect(() => {
        const fetchAlert = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8000/api/alert");
                setIngredientAlert(res.data.data);
                console.log(res.data.data);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchAlert();
    }, []);

    const fetchIngredients = useCallback(async () => {
        try {
            let url = `http://localhost:8000/api/ingredients?page=${page}`;
            console.log(selectedCategory);
            if (selectedCategory !== 'all') {
                url += `&category_ingredient_id=${selectedCategory}`;
            }

            console.log("📡 Gọi API:", url);

            const res = await axios.get(url);
            console.log("📦 Dữ liệu nhận được:", res.data);

            setIngredients(res.data.data);
            setTotalPages(res.data.last_page);
            setLoading(false);
        } catch (error) {
            console.error("❌ Lỗi fetch nguyên liệu:", error);
            setLoading(false);
        }
    }, [page, selectedCategory]);

    const tabs = [
        { id: 1, label: "Quản lý nguyên liệu" },
        { id: 2, label: "Cảnh báo nguyên liệu" },
        { id: 3, label: "Thống kê Nhập/Xuất" },
    ];
    return (
        <>
            <div className="section">
                <div className="flex min-h-screen">
                    <Sidebar />
                    <div className="w-[85%] bg-gray-100 p-6">
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
                                                    ? "text-orange-500 font-bold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-orange-500"
                                                    : "text-gray-600 hover:text-orange-400"
                                                    }`}
                                                onClick={() => setActiveTab(tab.id)}
                                            >
                                                {tab.id === 2 ? (
                                                    ingredientAlert.length > 0 ? (
                                                        <Badge
                                                            color="error"
                                                            badgeContent={ingredientAlert.length}
                                                            max={99}
                                                        >
                                                            <p className="mb-0">{tab.label}</p>
                                                        </Badge>
                                                    ) : (
                                                        <p className="mb-0">{tab.label}</p>
                                                    )
                                                ) : (
                                                    <p className="mb-0">{tab.label}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="boxIngredient-content mt-4">
                                {activeTab === 1 && <Ingredient
                                    loading={loading}
                                    ingredients={ingredients}
                                    setPage={setPage}
                                    page={page}
                                    totalPages={totalPages}
                                    setSelectedCategory={setSelectedCategory}
                                    fetchIngredients={fetchIngredients}
                                />}
                                {activeTab === 2 && <IngredientAlert loading={loading} ingredientAlert={ingredientAlert} />}
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