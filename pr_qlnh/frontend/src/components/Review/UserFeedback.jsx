import React from 'react'
import { MdAccessTime } from "react-icons/md";
const UserFeedback = () => {
    return (
        <>
            <div className="item-rep-comment my-4">
                <div className="box-rep-info flex items-center">
                    <div className="box-info flex items-center">
                        <div className="box-info-avatar">
                            <div className='flex justify-center items-center w-[40px] h-[40px] bg-red-600 rounded-full'>
                                <p className='flex justify-center items-center text-white font-bold text-2xl m-0 p-0'>T</p>
                            </div>
                        </div>

                        <span className="box-info-name flex items-center mx-2 text-2xl font-bold">Trieu</span>
                    </div>
                    <div className="box-time flex items-center text-gray-400 mx-2">
                        <MdAccessTime />
                        <span>1 giờ trước</span>
                    </div>
                </div>
                <div className="box-rep-question">
                    <div className="box-rep-content text-justify ms-5 p-1">
                        Danh gia tuyet voi
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserFeedback