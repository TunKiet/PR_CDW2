import React, { useState, useRef, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';

const IngredientInOut = () => {
  const rows = Array.from({ length: 100 }, (_, i) => i + 1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [clickSearch, setClickSearch] = useState(false);
  const inputRef = useRef(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleSearch = () => setClickSearch((prev) => !prev);

  // Khi ô input xuất hiện thì tự động focus
  useEffect(() => {
    if (clickSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [clickSearch]);

  return (
    <div className="ingredient-Input">
      <div className="ingredient-Input-head flex items-center">
        <div className="head-title">
          <h4>Nguyên liệu nhập hàng</h4>
        </div>

        <div className="ingredient-Input-tool flex ms-auto items-center">
          <div className="flex p-2 me-3 items-center">
            <Tooltip title="Print">
              <IconButton onClick={handleClick}>
                <PrintIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleClose}>Xuất PDF</MenuItem>
              <MenuItem onClick={handleClose}>Xuất Excel</MenuItem>
            </Menu>

            {/* Nút Search + ô input */}
            <div className="flex items-center ms-3">
              <Tooltip title="Search">
                <IconButton onClick={toggleSearch}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>


            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ingredient-Input-table w-full h-full flex flex-col">
        <div className="table-data flex-1 border border-gray-300 overflow-hidden bg-white">
          <div className="border border-gray-300 max-h-[65vh] overflow-y-auto">
            <table className="min-w-full border-collapse table-fixed">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-center border-b">STT</th>
                  <th className="px-4 py-2 text-center border-b">Tên NL</th>
                  <th className="px-4 py-2 text-center border-b">Danh mục</th>
                  <th className="px-4 py-2 text-center border-b">Số lượng</th>
                  <th className="px-4 py-2 text-center border-b">Đơn vị</th>
                  <th className="px-4 py-2 text-center border-b">Giá</th>
                  <th className="px-4 py-2 text-center border-b">Tổng tiền</th>
                  <th className="px-4 py-2 text-center border-b">Ngày nhập</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2 text-center">{i}</td>
                    <td className="px-4 py-2 text-center">Gà</td>
                    <td className="px-4 py-2 text-center">Thịt</td>
                    <td className="px-4 py-2 text-center">10000</td>
                    <td className="px-4 py-2 text-center">Con</td>
                    <td className="px-4 py-2 text-center">120.000 VND</td>
                    <td className="px-4 py-2 text-center">12.000.000.000 VND</td>
                    <td className="px-4 py-2 text-center">20/10/2025 09:00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-end items-center text-[18px] text-red-500 m-2 font-semibold">
          <span>Thành tiền: 12.000.000.000.000 VND</span>
        </div>
      </div>
    </div>
  );
};

export default IngredientInOut;
