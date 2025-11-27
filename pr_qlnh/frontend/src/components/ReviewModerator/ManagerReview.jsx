import React, { useEffect, useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import { notify, confirmAction } from '../../utils/notify'
import { CiImageOff } from "react-icons/ci";
import axios from 'axios';

const endPoint = 'http://localhost:8000/api';


const ManagerReview = () => {
    const [loadingTable, setLoadingTable] = useState(false);
    const [allReview, setAllReview] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);


    //Get all review

    const fetchAllReview = async () => {
        setLoadingTable(true);
        try {
            const res = await axios.get(`${endPoint}/reviews/all-review?page=${page}`);
            setAllReview(res.data.data);
            setLastPage(res.data.last_page);
            setPage(res.data.current_page);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchAllReview();
    }, [page]);

    const handleDelete = async (reviewId) => {
        const isConfirmed = await confirmAction('Xóa đánh giá?');
        if (!isConfirmed) return;

        try {
            notify.info('Đang xóa...');

            await axios.delete(`${endPoint}/reviews/${reviewId}/delete`);

            notify.dismiss();
            notify.success('Xóa thành công');
            fetchAllReview();
        } catch (error) {
            notify.dismiss();
            console.log(error);
            notify.error('Xóa không hợp lệ. Vui lòng tải lại trang!');
        }
    }

    const handleHide = async (reviewId) => {
        const isConfirmed = await confirmAction('Xác nhận ẩn đánh giá?');
        if (!isConfirmed) return;

        try {
            notify.info('Đang xử lý...');
            notify.dismiss();
            await axios.patch(`${endPoint}/reviews/${reviewId}/hide`);

            notify.success('Đánh giá đã được ẩn');
            fetchAllReview();

        } catch (error) {
            notify.dismiss();
            console.log(error);
            notify.error('Ẩn đánh giá thất bại')
        }
    }

    const hanldApproved = async (reviewId) => {
        const isConfirmed = await confirmAction('Duyệt đánh giá?');
        if (!isConfirmed) return;

        try {
            notify.info('Đang xử lý...');
            notify.dismiss();

            await axios.patch(`${endPoint}/reviews/${reviewId}/approve`);
            notify.success('Duyệt đánh giá thành công');
            fetchAllReview();
        } catch (error) {
            notify.dismiss();
            console.log(error);
            notify.error('Duyệt đánh giá thất bại')
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
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Tên</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Món ăn</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Sao</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Hình</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Nội dung</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Thời gian</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Like</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Dislike</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Status</th>
                                <th className='text-[15px] px-3 py-2 text-center border-b'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingTable ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-4"><CircularProgress /></td>
                                </tr>
                            ) : allReview.length > 0 ? (
                                allReview.map((review) => (
                                    <tr key={review.review_id} className='hover:bg-gray-300 transition cursor-pointer'>
                                        <td className='text-[13px] text-center border-b'>{review.review_id}</td>
                                        <td className='text-[13px] text-center border-b'>{review.user?.full_name}</td>
                                        <td className='text-[13px] text-center border-b'>{review.menu_item?.menu_item_name}</td>
                                        <td className='text-[13px] text-center border-b'>{review.rating} ⭐</td>
                                        <td className='text-[13px] text-center border-b flex justify-center'>
                                            <img src={review.image_url} alt="" className="w-10 h-10 object-cover" />
                                        </td>
                                        <td className='text-[13px] text-start border-b'>
                                            {review.comment.split(" ").slice(0, 8).join(" ")}
                                            {review.comment.split(" ").length > 8 ? "..." : ""}
                                        </td>
                                        <td className='text-[13px] text-center border-b'>{new Date(review.created_at).toLocaleDateString()}</td>
                                        <td className='text-[13px] text-center border-b'>{review.like || 0}</td>
                                        <td className='text-[13px] text-center border-b'>{review.dislike || 0}</td>
                                        <td className='text-[13px] text-center border-b'>{review.status}</td>
                                        <td className='text-[13px] text-center border-b'>
                                            <Tooltip title="Approve">
                                                <IconButton onClick={() => hanldApproved(review.review_id)}><CheckCircleOutlineIcon size={20} /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Hide">
                                                <IconButton onClick={() => handleHide(review.review_id)}><VisibilityOffOutlinedIcon /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDelete(review.review_id)}><DeleteIcon /></IconButton>
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
                <div className="reviewModerator-pagination flex justify-center py-3">
                    <Pagination
                        count={lastPage}
                        page={page}
                        onChange={(e, newPage) => setPage(newPage)}
                        variant="outlined"
                        color="primary"
                    />
                </div>
            </div>
        </>
    )
}

export default ManagerReview