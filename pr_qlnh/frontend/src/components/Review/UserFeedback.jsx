import React from 'react'
import { MdAccessTime } from "react-icons/md";

const UserFeedback = ({ reply }) => {

    const { user, reply_text, created_at } = reply;

    const avatarText = user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';

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

                        <span className="box-info-name flex items-center mx-2 text-2xl font-bold">{user.full_name}</span>
                    </div>
                    <div className="box-time flex items-center text-gray-400 mx-2">
                        <MdAccessTime />
                        <span>{created_at}</span>
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

export default UserFeedback