import React, { useEffect, useState } from 'react';
import { TbFilter } from "react-icons/tb";
import { IconButton, Menu, MenuItem, Tooltip, CircularProgress } from '@mui/material';
import axios from 'axios';

const CategoryIngredient = ({ onSelectCategory }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [categories, setCategories] = useState([]);
    // const [loading, setLoading] = useState(false);

    const open = Boolean(anchorEl);

    // 🔹 Fetch danh mục từ backend khi component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // setLoading(true);
                const res = await axios.get("http://localhost:8000/api/category-ingredient");
                setCategories(res.data?.data || res.data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                // setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // 🔹 Sự kiện mở / đóng menu
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    // 🔹 Chọn danh mục
    const handleSelect = (categoryId) => {
        console.log("🟢 Selected category ID:", categoryId);
        onSelectCategory(categoryId); // gửi ID lên Ingredient.jsx
        handleClose();
    };

    return (
        <>
            <Tooltip title="Filter by category">
                <IconButton onClick={handleClick}>
                    <TbFilter size={25} />
                </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => handleSelect('all')}>All</MenuItem>
                {categories.map((cat) => (
                    <MenuItem
                        key={cat.category_ingredient_id}
                        onClick={() => handleSelect(cat.category_ingredient_id)}
                    >
                        {cat.category_ingredient_name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default CategoryIngredient;
