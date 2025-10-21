import React, { useState } from 'react'
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

const Ingredient = () => {
    //Filter data ingredient category
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    //Open dialog add ingredient
    const [openAdd, setOpenAdd] = useState(false);

    //Open dialog update ingredient
    const [openUpdate, setOpenUpdate] = useState(false);

    //Set ingredient category
    const [category, setCategory] = useState(false);


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

    const handleChange = (event) => {
        setCategory(event.target.value);
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
                                    <h3 className='text-center mt-3 border-b border-b-[#e8e8e8]'>Thêm mới nguyên liệu</h3>
                                    <div className="formAdd-ingredient">
                                        <div className="formAdd-info p-3">
                                            <div>
                                                <label htmlFor="">Mã NL</label>
                                                <input className='form-control' type="text" name="" id="" value={1} />
                                            </div>
                                            <div>
                                                <label htmlFor="">Tên nguyên liệu</label>
                                                <input className='form-control' type="text" name="" id="" value={`Ga`} />
                                            </div>
                                            <div>
                                                <label htmlFor="">Danh mục</label>
                                                <Select value={category} onChange={handleChange} className='w-full' sx={{
                                                    '& .MuiSelect-select': {
                                                        padding: '8px',
                                                    },
                                                }}>
                                                    <MenuItem value={1}>Thịt</MenuItem>
                                                    <MenuItem value={2}>Rau</MenuItem>
                                                    <MenuItem value={3}>Cá</MenuItem>
                                                    <MenuItem value={4}>Nước</MenuItem>
                                                </Select>
                                            </div>
                                            <div>
                                                <label htmlFor="">Tồn kho</label>
                                                <input className='form-control' type="text" name="" id="" value={10} />
                                            </div>
                                            <div>
                                                <label htmlFor="">Đơn vị</label>
                                                <input className='form-control' type="text" name="" id="" value={`Con`} />
                                            </div>
                                            <div>
                                                <label htmlFor="">Ngưỡng cảnh báo</label>
                                                <input className='form-control' type="text" name="" id="" value={2} />
                                            </div>
                                            <div>
                                                <label htmlFor="">Giá</label>
                                                <input className='form-control' type="text" name="" id="" value={120.000} />
                                            </div>
                                            <div className="formAdd-button flex">
                                                <div className='flex ms-auto py-3 gap-1.5'>
                                                    <div className="formAdd-button-left">
                                                        <Button variant='contained' color='error'>Hủy</Button>
                                                    </div>
                                                    <div className="formAdd-button-right">
                                                        <Button variant='contained' color='primary'>Thêm</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                <th className='px-4 py-2 text-center border-b'>Đơn vị</th>
                                <th className='px-4 py-2 text-center border-b'>Giá</th>
                                <th className='px-4 py-2 text-center border-b'>Tổng tiền</th>
                                <th className='px-4 py-2 text-center border-b'>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='border border-b-2'>
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>Gà</td>
                                <td className='px-4 py-2 text-center border-b'>Thịt</td>
                                <td className='px-4 py-2 text-center border-b'>10</td>
                                <td className='px-4 py-2 text-center border-b'>con</td>
                                <td className='px-4 py-2 text-center border-b'>120.000 đ</td>
                                <td className='px-4 py-2 text-center border-b'>1.200.000 đ</td>
                                <td className='text-center border-b'>
                                    {/* <Tooltip title="View">
                                                        <IconButton onClick={() => setOpenIngDetail(true)}>
                                                            <IoEyeOutline size={22} />
                                                        </IconButton>
                                                    </Tooltip> */}

                                    <Tooltip title="Update">
                                        <IconButton onClick={() => setOpenUpdate(true)}>
                                            <FaPencil size={20} />
                                        </IconButton>
                                    </Tooltip>
                                    {/* Dialog update ingredient */}
                                    <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
                                        <h3 className='text-center mt-3 border-b border-b-[#e8e8e8]'>Cập nhật nguyên liệu</h3>
                                        <div className="formUpdate-ingredient">
                                            <div className="fromUpdate-info p-3">
                                                <div>
                                                    <label htmlFor="">Mã NL</label>
                                                    <input className='form-control' type="text" name="" id="" value={1} readOnly />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Tên nguyên liệu</label>
                                                    <input className='form-control' type="text" name="" id="" value={`Ga`} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Danh mục</label>
                                                    <Select value={category} onChange={handleChange} className='w-full' sx={{
                                                        '& .MuiSelect-select': {
                                                            padding: '8px',
                                                        },
                                                    }}>
                                                        <MenuItem value={1}>Thịt</MenuItem>
                                                        <MenuItem value={2}>Rau</MenuItem>
                                                        <MenuItem value={3}>Cá</MenuItem>
                                                        <MenuItem value={4}>Nước</MenuItem>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label htmlFor="">Tồn kho</label>
                                                    <input className='form-control' type="text" name="" id="" value={10} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Đơn vị</label>
                                                    <input className='form-control' type="text" name="" id="" value={`Con`} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Ngưỡng cảnh báo</label>
                                                    <input className='form-control' type="text" name="" id="" value={2} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Giá</label>
                                                    <input className='form-control' type="text" name="" id="" value={120.000} />
                                                </div>
                                                <div className="fromUpdate-button flex">
                                                    <div className='flex ms-auto py-3 gap-1.5'>
                                                        <div className="fromUpdate-button-left">
                                                            <Button variant='contained' color='error'>Hủy</Button>
                                                        </div>
                                                        <div className="fromUpdate-button-right">
                                                            <Button variant='contained' color='primary'>Cập nhật</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog>
                                    <Tooltip title="Delete">
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>

                            <tr className='border border-b-2'>
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>Gà</td>
                                <td className='px-4 py-2 text-center border-b'>Thịt</td>
                                <td className='px-4 py-2 text-center border-b'>10</td>
                                <td className='px-4 py-2 text-center border-b'>con</td>
                                <td className='px-4 py-2 text-center border-b'>120.000 đ</td>
                                <td className='px-4 py-2 text-center border-b'>1.200.000 đ</td>
                                <td className='text-center border-b'>
                                    {/* <Tooltip title="View">
                                                        <IconButton onClick={() => setOpenIngDetail(true)}>
                                                            <IoEyeOutline size={22} />
                                                        </IconButton>
                                                    </Tooltip> */}

                                    <Tooltip title="Update">
                                        <IconButton onClick={() => setOpenUpdate(true)}>
                                            <FaPencil size={20} />
                                        </IconButton>
                                    </Tooltip>
                                    {/* Dialog update ingredient */}
                                    <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
                                        <h3 className='text-center mt-3 border-b border-b-[#e8e8e8]'>Cập nhật nguyên liệu</h3>
                                        <div className="formUpdate-ingredient">
                                            <div className="fromUpdate-info p-3">
                                                <div>
                                                    <label htmlFor="">Mã NL</label>
                                                    <input className='form-control' type="text" name="" id="" value={1} readOnly />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Tên nguyên liệu</label>
                                                    <input className='form-control' type="text" name="" id="" value={`Ga`} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Danh mục</label>
                                                    <Select value={category} onChange={handleChange} className='w-full' sx={{
                                                        '& .MuiSelect-select': {
                                                            padding: '8px',
                                                        },
                                                    }}>
                                                        <MenuItem value={1}>Thịt</MenuItem>
                                                        <MenuItem value={2}>Rau</MenuItem>
                                                        <MenuItem value={3}>Cá</MenuItem>
                                                        <MenuItem value={4}>Nước</MenuItem>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label htmlFor="">Tồn kho</label>
                                                    <input className='form-control' type="text" name="" id="" value={10} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Đơn vị</label>
                                                    <input className='form-control' type="text" name="" id="" value={`Con`} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Ngưỡng cảnh báo</label>
                                                    <input className='form-control' type="text" name="" id="" value={2} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Giá</label>
                                                    <input className='form-control' type="text" name="" id="" value={120.000} />
                                                </div>
                                                <div className="fromUpdate-button flex">
                                                    <div className='flex ms-auto py-3 gap-1.5'>
                                                        <div className="fromUpdate-button-left">
                                                            <Button variant='contained' color='error'>Hủy</Button>
                                                        </div>
                                                        <div className="fromUpdate-button-right">
                                                            <Button variant='contained' color='primary'>Cập nhật</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog>
                                    <Tooltip title="Delete">
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>

                            <tr className='border border-b-2'>
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>Gà</td>
                                <td className='px-4 py-2 text-center border-b'>Thịt</td>
                                <td className='px-4 py-2 text-center border-b'>10</td>
                                <td className='px-4 py-2 text-center border-b'>con</td>
                                <td className='px-4 py-2 text-center border-b'>120.000 đ</td>
                                <td className='px-4 py-2 text-center border-b'>1.200.000 đ</td>
                                <td className='text-center border-b'>
                                    {/* <Tooltip title="View">
                                                        <IconButton onClick={() => setOpenIngDetail(true)}>
                                                            <IoEyeOutline size={22} />
                                                        </IconButton>
                                                    </Tooltip> */}

                                    <Tooltip title="Update">
                                        <IconButton onClick={() => setOpenUpdate(true)}>
                                            <FaPencil size={20} />
                                        </IconButton>
                                    </Tooltip>
                                    {/* Dialog update ingredient */}
                                    <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
                                        <h3 className='text-center mt-3 border-b border-b-[#e8e8e8]'>Cập nhật nguyên liệu</h3>
                                        <div className="formUpdate-ingredient">
                                            <div className="fromUpdate-info p-3">
                                                <div>
                                                    <label htmlFor="">Mã NL</label>
                                                    <input className='form-control' type="text" name="" id="" value={1} readOnly />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Tên nguyên liệu</label>
                                                    <input className='form-control' type="text" name="" id="" value={`Ga`} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Danh mục</label>
                                                    <Select value={category} onChange={handleChange} className='w-full' sx={{
                                                        '& .MuiSelect-select': {
                                                            padding: '8px',
                                                        },
                                                    }}>
                                                        <MenuItem value={1}>Thịt</MenuItem>
                                                        <MenuItem value={2}>Rau</MenuItem>
                                                        <MenuItem value={3}>Cá</MenuItem>
                                                        <MenuItem value={4}>Nước</MenuItem>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label htmlFor="">Tồn kho</label>
                                                    <input className='form-control' type="text" name="" id="" value={10} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Đơn vị</label>
                                                    <input className='form-control' type="text" name="" id="" value={`Con`} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Ngưỡng cảnh báo</label>
                                                    <input className='form-control' type="text" name="" id="" value={2} />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Giá</label>
                                                    <input className='form-control' type="text" name="" id="" value={120.000} />
                                                </div>
                                                <div className="fromUpdate-button flex">
                                                    <div className='flex ms-auto py-3 gap-1.5'>
                                                        <div className="fromUpdate-button-left">
                                                            <Button variant='contained' color='error'>Hủy</Button>
                                                        </div>
                                                        <div className="fromUpdate-button-right">
                                                            <Button variant='contained' color='primary'>Cập nhật</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog>
                                    <Tooltip title="Delete">
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                {/* Paginaition ingredient */}
                <div className="reviewModerator-pagination flex justify-center pt-2">
                    <Pagination count={5} variant="outlined" color='primary' />
                </div>
            </div>
        </>
    )
}

export default Ingredient