import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { IoClose } from "react-icons/io5";
import Star from './Star';
import { FaStar } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import { BsChatRightText } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";

const Review = () => {
    const [showFeedback, setShowFeedback] = useState(false); //close or hide feedback
    const [activeFilter, setActiveFilter] = useState(1);
    const [openFormReview, setOpenFormReview] = useState(false);
    const [likes, setLikes] = useState(0);
    const [disLikes, setDisLikes] = useState(0);
    const [values, setValues] = useState(null);

    const handToggle = () => {
        setShowFeedback(!showFeedback);
    }

    const filters = [
        { id: 1, label: "Tất cả" },
        { id: 2, label: "5 sao" },
        { id: 3, label: "4 sao" },
        { id: 4, label: "3 sao" },
        { id: 5, label: "2 sao" },
        { id: 6, label: "1 sao" },
    ];

    const handleClickOpen = () => {
        setOpenFormReview(true);
    }
    const handleClose = () => {
        setOpenFormReview(false);
    }

    const handleLike = () => {
        setLikes(likes + 1)
    }

    const handleDisLike = () => {
        setDisLikes(disLikes + 1)
    }



    return (
        <>
            <div className="container-review w-[80%] h-auto m-auto border border-[#333] p-2 bg-gray-100 rounded-[10px]">
                <div className="headReview">
                    <h2>Đánh giá món ăn</h2>
                </div>
                <div className="boxReview w-full h-[200px] bg-white p-3 flex rounded-[8px]">
                    <div className="boxReview-overview w-[250px]">
                        <div className="boxReview-score">
                            <div className="rating text-4xl"><span className="average-rating text-6xl">4.8</span>/5</div>
                            <div className="item-star">
                                <Star />
                            </div>
                            <div className="count-review py-1 ">100 lượt đánh giá</div>
                            <Button variant="contained" color='error' onClick={handleClickOpen}>Viết đánh giá</Button>
                            <Dialog open={openFormReview} onClose={handleClose}>
                                <div className="container p-3 m-3 max-w-xl w-full mx-auto">
                                    <div className="absolute top-1 right-1 !p-3 !rounded-full !me-auto hover:bg-gray-300 !w-[40px] cursor-pointer" onClick={handleClose}><IoClose /></div>
                                    <h2 className='text-5xl font-bold pt-5'>Đánh giá về chúng tôi</h2>
                                    <div className="formReview-info flex items-center">
                                        <div className="formReview-info-avatar">
                                            <Avatar />
                                        </div>
                                        <div className="formReview-info-name">
                                            <p className='mx-3 m-0'>User 1</p>
                                        </div>
                                    </div>
                                    <div className="formReview-select-rating py-2">
                                        <Rating name="no-value" value={values} size='large' onChange={(event, newValue) => { setValues(newValue) }} />
                                    </div>
                                    <div className="formReview-upload">
                                        <div className="formReview-upload-title">
                                            <span>Upload hinh anh</span>
                                        </div>
                                        <input type="file" />
                                    </div>
                                    <div className="formReview-comment">
                                        <div className="formReview-comment-title">
                                            <span>Nhap danh gia cua ban</span>
                                        </div>
                                        <div className="formReview-comment-content">
                                            <textarea className='w-[500px] h-[200px] border border[#333] focus:ring-0 focus:outline-none resize-none p-2' name="comment" id="comment" placeholder='Nhap danh gia cua ban ve chung toi'></textarea>
                                        </div>
                                    </div>
                                    <Button variant='contained' color='error'>Gui</Button>
                                </div>
                            </Dialog>
                        </div>
                    </div>
                    <div className="boxReview-star w-[500px] space-y-2 mt-3">
                        <div className="rating-level flex items-center gap-2">
                            <div className="number-star flex items-center w-8">
                                <span>5</span>
                                <FaStar className="text-yellow-400 ml-1" />
                            </div>
                            <progress max={100} value={85} className='custom-progress w-[250px] h-[10px] appearance-none'></progress>
                            <span className="text-sm text-gray-600 ml-2">85 đánh giá</span>
                        </div>
                        <div className="rating-level flex items-center gap-2">
                            <div className="number-star flex items-center w-8">
                                <span>4</span>
                                <FaStar className="text-yellow-400 ml-1" />
                            </div>
                            <progress max={100} value={10} className='custom-progress w-[250px] h-[10px] appearance-none'></progress>
                            <span className="text-sm text-gray-600 ml-2">10 đánh giá</span>
                        </div>
                        <div className="rating-level flex items-center gap-2">
                            <div className="number-star flex items-center w-8">
                                <span>3</span>
                                <FaStar className="text-yellow-400 ml-1" />
                            </div>
                            <progress max={100} value={0} className='custom-progress w-[250px] h-[10px] appearance-none'></progress>
                            <span className="text-sm text-gray-600 ml-2">0 đánh giá</span>
                        </div>
                        <div className="rating-level flex items-center gap-2">
                            <div className="number-star flex items-center w-8">
                                <span>2</span>
                                <FaStar className="text-yellow-400 ml-1" />
                            </div>
                            <progress max={100} value={0} className='custom-progress w-[250px] h-[10px] appearance-none'></progress>
                            <span className="text-sm text-gray-600 ml-2">0 đánh giá</span>
                        </div>
                        <div className="rating-level flex items-center gap-2">
                            <div className="number-star flex items-center w-8">
                                <span>1</span>
                                <FaStar className="text-yellow-400 ml-1" />
                            </div>
                            <progress max={100} value={5} className='custom-progress w-[250px] h-[10px] appearance-none'></progress>
                            <span className="text-sm text-gray-600 ml-2">5 đánh giá</span>
                        </div>
                    </div>

                </div>

                <div className='w-full h-auto bg-white p-3 my-2 rounded-[8px]' >
                    <div className="boxReview-filter flex items-center mb-3">
                        <div className="title">Lọc đánh giá</div>
                        <div className="container-filter flex items-center">
                            {
                                filters.map((filter) => (
                                    <div key={filters.id} className={`filter-item py-1 px-2 rounded-2xl border border[#333] mx-2 cursor-pointer
                                    ${activeFilter === filter.id ? "bg-blue-100 text-blue-600" : 'bg-gray-100 text-black'}`}
                                        onClick={() => setActiveFilter(filter.id)}>
                                        {filter.label}
                                    </div>
                                ))
                            }
                        </div>
                    </div>

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

                                <div className="comment-feedback w-[90px] flex items-center text-red-600 cursor-pointer my-2 ms-2">
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

                    <hr />

                    <div className="boxReview-comment flex mb-1 p-1">
                        <div className="boxReview-comment-titel w-[300px] flex items-start">
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
                        </div>
                    </div>

                    <hr />

                    <div className="boxReview-comment flex mb-1 p-1">
                        <div className="boxReview-comment-titel w-[300px] flex items-start">
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
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button variant='contained'>Xem tất cả đánh giá <FaChevronRight /> </Button>
                    </div>



                </div>
            </div>
        </>
    )
}

export default Review