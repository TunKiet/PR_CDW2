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
import * as Yup from "yup";
import { useFormik } from "formik";

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

  const onClose = () => setOpenUpdate(false);   // Đóng dialog
  const onSuccess = () => fetchIngredients();


  const DANGEROUS_SPACES = /[\s\u3000\u00A0\u2000-\u200B]/g;
  const REGEX_TEXT = /^[A-Za-zÀ-ỹ0-9 .,()'"-]+$/;
  const REGEX_NUMBER = /^[0-9]+$/;
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  Yup.addMethod(Yup.string, 'noOnlySpaces', function (message) {
    return this.test('no-only-spaces', message, function (value) {
      if (!value) return true; // Để required() xử lý

      const cleaned = value.replace(DANGEROUS_SPACES, '');
      return cleaned.length > 0;
    });
  });


  Yup.addMethod(Yup.string, 'noFullWidthSpace', function (message) {
    return this.test('no-fullwidth-space', message, function (value) {
      if (!value) return true;
      return !value.includes('\u3000');
    });
  });


  Yup.addMethod(Yup.string, 'sanitize', function () {
    return this.transform((value) => {
      if (!value) return value;

      let cleaned = value.replace(/\u3000/g, ' ');

      cleaned = cleaned.trim();

      cleaned = cleaned.replace(/\s+/g, ' ');

      return cleaned;
    });
  });


  const ingredientSchema = Yup.object({
    ingredient_name: Yup.string()
      .sanitize()
      .required("Vui lòng nhập tên nguyên liệu")
      .noOnlySpaces("Tên nguyên liệu không được chỉ chứa khoảng trắng")
      .noFullWidthSpace("Tên nguyên liệu không được chứa khoảng trắng full-width (　)")
      .matches(
        REGEX_TEXT,
        "Tên chỉ được chứa chữ cái, số, dấu cách và các ký tự: . , ( ) ' \" -"
      )
      .min(2, "Tên nguyên liệu phải có ít nhất 2 ký tự")
      .max(255, "Tên nguyên liệu không được vượt quá 255 ký tự"),

    category_ingredient_id: Yup.number()
      .required("Vui lòng chọn danh mục")
      .positive("Danh mục không hợp lệ")
      .integer("Danh mục không hợp lệ")
      .typeError("Vui lòng chọn danh mục"),

    unit: Yup.string()
      .sanitize()
      .required("Vui lòng nhập đơn vị")
      .noOnlySpaces("Đơn vị không được chỉ chứa khoảng trắng")
      .noFullWidthSpace("Đơn vị không được chứa khoảng trắng full-width (　)")
      .matches(
        REGEX_TEXT,
        "Đơn vị chỉ được chứa chữ cái, số và các ký tự: . , ( ) ' \" -"
      )
      .min(1, "Đơn vị phải có ít nhất 1 ký tự")
      .max(50, "Đơn vị không được vượt quá 50 ký tự"),

    price: Yup.number()
      .required("Vui lòng nhập giá")
      .typeError("Giá phải là số")
      .positive("Giá phải lớn hơn 0")
      .integer("Giá phải là số nguyên")
      .min(1, "Giá phải lớn hơn 0")
      .max(999999999, "Giá không được vượt quá 999,999,999"),

    stock_quantity: Yup.number()
      .required("Vui lòng nhập tồn kho")
      .typeError("Tồn kho phải là số")
      .integer("Tồn kho phải là số nguyên")
      .min(0, "Tồn kho phải lớn hơn hoặc bằng 0")
      .max(999999999, "Tồn kho không được vượt quá 999,999,999"),

    min_stock_level: Yup.number()
      .required("Vui lòng nhập ngưỡng cảnh báo")
      .typeError("Ngưỡng cảnh báo phải là số")
      .integer("Ngưỡng cảnh báo phải là số nguyên")
      .min(0, "Ngưỡng cảnh báo phải lớn hơn hoặc bằng 0")
      .max(999999999, "Ngưỡng cảnh báo không được vượt quá 999,999,999")
      .test(
        'is-less-than-stock',
        'Ngưỡng cảnh báo nên nhỏ hơn tồn kho hiện tại',
        function (value) {
          const { stock_quantity } = this.parent;
          if (stock_quantity && value) {
            return value <= stock_quantity;
          }
          return true;
        }
      ),
  });

  //add new ingredient
  const formikAdd = useFormik({
    initialValues: {
      ingredient_name: "",
      category_ingredient_id: "",
      price: "",
      unit: "",
      stock_quantity: "",
      min_stock_level: "",
    },
    validationSchema: ingredientSchema,
    onSubmit: async (values, { setSubmitting }) => {
      notify.info('Đang thêm...');
      try {
        await axios.post("http://localhost:8000/api/add", values);
        notify.dismiss();
        notify.success('Thêm thành công!');
        fetchIngredients();
      } catch (err) {
        notify.dismiss();
        notify.error('Thêm thất bại');
        console.log(err);
      } finally {
        setSubmitting(false);
      }
    },
  });


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

  const updateIngredientSchema = Yup.object({
    ingredient_name: Yup.string()
      .sanitize()
      .required("Vui lòng nhập tên nguyên liệu")
      .noOnlySpaces("Tên nguyên liệu không được chỉ chứa khoảng trắng")
      .noFullWidthSpace("Tên nguyên liệu không được chứa khoảng trắng full-width (　)")
      .matches(
        REGEX_TEXT,
        "Tên chỉ được chứa chữ cái, số, dấu cách và các ký tự: . , ( ) ' \" -"
      )
      .min(2, "Tên nguyên liệu phải có ít nhất 2 ký tự")
      .max(255, "Tên nguyên liệu không được vượt quá 255 ký tự"),

    category_ingredient_id: Yup.number()
      .required("Vui lòng chọn danh mục")
      .positive("Danh mục không hợp lệ")
      .integer("Danh mục không hợp lệ")
      .typeError("Vui lòng chọn danh mục"),

    unit: Yup.string()
      .sanitize()
      .required("Vui lòng nhập đơn vị")
      .noOnlySpaces("Đơn vị không được chỉ chứa khoảng trắng")
      .noFullWidthSpace("Đơn vị không được chứa khoảng trắng full-width (　)")
      .matches(
        REGEX_TEXT,
        "Đơn vị chỉ được chứa chữ cái, số và các ký tự: . , ( ) ' \" -"
      )
      .min(1, "Đơn vị phải có ít nhất 1 ký tự")
      .max(50, "Đơn vị không được vượt quá 50 ký tự"),

    price: Yup.number()
      .required("Vui lòng nhập giá")
      .typeError("Giá phải là số")
      .positive("Giá phải lớn hơn 0")
      .integer("Giá phải là số nguyên")
      .min(1, "Giá phải lớn hơn 0")
      .max(999999999, "Giá không được vượt quá 999,999,999"),

    stock_quantity: Yup.number()
      .required("Vui lòng nhập tồn kho")
      .typeError("Tồn kho phải là số")
      .integer("Tồn kho phải là số nguyên")
      .min(0, "Tồn kho phải lớn hơn hoặc bằng 0")
      .max(999999999, "Tồn kho không được vượt quá 999,999,999"),

    min_stock_level: Yup.number()
      .required("Vui lòng nhập ngưỡng cảnh báo")
      .typeError("Ngưỡng cảnh báo phải là số")
      .integer("Ngưỡng cảnh báo phải là số nguyên")
      .min(0, "Ngưỡng cảnh báo phải lớn hơn hoặc bằng 0")
      .max(999999999, "Ngưỡng cảnh báo không được vượt quá 999,999,999")
      .test(
        'is-less-than-stock',
        'Ngưỡng cảnh báo nên nhỏ hơn hoặc bằng tồn kho hiện tại',
        function (value) {
          const { stock_quantity } = this.parent;
          if (stock_quantity && value) {
            return value <= stock_quantity;
          }
          return true;
        }
      ),
  });

  const formikUpdate = useFormik({
    initialValues: {
      ingredient_name: editIngredient?.ingredient_name || "",
      category_ingredient_id: editIngredient?.category_ingredient_id || "",
      unit: editIngredient?.unit || "",
      price: editIngredient?.price || "",
      stock_quantity: editIngredient?.stock_quantity || "",
      min_stock_level: editIngredient?.min_stock_level || "",
    },
    validationSchema: updateIngredientSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      notify.info("Đang cập nhật...");

      try {
        const payload = {
          ingredient_name: values.ingredient_name,
          category_ingredient_id: values.category_ingredient_id,
          price: values.price,
          unit: values.unit,
          stock_quantity: values.stock_quantity,
          min_stock_level: values.min_stock_level,
          updated_at: editIngredient.updated_at
        };

        const { data } = await axios.put(
          `${endPoint}/ingredients/${editIngredient.ingredient_id}`,
          payload
        );

        notify.dismiss();

        if (data.success) {
          notify.success("Cập nhật nguyên liệu thành công!");
          onSuccess();
          onClose();
        } else {
          notify.error(data.message || "Cập nhật thất bại!");
        }

      } catch (error) {
        notify.dismiss();
        setSubmitting(false);
        if (error.response) {
          const status = error.response.status;
          const serverErrors = error.response.data?.errors;

          switch (status) {
            case 409:
              notify.error("⚠️ Dữ liệu đã thay đổi. Vui lòng tải lại trang!");
              break;

            case 422:
              if (serverErrors) {
                Object.keys(serverErrors).forEach(field => {
                  setFieldError(field, serverErrors[field][0]);
                });
                notify.error("Vui lòng kiểm tra lại thông tin!");
              } else {
                notify.error("Dữ liệu không hợp lệ!");
              }
              break;

            case 404:
              notify.error("Không tìm thấy nguyên liệu!");
              onClose();
              break;

            case 500:
              notify.error("Lỗi server! Vui lòng thử lại sau.");
              break;

            default:
              notify.error(error.response.data?.message || "Cập nhật thất bại!");
          }
        } else if (error.request) {
          notify.error("Không thể kết nối đến server!");
        } else {
          notify.error("Đã xảy ra lỗi!");
        }
      }
    },
  });

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
                <form onSubmit={formikAdd.handleSubmit}>
                  <h3 className='text-center mt-3 border-b border-b-[#e8e8e8]'>Thêm mới nguyên liệu</h3>
                  <div className="formAdd-ingredient">
                    <div className="formAdd-info p-3">

                      <div>
                        <label htmlFor="">Tên nguyên liệu</label>
                        <input className='form-control' type="text" onChange={formikAdd.handleChange} name="ingredient_name" onBlur={formikAdd.handleBlur} value={formikAdd.values.ingredient_name} />
                        {formikAdd.touched.ingredient_name && formikAdd.errors.ingredient_name && (
                          <p className="text-red-500 text-xs">{formikAdd.errors.ingredient_name}</p>
                        )}
                      </div>
                      <div>
                        <label>Danh mục</label>
                        <Select
                          name="category_ingredient_id"
                          value={formikAdd.values.category_ingredient_id}
                          onChange={formikAdd.handleChange}
                          onBlur={formikAdd.handleBlur}
                          className="w-full"
                        >
                          {selectedCategoryId.map((ca) => (
                            <MenuItem key={ca.category_ingredient_id} value={ca.category_ingredient_id}>
                              {ca.category_ingredient_name}
                            </MenuItem>
                          ))}
                        </Select>
                        {formikAdd.touched.category_ingredient_id && formikAdd.errors.category_ingredient_id && (
                          <p className="text-red-500 text-xs">{formikAdd.errors.category_ingredient_id}</p>
                        )}
                      </div>
                      <div>
                        <label>Tồn kho</label>
                        <input
                          className="form-control"
                          type="number"
                          name="stock_quantity"
                          value={formikAdd.values.stock_quantity}
                          onChange={formikAdd.handleChange}
                        />
                        {formikAdd.errors.stock_quantity && formikAdd.touched.stock_quantity && (
                          <p className="text-red-500 text-xs">{formikAdd.errors.stock_quantity}</p>
                        )}
                      </div>
                      <div>
                        <label>Ngưỡng cảnh báo</label>
                        <input
                          className="form-control"
                          type="number"
                          name="min_stock_level"
                          value={formikAdd.values.min_stock_level}
                          onChange={formikAdd.handleChange}
                        />
                        {formikAdd.errors.min_stock_level && formikAdd.touched.min_stock_level && (
                          <p className="text-red-500 text-xs">{formikAdd.errors.min_stock_level}</p>
                        )}
                      </div>
                      <div>
                        <label>Đơn vị</label>
                        <input
                          className="form-control"
                          type="text"
                          name="unit"
                          value={formikAdd.values.unit}
                          onChange={formikAdd.handleChange}
                        />
                        {formikAdd.errors.unit && formikAdd.touched.unit && (
                          <p className="text-red-500 text-xs">{formikAdd.errors.unit}</p>
                        )}
                      </div>
                      <div>
                        <label>Giá</label>
                        <input
                          className="form-control"
                          type="number"
                          name="price"
                          value={formikAdd.values.price}
                          onChange={formikAdd.handleChange}
                        />
                        {formikAdd.errors.price && formikAdd.touched.price && (
                          <p className="text-red-500 text-xs">{formikAdd.errors.price}</p>
                        )}
                      </div>
                      <div className="formAdd-button flex">
                        <div className='flex ms-auto py-3 gap-1.5'>
                          <div className="formAdd-button-right">
                            <Button type='submit' variant='contained' color='primary' disabled={formikAdd.isSubmitting}>{formikAdd.isSubmitting ? "Đang thêm..." : "Thêm"}</Button>
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
              <form onSubmit={formikUpdate.handleSubmit}>
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
                        <input
                          className='form-control'
                          type="text"
                          name="ingredient_name"
                          value={formikUpdate.values.ingredient_name}
                          onChange={formikUpdate.handleChange}
                          onBlur={formikUpdate.handleBlur}
                        />
                        {formikUpdate.touched.ingredient_name && formikUpdate.errors.ingredient_name && (
                          <p className="text-red-500 text-xs">{formikUpdate.errors.ingredient_name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="">Danh mục</label>
                        <Select
                          name="category_ingredient_id"
                          value={formikUpdate.values.category_ingredient_id}
                          onChange={formikUpdate.handleChange}
                          onBlur={formikUpdate.handleBlur}
                          className="w-full"
                          sx={{ "& .MuiSelect-select": { padding: "8px" } }}
                        >
                          {selectedCategoryId.map(ca => (
                            <MenuItem key={ca.category_ingredient_id} value={ca.category_ingredient_id}>
                              {ca.category_ingredient_name}
                            </MenuItem>
                          ))}
                        </Select>
                        {formikUpdate.touched.category_ingredient_id && formikUpdate.errors.category_ingredient_id && (
                          <p className="text-red-500 text-xs">{formikUpdate.errors.category_ingredient_id}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="">Tồn kho</label>
                        <input
                          className='form-control'
                          type="number"
                          name="stock_quantity"
                          value={formikUpdate.values.stock_quantity}
                          onChange={formikUpdate.handleChange}
                          onBlur={formikUpdate.handleBlur}
                        />
                        {formikUpdate.touched.stock_quantity && formikUpdate.errors.stock_quantity && (
                          <p className="text-red-500 text-xs">{formikUpdate.errors.stock_quantity}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="">Ngưỡng cảnh báo</label>
                        <input
                          className='form-control'
                          type="number"
                          name="min_stock_level"
                          value={formikUpdate.values.min_stock_level}
                          onChange={formikUpdate.handleChange}
                          onBlur={formikUpdate.handleBlur}
                        />
                        {formikUpdate.touched.min_stock_level && formikUpdate.errors.min_stock_level && (
                          <p className="text-red-500 text-xs">{formikUpdate.errors.min_stock_level}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="">Đơn vị</label>
                        <input
                          className='form-control'
                          type="text"
                          name="unit"
                          value={formikUpdate.values.unit}
                          onChange={formikUpdate.handleChange}
                          onBlur={formikUpdate.handleBlur}
                        />
                        {formikUpdate.touched.unit && formikUpdate.errors.unit && (
                          <p className="text-red-500 text-xs">{formikUpdate.errors.unit}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="">Giá</label>
                        <input
                          className='form-control'
                          type="number"
                          name="price"
                          value={formikUpdate.values.price}
                          onChange={formikUpdate.handleChange}
                          onBlur={formikUpdate.handleBlur}
                        />
                        {formikUpdate.touched.price && formikUpdate.errors.price && (
                          <p className="text-red-500 text-xs">{formikUpdate.errors.price}</p>
                        )}
                      </div>

                      <div className="fromUpdate-button flex">
                        <div className='flex ms-auto py-3 gap-1.5'>
                          <div className="fromUpdate-button-right">
                            <Button type="submit" variant='contained' color='primary' disabled={formikUpdate.isSubmitting}>
                              {formikUpdate.isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
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
