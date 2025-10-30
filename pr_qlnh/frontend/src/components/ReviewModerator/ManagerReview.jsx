import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Pagination from '@mui/material/Pagination';

import { CiImageOff } from "react-icons/ci";
const ManagerReview = () => {
    
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
                            <tr className='hover:bg-gray-300 transition cursor-pointer'>
                                <td className='px-4 py-2 text-center border-b'>1</td>
                                <td className='px-4 py-2 text-center border-b'>An</td>
                                <td className='px-4 py-2 text-center border-b'>Phở bò</td>
                                <td className='px-4 py-2 text-center border-b'>5</td>
                                <td className='px-4 py-2 text-center border-b flex justify-center'><CiImageOff size={30}/></td>
                                <td className='px-4 py-2 text-center border-b'>Tuyet voi</td>
                                <td className='px-4 py-2 text-center border-b'>2025:10:10</td>
                                <td className='px-4 py-2 text-center border-b'>100</td>
                                <td className='px-4 py-2 text-center border-b'>0</td>
                                <td className='px-4 py-2 text-center border-b'>Pending</td>
                                <td className='text-center border-b'>
                                    <Tooltip title="Approve">
                                        <IconButton>
                                            <CheckCircleOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                    
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

export default ManagerReview