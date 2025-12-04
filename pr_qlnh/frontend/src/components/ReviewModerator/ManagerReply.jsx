import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Pagination from '@mui/material/Pagination';
import { IoIosSend } from "react-icons/io";
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { notify, confirmAction } from '../../utils/notify'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';

const endPoint = 'http://localhost:8000/api';

const ManagerReply = () => {

    const [loading, setLoading] = useState(false);
    const [allReply, setAllReply] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchAllReply = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${endPoint}/reply/chart?page=${page}`);
            setAllReply(res.data.data);
            setLastPage(res.data.last_page);
            setPage(res.data.current_page);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchAllReply();
    }, [page]);

    


    const handleDelete = async (replyId) => {
        const isConfirmed = await confirmAction('Xóa phản hồi?');
        if (!isConfirmed) return;

        try {
            notify.info('Đang xóa...');

            await axios.delete(`${endPoint}/reply/${replyId}/delete`);

            notify.dismiss();
            notify.success('Xóa thành công');
            fetchAllReply();
        } catch (error) {
            notify.dismiss();
            console.log(error);
            notify.error('Xóa không hợp lệ. Vui lòng tải lại trang!');
        }
    }

    const handleHide = async (replyId) => {
        const isConfirmed = await confirmAction('Xác nhận ẩn phản hồi?');
        if (!isConfirmed) return;

        try {
            notify.info('Đang xử lý...');
            notify.dismiss();
            await axios.patch(`${endPoint}/reply/${replyId}/hide`);

            notify.success('Phản hồi đã được ẩn');
            fetchAllReply();

        } catch (error) {
            notify.dismiss();
            console.log(error);
            notify.error('Ẩn phản hồi thất bại')
        }
    }

    const hanldApproved = async (replyId) => {
        const isConfirmed = await confirmAction('Duyệt phản hồi?');
        if (!isConfirmed) return;

        try {
            notify.info('Đang xử lý...');
            notify.dismiss();

            await axios.patch(`${endPoint}/reply/${replyId}/approve`);
            notify.success('Duyệt phản hồi thành công');
            fetchAllReply();
        } catch (error) {
            notify.dismiss();
            console.log(error);
            notify.error('Duyệt phản hồi thất bại')
        }
    }

    return (
        <>
            <div className="reviewModerator-table pt-2">
                <div className="reviewModerator-table-box overflow-x-auto">
                    <table className='min-w-full border border-gray-300'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Mã</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Khách hàng</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Tóm tắt đánh giá</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Nội dung phản hồi</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Thời gian</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Trang thái</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-4"><CircularProgress /></td>
                                </tr>
                            ) : allReply.length > 0 ? (
                                allReply.map((reply) => (
                                    <tr key={reply.reply_id} className='hover:bg-gray-300 transition cursor-pointer'>
                                        <td className='text-[13px] text-center border-b'>{reply.reply_id}</td>
                                        <td className='text-[13px] text-center border-b'>{reply.user.full_name}</td>
                                        <td className='text-[13px] text-start border-b'>
                                            {reply.review_id.comment.split(" ").slice(0, 13).join(" ")}
                                            {reply.review_id.comment.split(" ").length > 13 ? "..." : ""}
                                        </td>
                                        <td className='text-[13px] text-start border-b'>
                                            {reply.reply_text.split(" ").slice(0, 13).join(" ")}
                                            {reply.reply_text.split(" ").length > 13 ? "..." : ""}
                                        </td>
                                        <td className='text-[13px] text-center border-b'>{new Date(reply.created_at).toLocaleDateString()}</td>
                                        <td className='text-[13px] text-center border-b'>{reply.status}</td>
                                        <td className='text-center border-b'>
                                            {/* <Tooltip title="Reply">
                                                <IconButton onClick={() => setOpenReply(true)}>
                                                    <IoIosSend />
                                                </IconButton>
                                            </Tooltip> */}
                                            <Tooltip title="Approve">
                                                <IconButton onClick={() => hanldApproved(reply.reply_id)}><CheckCircleOutlineIcon size={18} /></IconButton>
                                            </Tooltip>

                                            <Tooltip title="Hide">
                                                <IconButton onClick={() => handleHide(reply.reply_id)}>
                                                    <VisibilityOffOutlinedIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDelete(reply.reply_id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={11} className="text-center py-4">Không có đánh giá</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                </div>
                <div className="reviewModerator-pagination flex justify-center">
                    <Pagination count={lastPage}
                        page={page}
                        onChange={(e, newPage) => setPage(newPage)}
                        variant="outlined" color='primary' />
                </div>
            </div>
        </>
    )
}

export default ManagerReply