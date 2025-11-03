import React, { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Pagination from '@mui/material/Pagination';
import { IoIosSend } from "react-icons/io";
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
const ManagerReply = () => {

    const [openReply, setOpenReply] = useState(false);

    const truncateText = (text, limit = 30) => {
        if (!text) return "";
        if (text.length <= limit) return text;

        let subStr = text.slice(0, limit);
        const lastSpace = subStr.lastIndexOf(' ');
        if (lastSpace > 0) subStr = subStr.slice(0, lastSpace);

        return subStr + '...';
    };

    return (
        <>
            <div className="reviewModerator-table pt-2">
                <div className="reviewModerator-table-box overflow-x-auto">
                    <table className='min-w-full border border-gray-300'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='px-4 py-2 text-center border-b'>Mã phản hồi</th>
                                <th className='px-4 py-2 text-center border-b'>Mã đánh giá</th>
                                <th className='px-4 py-2 text-center border-b'>Khách hàng</th>
                                <th className='px-4 py-2 text-center border-b'>Tóm tắt phản hồi</th>
                                <th className='px-4 py-2 text-center border-b'>Thời gian</th>
                                <th className='px-4 py-2 text-center border-b'>Trang thái</th>
                                <th className='px-4 py-2 text-center border-b'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='hover:bg-gray-300 transition cursor-pointer'>
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>An</td>
                                <td className='px-4 py-2 text-center border-b'>Tuyet voi</td>
                                <td className='px-4 py-2 text-center border-b'>2025:10:10</td>
                                <td className='px-4 py-2 text-center border-b'>Da phan hoi</td>
                                <td className='text-center border-b'>
                                    <Tooltip title="Reply">
                                        <IconButton onClick={() => setOpenReply(true)}>
                                            <IoIosSend />
                                        </IconButton>
                                    </Tooltip>
                                    <Dialog open={openReply} onClose={() => setOpenReply(false)} maxWidth="sm" fullWidth>
                                        <div className="p-3">
                                            <div className="head">
                                                <div className="head-title">
                                                    <h4 className="font-bold text-center">Phản hồi</h4>
                                                </div>
                                            </div>
                                            <div className="reply-body">
                                                <div className="border border-black rounded-lg p-3">
                                                    <div className="reply-title flex gap-1 text-[13px]">
                                                        <div className="dish-name"><span>Bun bo</span></div>|
                                                        <div className="time-rieview"><span>20/10/2025 09:00</span></div>
                                                    </div>
                                                    <div className="reply-info">
                                                        <div className="name-user-review text-2xl font-bold my-1">Nguyen Van A</div>
                                                        <div className="reply-rating">
                                                            <Rating value={5} readOnly />
                                                        </div>
                                                        <div className="reply-image w-[200px] h-[125px]">
                                                            <div className="w-full h-full">
                                                                <img src="https://fit.tdc.edu.vn/assets/images/news/chupchung.jpg" alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="reply-comment">
                                                            <p className='text-[14px] m-0 text-justify text-gray-700 leading-relaxed bg-gray-50'>
                                                                {truncateText('Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore officiis facere nemo exercitationem dolore suscipit provident vero. suscipit provident vero suscipit provident suscipit provident vero vero Corrupti fuga quod adipisci aliquam est facere distinctio iste.', 250)}
                                                                </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="reply-admin">
                                                    <div className="reply-admin-head my-1">
                                                        <span className='font-bold'>Phản hồi của nhà hàng:</span>
                                                    </div>
                                                    <div className="reply-textarea">
                                                        <div className="write-reply">
                                                            <textarea name="" id="" className="w-full h-24 p-2 border border-black rounded-lg resize-none! focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200" placeholder="Nhập phản hồi..." ></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="reply-button flex gap-1 justify-end my-2">
                                                        <div className="button-left">
                                                            <Button variant="outlined" color="outline">Hủy</Button>
                                                        </div>
                                                        <div className="button-right">
                                                            <Button variant="contained" color="primary">Gửi phản hồi</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Dialog>

                                    <Tooltip title="Hide">
                                        <IconButton>
                                            <VisibilityOffOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
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
                <div className="reviewModerator-pagination flex justify-center">
                    <Pagination count={5} variant="outlined" color='primary' />
                </div>
            </div>
        </>
    )
}

export default ManagerReply