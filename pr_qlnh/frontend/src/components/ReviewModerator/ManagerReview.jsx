import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Pagination from '@mui/material/Pagination';

import { CiImageOff } from "react-icons/ci";
const ManagerReview = ({ allReview, loading }) => {
    // const [loading, setLoading] = useState(false);

    // setLoading(true);

    return (
        <>
            <div className="reviewModerator-table pt-2">
                <div className="reviewModerator-table-box overflow-x-auto">
                    <table className='min-w-full border border-gray-300'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='px-4 py-2 text-center border-b'>Mã</th>
                                <th className='px-4 py-2 text-center border-b'>Tên</th>
                                <th className='px-4 py-2 text-center border-b'>Món ăn</th>
                                <th className='px-4 py-2 text-center border-b'>Sao</th>
                                <th className='px-4 py-2 text-center border-b'>Hình</th>
                                <th className='px-4 py-2 text-center border-b'>Nội dung</th>
                                <th className='px-4 py-2 text-center border-b'>Thời gian</th>
                                <th className='px-4 py-2 text-center border-b'>Like</th>
                                <th className='px-4 py-2 text-center border-b'>Dislike</th>
                                <th className='px-4 py-2 text-center border-b'>Status</th>
                                <th className='px-4 py-2 text-center border-b'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-4">Đang tải...</td>
                                </tr>
                            ) : allReview.length > 0 ? (
                                allReview.map((review) => (
                                    <tr key={review.review_id} className='hover:bg-gray-300 transition cursor-pointer'>
                                        <td className='text-[11px] text-center border-b'>{review.review_id}</td>
                                        <td className='text-[11px] text-center border-b'>{review.user?.full_name}</td>
                                        <td className='text-[11px] text-center border-b'>{review.menu_item?.menu_item_name}</td>
                                        <td className='text-[11px] text-center border-b'>{review.rating}</td>
                                        <td className='text-[11px] text-center border-b flex justify-center'>
                                            {review.image_url ? <img src={review.image_url} alt="" className="w-10 h-10 object-cover" /> : <CiImageOff size={30} />}
                                        </td>
                                        <td className='text-[11px] text-center border-b'>{review.comment}</td>
                                        <td className='text-[11px] text-center border-b'>{new Date(review.created_at).toLocaleString()}</td>
                                        <td className='text-[11px] text-center border-b'>{review.like || 0}</td>
                                        <td className='text-[11px] text-center border-b'>{review.dislike || 0}</td>
                                        <td className='text-[11px] text-center border-b'>{review.status}</td>
                                        <td className='text-[11px] text-center border-b'>
                                            <Tooltip title="Approve">
                                                <IconButton><CheckCircleOutlineIcon size={20}/></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Hide">
                                                <IconButton><VisibilityOffOutlinedIcon /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton><DeleteIcon /></IconButton>
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
                    <Pagination count={5} variant="outlined" color='primary' />
                </div>
            </div>
        </>
    )
}

export default ManagerReview