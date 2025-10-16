import React, { useState } from 'react'
import { BsChatRightText } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import Tooltip from '@mui/material/Tooltip';
import { MdAccessTime } from "react-icons/md";
import Star from './Star';
import Feedback from './Feedback';


const BoxReview = () => {
    const [showFeedback, setShowFeedback] = useState(false); //close or hide feedback
    const [likes, setLikes] = useState(0);
    const [disLikes, setDisLikes] = useState(0);
    const [showReply, setShowReply] = useState(false);

    const handToggle = () => {
        setShowFeedback(!showFeedback);
    }
    const handleLike = () => {
        setLikes(likes + 1)
    }

    const handleDisLike = () => {
        setDisLikes(disLikes + 1)
    }

    const handleOpenReply = () => {
        setShowReply(!showReply);
    }
    return (
        <>
            <div className="boxReview-comment flex mb-1 p-1">
                <div className="boxReview-comment-titel w-[300px] flex items-start mb-2">
                    <div className="flex">
                        <p className='w-[40px] h-[40px] flex items-center justify-center text-white text-2xl font-bold bg-blue-700 rounded-full m-0'>A</p>
                    </div>
                    <div className="block-infor flex ms-2 mt-1">
                        <div className="block-infor-name">
                            <span className='font-bold text-2xl'>An</span>
                        </div>
                    </div>
                </div>
                <div className="boxReview-comment-item">
                    <div className="comment-item-rating flex items-center">
                        <Star />
                        <span className='ms-2'>Tuyệt vời</span>
                    </div>
                    <div className="comment-item-review">
                        <div className="comment-content text-justify">
                            Sản phẩm dùng tốt. Tuy nhiên thái độ nhân viên ở đây không được tốt.
                            Tỏ ra thái độ khi khách hàng không mua gói bảo hiểm 1tr6. Chỉ tập
                            trung tư vấn gói bảo hiểm và ngoài ra k nói gì thêm. Khi khách hàng
                            k mua thì chỉ tập trung làm việc riêng. Không biết các nhân viên khác
                            như nào nhưng hôm đó tôi được bạn Kiều Linh tư vấn. Không có 1 sự tôn
                            trọng khách hàng.
                        </div>
                    </div>
                    <div className="comment-item-time flex items-center my-2">
                        <MdAccessTime />
                        <span>2025-10-30 08:30</span>
                    </div>
                    <div className="comment-control flex items-center">
                        <div className="comment-control-like flex items-center me-2 cursor-pointer">
                            <Tooltip title="Like">
                                <div className="rounded-full p-2 hover:bg-gray-300" onClick={handleLike}><AiOutlineLike size={20} /></div>
                            </Tooltip>
                            <span className='text-[18px]'>{likes}</span>
                        </div>
                        <div className="comment-control-dislike flex items-center me-2 cursor-pointer">
                            <Tooltip title="Dislike">
                                <div className="rounded-full p-2 hover:bg-gray-300" onClick={handleDisLike}><AiOutlineDislike size={20} /></div>
                            </Tooltip>
                            <span className='text-[18px]'>{disLikes}</span>
                        </div>

                        <div className="comment-feedback w-[90px] flex items-center text-red-600 cursor-pointer my-2 ms-2" onClick={handleOpenReply}>
                            <BsChatRightText />
                            <p className='ms-2 m-0'>Phản hồi</p>
                        </div>

                    

                    </div>
                    <div className="comment-view-feedback w-[180px] flex items-center hover:text-blue-500 cursor-pointer my-2" onClick={handToggle}>
                        {showFeedback ? "Thu gọn phản hồi" : "Xem tất cả 1 phản hồi"}
                        <IoIosArrowDown className={`ml-1 transition-transform duration-200 ${showFeedback ? 'rotate-180' : ''}`} />
                    </div>
                    {
                        showFeedback &&
                        (
                            <div className="list-rep-comment my-4">
                                <div className="item-rep-comment my-4">
                                    <div className="box-rep-info flex items-center">
                                        <div className="box-info flex items-center">
                                            <div className="box-info-avatar">
                                                <div className='flex justify-center items-center w-[40px] h-[40px] bg-red-600 rounded-full'>
                                                    <p className='flex justify-center items-center text-white font-bold text-2xl m-0 p-0'>AD</p>
                                                </div>
                                            </div>

                                            <span className="box-info-name flex items-center mx-2 text-2xl font-bold">Quản Trị Viên</span>

                                            <div className="box-info-tag w-[40px] h-[20px] flex justify-center items-center bg-red-600 rounded-[5px]">
                                                <p className='text-white font-bold m-0'>QTV</p>
                                            </div>
                                        </div>
                                        <div className="box-time flex items-center text-gray-400 mx-2">
                                            <MdAccessTime />
                                            <span>1 giờ trước</span>
                                        </div>
                                    </div>
                                    <div className="box-rep-question">
                                        <div className="box-rep-content text-justify ms-5 p-1">
                                            Dạ trường hợp này mình dành chút thời gian mang sản phẩm qua bên em để được kỹ thuật kiểm tra cho mình nhé.
                                            Thân mến.
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div className="item-rep-comment">
                                    <div className="box-rep-info flex items-center">
                                        <div className="box-info flex items-center">
                                            <div className="box-info-avatar">
                                                <div className='flex justify-center items-center w-[40px] h-[40px] bg-red-600 rounded-full'>
                                                    <p className='flex justify-center items-center text-white font-bold text-2xl m-0 p-0'>AD</p>
                                                </div>
                                            </div>

                                            <span className="box-info-name flex items-center mx-2 text-2xl font-bold">Quản Trị Viên</span>

                                            <div className="box-info-tag w-[40px] h-[20px] flex justify-center items-center bg-red-600 rounded-[5px]">
                                                <p className='text-white font-bold m-0'>QTV</p>
                                            </div>
                                        </div>
                                        <div className="box-time flex items-center text-gray-400 mx-2">
                                            <MdAccessTime />
                                            <span>1 giờ trước</span>
                                        </div>
                                    </div>
                                    <div className="box-rep-question">
                                        <div className="box-rep-content text-justify ms-5 p-1">
                                            Dạ trường hợp này mình dành chút thời gian mang sản phẩm qua bên em để được kỹ thuật kiểm tra cho mình nhé.
                                            Thân mến.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            {showReply && (
                <div className="mt-2">
                    <Feedback />
                </div>
            )}
        </>
    )
}

export default BoxReview