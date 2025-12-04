import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaPencil } from "react-icons/fa6";
import Button from '@mui/material/Button';
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { notify, confirmAction } from '../../utils/notify'

import { FaGauge, FaPlus, FaBoxesStacked, FaListCheck, FaTruck, FaMagnifyingGlass, FaBell, FaCircleUser, FaCubesStacked, FaTriangleExclamation, FaWallet } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const statusBadge = {
  good: "bg-green-500",
  warning: "bg-orange-500",
  low: "bg-red-200",
  out: "bg-red-500",
};

const endPoint = 'http://localhost:8000/api';

const InventoryOverview = () => {

  const navigate = useNavigate();
    const linkCreateOrder = () => {
        navigate("/create-order"); // đường dẫn tới CreateOrder.jsx
    };

  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIngredient, setTotalIngredient] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [wanningCount, setWanningCount] = useState(0);
  const [editIngredient, setEditIngredient] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [formErrors, setFormErrors] = useState({});


  const validateForm = () => {
    const errors = {};

    //Validate ingredient name
    if (!formData.ingredient_name.trim()) {
      errors.ingredient_name = "Tên nguyên liệu không được để trống";
    } else if (!/^[\p{L}\p{N}\s]+$/u.test(formData.ingredient_name)) {
      errors.ingredient_name = "Tên nguyên liệu không chứa ký tự đặc biệt)";
    }

    //Validate unit
    if (!formData.unit.trim()) {
      errors.unit = "Đơn vị không được để trống";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.unit)) {
      errors.unit = "Đơn vị không được chứa ký tự đặc biệt";
    }

    // Giá
    if (formData.price === "" || formData.price < 0) {
      errors.price = "Giá phải lớn hơn hoặc bằng 0";
    }

    // Tồn kho
    if (formData.stock_quantity === "" || formData.stock_quantity < 0) {
      errors.stock_quantity = "Tồn kho phải lớn hơn hoặc bằng 0";
    }

    // Ngưỡng cảnh báo
    if (formData.min_stock_level === "" || formData.min_stock_level < 0) {
      errors.min_stock_level = "Ngưỡng cảnh báo phải lớn hơn hoặc bằng 0";
    }

    // Danh mục
    if (!formData.category_ingredient_id) {
      errors.category_ingredient_id = "Vui lòng chọn danh mục";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // true nếu không lỗi
  }

  //Fetch all ingredients
  const fetchIngredients = async () => {
    try {
      const res = await axios.get(`${endPoint}/ingredients?page=${page}`);
      console.log("📦 Dữ liệu nhận được:", res.data);

      setIngredients(res.data.ingredients.data);
      setTotalIngredient(res.data.ingredients.total);
      setTotalPages(res.data.ingredients.last_page);
      setWanningCount(res.data.wanning_ingredient);
      setTotalValue(res.data.total_value)
      setLoading(false);
    } catch (error) {
      console.error("❌ Lỗi fetch nguyên liệu:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIngredients();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  //Form add ingredient
  const [formData, setFormData] = useState({
    ingredient_name: "",
    category_ingredient_id: "",
    price: "",
    unit: "",
    total_price: "",
    stock_quantity: "",
    min_stock_level: "",
  });

  //Process button when click
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        notify.info('Đang thêm...');

        await axios.post("http://localhost:8000/api/add", formData);

        notify.dismiss();
        notify.success('Thêm thành công!');

        //reset form data
        setFormData({
          ingredient_name: "",
          category_ingredient_id: "",
          price: "",
          unit: "",
          total_price: "",
          stock_quantity: "",
          min_stock_level: "",
        })
        //Load api
        fetchIngredients();
      } catch (error) {
        notify.dismiss();
        console.log(error);
        notify.error('Thêm thất bại');
      }
    } else {
      console.log("Có lỗi trong form:", formErrors);
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật dữ liệu form
    setFormData(prev => ({ ...prev, [name]: value }));

    // Xử lý validation "ngay lập tức"
    setFormErrors(prev => {
      const newErrors = { ...prev };

      switch (name) {
        case "ingredient_name":
          if (!value.trim()) {
            newErrors.ingredient_name = "Tên nguyên liệu không được để trống";
          } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
            newErrors.ingredient_name = "Tên nguyên liệu không được chứa ký tự đặc biệt";
          } else {
            delete newErrors.ingredient_name;
          }
          break;

        case "category_ingredient_id":
          if (!value) {
            newErrors.category_ingredient_id = "Vui lòng chọn danh mục";
          } else {
            delete newErrors.category_ingredient_id;
          }
          break;

        case "unit":
          if (!value.trim()) {
            newErrors.unit = "Đơn vị không được để trống";
          } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
            newErrors.unit = "Đơn vị không được chứa ký tự đặc biệt";
          } else {
            delete newErrors.unit;
          }
          break;

        case "price":
          if (value === "" || parseFloat(value) < 0) {
            newErrors.price = "Giá phải lớn hơn hoặc bằng 0";
          } else {
            delete newErrors.price;
          }
          break;

        case "stock_quantity":
          if (value === "" || parseFloat(value) < 0) {
            newErrors.stock_quantity = "Tồn kho phải lớn hơn hoặc bằng 0";
          } else {
            delete newErrors.stock_quantity;
          }
          break;

        case "min_stock_level":
          if (value === "" || parseFloat(value) < 0) {
            newErrors.min_stock_level = "Ngưỡng cảnh báo phải lớn hơn hoặc bằng 0";
          } else {
            delete newErrors.min_stock_level;
          }
          break;

        default:
          break;
      }

      return newErrors;
    });
  };

  //Delete ingredient
  const handleDelete = async (id) => {
    const isConfirmed = await confirmAction('Xóa nguyên liệu?');
    if (!isConfirmed) return;

    try {
      notify.info('Đang xóa...')
      await axios.delete(`http://localhost:8000/api/ingredients/delete/${id}`);

      notify.dismiss();
      notify.success('Xóa thành công!');

      fetchIngredients();
    } catch (error) {
      notify.dismiss();
      console.error("Lỗi khi xóa nguyên liệu:", error);
      notify.error('Xóa thất bại! Vui lòng tải lại trang');
    }
  }

  //Fetch api category ingredient
  useEffect(() => {
    axios.get("http://localhost:8000/api/category-ingredient")
      .then(res => setSelectedCategoryId(res.data.data))
      .catch(err => console.log(err));
  }, []);

  //Update ingredient
  const handleUpdateIngredient = async () => {
    if (!editIngredient) {
      notify.warning("⚠️ Không có dữ liệu nguyên liệu để cập nhật!");
      return;
    }

    try {
      notify.info('Đang cập nhật...');
      const payload = {
        ingredient_name: editIngredient.ingredient_name?.trim(),
        category_ingredient_id: editIngredient.category_ingredient_id,
        price: editIngredient.price,
        unit: editIngredient.unit,
        stock_quantity: editIngredient.stock_quantity,
        min_stock_level: editIngredient.min_stock_level,
      };

      const { data } = await axios.put(
        `http://localhost:8000/api/ingredients/${editIngredient.ingredient_id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      notify.dismiss();

      if (data.success) {
        notify.success("Cập nhật nguyên liệu thành công!");
        setOpenUpdate(false);
        fetchIngredients(); // reload danh sách
      } else {
        notify.error(`${data.message || "Cập nhật thất bại!"}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật nguyên liệu:", error);
      notify.error("Đã xảy ra lỗi trong quá trình cập nhật nguyên liệu!");
    }
  };

  //Fomat money
  const formatVND = (value) => {
    return Number(value).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="section">
      <div className="flex min-h-screen">
        <div className="w-[15%]"><Sidebar /></div>
        <div className="w-[85%] h-screen p-4 bg-gray-100 mx-auto overflow-hidden">
          <header className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Kho Nguyên Nhà Hàng D</h3>
              <p className="text-gray-500 text-sm">Quản lý tồn kho — cảnh báo khi thiếu hàng</p>
            </div>
          </header>
          <div className="flex gap-3 mb-3">
            <div className="flex-1 flex justify-between items-center p-2 bg-white rounded-xl shadow">
              <div>
                <p className="text-gray-500 text-sm m-2">Tổng nguyên liệu</p>
                <p className="text-lg font-bold text-gray-900 m-2">{totalIngredient}</p>
                <p className="text-green-500 text-xs font-semibold m-2">+12% trong tháng</p>
              </div>
              <div className="w-14 h-14 bg-linear-to-tr from-blue-400 to-blue-600 text-white flex items-center justify-center rounded-xl">
                <FaCubesStacked />
              </div>
            </div>
            <div className="flex-1 flex justify-between items-center p-2 bg-white rounded-xl shadow">
              <div>
                <p className="text-gray-500 text-sm m-2">Cảnh báo tồn kho</p>
                <p className="text-lg font-bold text-gray-900 m-2">{wanningCount}</p>
                <p onClick={linkCreateOrder} className="text-pink-500 text-xs font-semibold m-2 cursor-pointer">Nhập ngay</p>
              </div>
              <div className="w-14 h-14 bg-linear-to-tr from-orange-400 to-pink-400 text-white flex items-center justify-center rounded-xl">
                <FaTriangleExclamation />
              </div>
            </div>
            <div className="flex-1 flex justify-between items-center p-2 bg-white rounded-xl shadow">
              <div>
                <p className="text-gray-500 text-sm m-2">Giá trị tồn kho</p>
                <p className="text-lg font-bold text-gray-900 m-2">{formatVND(totalValue)}</p>
                <p className="text-green-500 text-xs font-semibold m-2">Cập nhật 1 giờ trước</p>
              </div>
              <div className="w-14 h-14 bg-linear-to-tr from-green-400 to-green-500 text-white flex items-center justify-center rounded-xl">
                <FaWallet />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">Danh sách nguyên liệu</div>
              <Button onClick={() => setOpenAdd(true)} type='submit' variant='contained' color='primary' className="">Thêm Nguyên liệu</Button>

              <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                  <h3 className='text-center mt-3 border-b border-b-[#e8e8e8]'>Thêm mới nguyên liệu</h3>
                  <div className="formAdd-ingredient">
                    <div className="formAdd-info p-3">

                      <div>
                        <label htmlFor="">Tên nguyên liệu</label>
                        <input className='form-control' type="text" onChange={handleChange} name="ingredient_name" value={formData.ingredient_name} />
                        {formErrors.ingredient_name && <p className="text-red-500 text-xs">{formErrors.ingredient_name}</p>}
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
                        {formErrors.category_ingredient_id && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.category_ingredient_id}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="">Tồn kho</label>
                        <input className='form-control' type="number"
                          name="stock_quantity"
                          value={formData.stock_quantity}
                          onChange={handleChange} />
                        {formErrors.stock_quantity && <p className="text-red-500 text-xs">{formErrors.stock_quantity}</p>}
                      </div>
                      <div>
                        <label htmlFor="">Ngưỡng cảnh báo</label>
                        <input className='form-control' type="number"
                          name="min_stock_level"
                          value={formData.min_stock_level}
                          onChange={handleChange} />
                        {formErrors.min_stock_level && <p className="text-red-500 text-xs">{formErrors.min_stock_level}</p>}

                      </div>
                      <div>
                        <label htmlFor="">Đơn vị</label>
                        <input className='form-control' type="text" name="unit"
                          value={formData.unit}
                          onChange={handleChange} />
                        {formErrors.unit && <p className="text-red-500 text-xs">{formErrors.unit}</p>}

                      </div>
                      <div>
                        <label htmlFor="">Giá</label>
                        <input className='form-control' type="number" name="price"
                          value={formData.price}
                          onChange={handleChange} />
                        {formErrors.price && <p className="text-red-500 text-xs">{formErrors.price}</p>}

                      </div>
                      <div className="formAdd-button flex">
                        <div className='flex ms-auto py-3 gap-1.5'>
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
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-start border-b">
                  <th>Tên nguyên liệu</th>
                  <th>Danh mục</th>
                  <th>Đơn vị</th>
                  <th>Số lượng tồn</th>
                  <th>Trạng thái</th>
                  <th className='text-center'>Tình trạng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? (
                    <tr className='text-center'>
                      <td>
                        <CircularProgress />
                      </td>
                    </tr>
                  ) : ingredients.length > 0 ? (
                    ingredients.map((ingredient) => {
                      const percent = ingredient.stock_quantity * ingredient.min_stock_level;
                      const badge = ingredient.status;

                      return (
                        <tr key={ingredient.ingredient_id} className="border-b border-gray-200 border-b-gray-200!">
                          <td className='p-3 border-b border-gray-200 border-b-gray-200!'>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold">{ingredient.ingredient_name.charAt(0)}</div>
                              <div>
                                <div className="font-semibold">{ingredient.ingredient_name}</div>
                                <div className="text-gray-500 text-xs">Mã: NL{ingredient.ingredient_id} • Giá {formatVND(ingredient.price)} / {ingredient.unit}</div>
                              </div>
                            </div>
                          </td>
                          <td className='p-3 border-b border-gray-200 border-b-gray-200!'>{ingredient.category_ingredient.category_ingredient_name}</td>
                          <td className='p-3 border-b border-gray-200 border-b-gray-200!'>{ingredient.unit}</td>
                          <td className='p-3 border-b border-gray-200 border-b-gray-200!'>{ingredient.stock_quantity}</td>
                          <td className='p-3 border-b border-gray-200 border-b-gray-200!'><span className={`px-2 py-1 text-white text-xs rounded-full ${statusBadge[badge]}`}>{badge === "good" ? "Tốt" : badge === "warning" ? "Có thể nhập" : badge === "low" ? "Gần hết" : "Hết"}</span></td>
                          <td className="w-40 p-3 border-b border-gray-200 border-b-gray-200!">
                            <div className="flex flex-col gap-1">
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-2 bg-linear-to-r from-blue-400 to-blue-600" style={{ width: `${percent}%` }}></div>
                              </div>
                              <p className="text-gray-500 text-xs">Còn {ingredient.stock_quantity} / Ngưỡng {ingredient.min_stock_level}</p>
                            </div>
                          </td>
                          <td className="flex gap-2">
                            <Tooltip title="Update">
                              <IconButton onClick={() => { setEditIngredient(ingredient); setOpenUpdate(true); }}>
                                <FaPencil size={20} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => handleDelete(ingredient.ingredient_id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className='text-center'>
                      <td>Không có dữ liệu</td>
                    </tr>
                  )
                }
              </tbody>
            </table>

            {/* Form edit ingredient */}
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
                        <div className="fromUpdate-button-right">
                          <Button variant='contained' color='primary' onClick={handleUpdateIngredient}>Cập nhật</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Dialog>
            <div className="pagination-ingredient-input flex justify-center pt-3">
              <Pagination count={totalPages} page={page} onChange={handlePageChange} variant="outlined" color="primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryOverview;
