import React, { useCallback, useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import Button from '@mui/material/Button';
import { MdOutlineInventory } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { TbFilter } from "react-icons/tb";
import { FaPencil } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import axios from "axios";

const Ingredient = () => {
    //Filter data ingredient category
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    //Open dialog add ingredient
    const [openAdd, setOpenAdd] = useState(false);

    //Open dialog update ingredient
    const [openUpdate, setOpenUpdate] = useState(false);

    //Set ingredient category
    // const [category, setCategory] = useState(false);

    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    //Save change when edit ingredient
    const [editIngredient, setEditIngredient] = useState(null);

    const [selectedCategoryId, setSelectedCategoryId] = useState([]);
    const [formData, setFormData] = useState({
        ingredient_name: "",
        category_ingredient_id: "",
        price: "",
        unit: "",
        total_price: "",
        stock_quantity: "",
        min_stock_level: "",
    });

    // const [editFormData, setEditFormData] = useState({
    //     ingredient_name: "",
    //     category_ingredient_id: "",
    //     price: "",
    //     unit: "",
    //     total_price: "",
    //     stock_quantity: "",
    //     min_stock_level: "",
    // })


    useEffect(() => {
        axios.get("http://localhost:8000/api/category-ingredient")
            .then(res => setSelectedCategoryId(res.data.data))
            .catch(err => console.log(err));
    }, []);

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (category) => {
        console.log("Selected:", category);
        handleClose();
    };

    // const handleChange = (event) => {
    //     setCategory(event.target.value);
    // };

    //fetch data
    const fetchIngredients = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/ingredients?page=${page}`);
            setIngredients(res.data.data);
            setTotalPages(res.data.last_page);
            setLoading(false);
        } catch (error) {
            console.error("Fetch error:", error);
            setLoading(false);
        }
    }, [page]); // page là dependency hợp lệ

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSubmit = e => {
        e.preventDefault();

        axios.post("http://localhost:8000/api/add", formData)
            .then(res => {
                alert("Thêm nguyên liệu thành công!");
                console.log(res.data);
                fetchIngredients();
            })
            .catch(err => {
                console.log(err.response.data);
                alert("Có lỗi xảy ra khi thêm nguyên liệu!");
            });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa nguyên liệu này không?");
        if (!confirmDelete) return;

        try {
            const res = await axios.delete(`http://localhost:8000/api/ingredients/delete/${id}`);
            alert(res.data.message);

            fetchIngredients();
        } catch (error) {
            console.error("Lỗi khi xóa nguyên liệu:", error);
            alert("Xóa nguyên liệu thất bại!");
        }
    }

    // Gửi dữ liệu cập nhật đến server
    const handleUpdateIngredient = async () => {
        if (!editIngredient) return;

        try {
            const res = await fetch(`http://localhost:8000/api/ingredients/${editIngredient.ingredient_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    ingredient_name: editIngredient.ingredient_name,
                    category_ingredient_id: editIngredient.category_ingredient_id,
                    price: editIngredient.price,
                    unit: editIngredient.unit,
                    stock_quantity: editIngredient.stock_quantity,
                    min_stock_level: editIngredient.min_stock_level,
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("✅ Cập nhật thành công!");
                setOpenUpdate(false);
                // Gọi lại API lấy danh sách nguyên liệu (để reload)
                fetchIngredients();
            } else {
                alert("" + data.message);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật nguyên liệu:", error);
            alert("Đã xảy ra lỗi khi cập nhật!");
        }
    };


    return (
        <>
            <div className="boxIngredient-body">
                {/* Control bar ingredient */}
                <div className="boxIngredient-setting flex my-2">
                    <div className="boxIngredient-search w-[600px]">
                        <div className="search-input relative ms-2">
                            <div className="search-icon">
                                <CiSearch className='absolute right-0 top-2.5 me-2' />
                            </div>
                            <input type="search" className='form-control' placeholder='Tìm kiếm nguyên liệu...' />
                        </div>
                    </div>
                    <div className="boxIngredient-wapper ms-auto">
                        <div className="boxIngredient-button flex gap-1">
                            <div className="boxIngredient-filter">
                                <Tooltip title="Lọc danh mục">
                                    <IconButton onClick={handleClick}>
                                        <TbFilter size={25} />
                                    </IconButton>
                                </Tooltip>
                                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                    <MenuItem onClick={() => handleSelect('Tất cả')}>Tất cả</MenuItem>
                                    <MenuItem onClick={() => handleSelect('Thịt')}>Thịt</MenuItem>
                                    <MenuItem onClick={() => handleSelect('Rau')}>Rau</MenuItem>
                                    <MenuItem onClick={() => handleSelect('Gia vị')}>Gia vị</MenuItem>
                                </Menu>
                            </div>
                            <div className="boxIngredient-button-left">
                                <Button variant='contained' color='error'>
                                    <MdOutlineInventory size={20} />
                                    <p className='mb-0'>Xuất tồn kho (PDF)</p>
                                </Button>
                            </div>
                            <div className="boxIngredient-button-right mx-2">
                                <Button variant='contained' color='primary' onClick={() => setOpenAdd(true)}>
                                    <IoIosAdd color='white' size={20} />
                                    <p className="mb-0">Thêm nguyên liệu</p>
                                </Button>
                                {/* Dialog add ingredient form */}
                                <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
                                    <form onSubmit={handleSubmit}>
                                        <h3 className='text-center mt-3 border-b border-b-[#e8e8e8]'>Thêm mới nguyên liệu</h3>
                                        <div className="formAdd-ingredient">
                                            <div className="formAdd-info p-3">

                                                <div>
                                                    <label htmlFor="">Tên nguyên liệu</label>
                                                    <input className='form-control' type="text" onChange={handleChange} name="ingredient_name" value={formData.ingredient_name} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Danh mục</label>
                                                    <Select name='category_ingredient_id'
                                                        value={formData.category_ingredient_id}
                                                        onChange={handleChange} className='w-full' required sx={{
                                                            '& .MuiSelect-select': {
                                                                padding: '8px',
                                                            },
                                                        }}>
                                                        {selectedCategoryId.map(ca => (
                                                            <MenuItem
                                                                key={ca.category_ingredient_id}
                                                                value={ca.category_ingredient_id}
                                                            >
                                                                {ca.category_ingredient_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label htmlFor="">Tồn kho</label>
                                                    <input className='form-control' type="number"
                                                        name="stock_quantity"
                                                        value={formData.stock_quantity}
                                                        onChange={handleChange} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Ngưỡng cảnh báo</label>
                                                    <input className='form-control' type="number"
                                                        name="min_stock_level"
                                                        value={formData.min_stock_level}
                                                        onChange={handleChange} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Đơn vị</label>
                                                    <input className='form-control' type="text" name="unit"
                                                        value={formData.unit}
                                                        onChange={handleChange} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Giá</label>
                                                    <input className='form-control' type="number" name="price"
                                                        value={formData.price}
                                                        onChange={handleChange} />
                                                </div>
                                                <div className="formAdd-button flex">
                                                    <div className='flex ms-auto py-3 gap-1.5'>
                                                        <div className="formAdd-button-left">
                                                            <Button variant='contained' color='error'>Hủy</Button>
                                                        </div>
                                                        <div className="formAdd-button-right">
                                                            <Button type='submit' variant='contained' color='primary'>Thêm</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Table list ingredient */}
                <div className="boxIngredient-table">
                    <table className='min-w-full border border-gray-300'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='px-4 py-2 text-center border-b'>Mã NL</th>
                                <th className='px-4 py-2 text-center border-b'>Tên</th>
                                <th className='px-4 py-2 text-center border-b'>Danh mục</th>
                                <th className='px-4 py-2 text-center border-b'>Tồn kho</th>
                                <th className='px-4 py-2 text-center border-b'>Ngưỡng</th>
                                <th className='px-4 py-2 text-center border-b'>Đơn vị</th>
                                <th className='px-4 py-2 text-center border-b'>Giá</th>
                                <th className='px-4 py-2 text-center border-b'>Tổng tiền</th>
                                <th className='px-4 py-2 text-center border-b'>Ngày tạo</th>
                                <th className='px-4 py-2 text-center border-b'>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-3 text-gray-500">
                                            Dang tai du lieu...
                                        </td>
                                    </tr>
                                ) :
                                    ingredients.length > 0 ? (
                                        ingredients.map((ingredient) => (
                                            <tr key={ingredient.ingredient_id} className='border border-b-2'>
                                                <td className='text-center border-b'>{ingredient.ingredient_id}</td>
                                                <td className='text-center border-b'>{ingredient.ingredient_name}</td>
                                                <td className='text-center border-b'>{ingredient.category_ingredient.category_ingredient_name}</td>
                                                <td className='text-center border-b'>{ingredient.stock_quantity}</td>
                                                <td className='text-center border-b'>{ingredient.min_stock_level}</td>
                                                <td className='text-center border-b'>{ingredient.unit}</td>
                                                <td className='text-center border-b'>{Number(ingredient.price).toLocaleString('vi-VN')} đ</td>
                                                <td className='text-center border-b'>{Number(ingredient.total_price).toLocaleString('vi-VN')} đ</td>
                                                <td className='text-center border-b'>{ingredient.created_at}</td>
                                                <td className='text-center border-b'>
                                                    <Tooltip title="Update">
                                                        <IconButton onClick={() => { setEditIngredient(ingredient); setOpenUpdate(true); }}>
                                                            <FaPencil size={20} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {/* Dialog update ingredient */}

                                                    <Tooltip title="Delete">
                                                        <IconButton onClick={() => handleDelete(ingredient.ingredient_id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-3 text-gray-500">
                                                Không có nguyên liệu nào
                                            </td>
                                        </tr>
                                    )
                            }
                        </tbody>
                    </table>
                    <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
                        <h3 className='text-center mt-3 border-b border-b-[#e8e8e8]'>Cập nhật nguyên liệu</h3>
                        {editIngredient && (
                            <div className="formUpdate-ingredient">
                                <div className="fromUpdate-info p-3">
                                    <div>
                                        <label htmlFor="">Mã NL</label>
                                        <input className='form-control' type="text" value={editIngredient.ingredient_id} readOnly />
                                    </div>
                                    <div>
                                        <label htmlFor="">Tên nguyên liệu</label>
                                        <input className='form-control' type="text" value={editIngredient.ingredient_name}
                                            onChange={(e) => setEditIngredient({ ...editIngredient, ingredient_name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Danh mục</label>
                                        <Select
                                            value={editIngredient.category_ingredient_id}
                                            onChange={(e) =>
                                                setEditIngredient({
                                                    ...editIngredient,
                                                    category_ingredient_id: e.target.value,
                                                })
                                            }
                                            className="w-full"
                                            sx={{ "& .MuiSelect-select": { padding: "8px" } }}
                                        >
                                            {selectedCategoryId.map(ca => (
                                                <MenuItem
                                                    key={ca.category_ingredient_id}
                                                    value={ca.category_ingredient_id}
                                                >
                                                    {ca.category_ingredient_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div>
                                        <label htmlFor="">Tồn kho</label>
                                        <input className='form-control' type="number" value={editIngredient.stock_quantity}
                                            onChange={(e) =>
                                                setEditIngredient({
                                                    ...editIngredient,
                                                    stock_quantity: e.target.value,
                                                })
                                            } />
                                    </div>
                                    <div>
                                        <label htmlFor="">Ngưỡng cảnh báo</label>
                                        <input className='form-control' type="text" name="" id="" value={editIngredient.min_stock_level}
                                            onChange={(e) => setEditIngredient({ ...editIngredient, min_stock_level: e.target.value })} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Đơn vị</label>
                                        <input className='form-control' type="text" value={editIngredient.unit}
                                            onChange={(e) => setEditIngredient({ ...editIngredient, unit: e.target.value })} />
                                    </div>
                                    <div>
                                        <label htmlFor="">Giá</label>
                                        <input className='form-control' type="number" value={editIngredient.price}
                                            onChange={(e) => setEditIngredient({ ...editIngredient, price: e.target.value })} />
                                    </div>
                                    <div className="fromUpdate-button flex">
                                        <div className='flex ms-auto py-3 gap-1.5'>
                                            <div className="fromUpdate-button-left">
                                                <Button variant='contained' color='error' onClick={() => setOpenUpdate(false)}>Hủy</Button>
                                            </div>
                                            <div className="fromUpdate-button-right">
                                                <Button variant='contained' color='primary' onClick={handleUpdateIngredient}>Cập nhật</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </div>
                {/* Paginaition ingredient */}
                <div className="reviewModerator-pagination flex justify-center pt-2">
                    <Pagination spacing={2} count={totalPages} page={page} onChange={handlePageChange} variant="outlined" color='primary' />
                </div>
            </div>
        </>
    )
}

export default Ingredient