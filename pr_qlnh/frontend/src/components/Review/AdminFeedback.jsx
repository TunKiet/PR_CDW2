import React from 'react'
import { MdAccessTime } from "react-icons/md";


const AdminFeedback = ({ reply }) => {

    const { user, reply_text, created_at } = reply;

    // Hiển thị chữ cái đầu tiên là AD hoặc tên viết tắt admin
    const avatarText = 'AD';

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };


    return (
        <>
            <div className="item-rep-comment my-4">
                <div className="box-rep-info flex items-center">
                    <div className="box-info flex items-center">
                        <div className="box-info-avatar">
                            <div className='flex justify-center items-center w-10 h-10 bg-red-600 rounded-full'>
                                <p className='flex justify-center items-center text-white font-bold text-2xl m-0 p-0'>{avatarText}</p>
                            </div>
                        </div>
                        <span className="box-info-name flex items-center mx-2 text-2xl font-bold">{user.full_name || 'Quản Trị Viên'}</span>

                        <div className="box-info-tag w-10 h-5 flex justify-center items-center bg-red-600 rounded-[5px]">
                            <p className='text-white font-bold m-0'>QTV</p>
                        </div>
                    </div>
                    <div className="box-time flex items-center text-gray-400 mx-2">
                        <MdAccessTime />
                        <span>{formatDate(created_at)}</span>
                    </div>
                </div>
                <div className="box-rep-question">
                    <div className="box-rep-content text-justify ms-5 p-1">
                        {reply_text}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminFeedback