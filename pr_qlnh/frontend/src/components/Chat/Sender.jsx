import React, { useState } from 'react';
import { MdMoreVert } from "react-icons/md";
import Dialog from '@mui/material/Dialog';

const Sender = ({ content, time, handleDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const formattedTime = new Date(time).toLocaleTimeString();

    const handleMenuClick = (action) => {
        console.log(`Chọn: ${action}`);
        setShowMenu(false);
    };

    

    return (
        <div className="box-content relative max-w-[75%] bg-blue-200 rounded-md p-2 mb-2 inline-block wrap-break-word self-end">
            <div className="content text-base leading-relaxed">{content}</div>
            <div className="time text-xs text-gray-500 mt-1 text-left">{formattedTime}</div>

            <div
                onClick={() => setShowMenu(!showMenu)}
                className="menu-icon absolute bg-white shadow-md w-6 h-6 -left-8 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer"
            >
                <MdMoreVert />
            </div>

            {showMenu && (
                <div className="absolute -left-30 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-md py-1 w-28 z-10">
                    <div
                        className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleMenuClick('Sửa')}
                    >
                        Sửa
                    </div>
                    <div
                        className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleMenuClick('Xóa')}
                    >
                        Xóa
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sender;
