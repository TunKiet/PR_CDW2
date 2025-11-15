import React, { useEffect, useState } from 'react'
import { BsChatRightText } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import Tooltip from '@mui/material/Tooltip';
import { MdAccessTime } from "react-icons/md";
import Feedback from './Feedback';
import AdminFeedback from './AdminFeedback';
import UserFeedback from './UserFeedback';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import NoReview from '../../assets/icon/no-review.svg';
import axios from "axios";

const endPoint = 'http://127.0.0.1:8000/api';

const BoxReview = () => {
    const menuItemId = 1;

    const [likes, setLikes] = useState(0);
    const [disLikes, setDisLikes] = useState(0);
    // const [showReply, setShowReply] = useState(false);
    // const [showFeedback, setShowFeedback] = useState(false); //close or hide feedback

    //set review
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeReplyId, setActiveReplyId] = useState(null);

    const handleToggleReply = (reviewId) => {
        // nếu đang mở review này → đóng lại, nếu khác → mở review đó
        setActiveReplyId(activeReplyId === reviewId ? null : reviewId);
    };

    // 👉 ID của review đang mở phản hồi
    const [activeFeedbackId, setActiveFeedbackId] = useState(null);

    // 👉 Toggle mở/đóng phản hồi của 1 review
    const handleToggleFeedback = (reviewId) => {
        setActiveFeedbackId((prev) => (prev === reviewId ? null : reviewId));
    };

    const handleLike = () => {
        setLikes(likes + 1)
    }

    const handleDisLike = () => {
        setDisLikes(disLikes + 1)
    }

    // const handleOpenReply = () => {
    //     setShowReply(!showReply);
    // }

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axios.get(`${endPoint}/reviews/${menuItemId}`);

                console.log(res.data.data);
                setReviews(res.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [menuItemId]);

    if (loading) return (

        <Box sx={{ p: 2, bgcolor: 'none', width: '100%', height: 'auto' }}>
            <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={1} sx={{ flex: '0 0 auto', alignItems: 'flex-start', minWidth: '150px' }}>
                    <Skeleton variant="circular" width={50} height={50} sx={{ flexShrink: 0 }} />
                    <Box sx={{ mt: 2 }}>
                        <Skeleton variant="text" width={80} sx={{ fontSize: "1rem", transform: 'none' }} />
                    </Box>
                </Stack>

                <Stack spacing={2} sx={{ flexGrow: 1, minWidth: '0' }}>
                    <Skeleton variant="text" width="40%" sx={{ fontSize: "0.7rem", transform: 'none' }} />
                    <Skeleton variant="rectangular" width="20%" height={80} />
                    <Skeleton variant="text" width="50%" sx={{ fontSize: "0.7rem", transform: 'none' }} />
                    <Skeleton variant="text" width="80%" sx={{ fontSize: "0.7rem", transform: 'none' }} />
                    <Skeleton variant="text" width="70%" sx={{ fontSize: "0.7rem", transform: 'none' }} />
                </Stack>
            </Stack>
        </Box>

    )
    if (reviews.length === 0) return (
        <div className="flex flex-col items-center justify-center text-center min-h-[200px]">
            <img src={NoReview} alt="No Review" className="w-32" />
            <p className="mt-2 text-gray-600">Hiện chưa có đánh giá nào.</p>
        </div>
    )
    return (
        <>
            {
                reviews.map((review) => {
                    const isOpenFeedback = activeFeedbackId === review.review_id;
                    return (
                        <div>
                            <div key={review.review_id} className="boxReview-comment flex mb-1 p-1">
                                <div className="boxReview-comment-titel w-[200px] flex items-start mb-2">
                                    <div className="flex">
                                        <p className='w-10 h-10 flex items-center justify-center text-white text-2xl font-bold bg-blue-700 rounded-full m-0'>A</p>
                                    </div>
                                    <div className="block-infor flex ms-2 mt-1">
                                        <div className="block-infor-name">
                                            <span className='font-bold text-2xl'>{review.user.username}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="boxReview-comment-item">
                                    <div className="comment-item-rating flex items-center">
                                        <div className="star flex text-2xl py-1">
                                            <Rating name="simple-controlled" value={review.rating} readOnly />
                                        </div>
                                        <span className='ms-2'>Tuyệt vời</span>
                                        <div className="comment-item-time flex items-center ms-2 text-gray-500">
                                            <MdAccessTime className='me-1' />
                                            <span>{new Date(review.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="comment-item-review">
                                        <div className="comment-content text-justify">{review.comment}</div>
                                    </div>
                                    {
                                        review.image_url && (
                                            <div className="comment-item-view-image my-3">
                                                <div className="view-image-item w-[200px] h-[100px]">
                                                    <img src={`http://localhost:8000/storage/${review.image_url}`} alt="" />
                                                </div>
                                            </div>
                                        )
                                    }

                                    <div className="comment-control flex items-center">
                                        <div className="comment-control-like flex items-center me-2 cursor-pointer">
                                            <Tooltip title="Like">
                                                <div className="rounded-full p-2 hover:bg-gray-300" onClick={handleLike}><AiOutlineLike size={20} /></div>
                                            </Tooltip>
                                            <span className='text-[18px]'>{review.like}</span>
                                        </div>
                                        <div className="comment-control-dislike flex items-center me-2 cursor-pointer">
                                            <Tooltip title="Dislike">
                                                <div className="rounded-full p-2 hover:bg-gray-300" onClick={handleDisLike}><AiOutlineDislike size={20} /></div>
                                            </Tooltip>
                                            <span className='text-[18px]'>{review.dislike}</span>
                                        </div>

                                        <div className="comment-feedback w-[90px] flex items-center text-red-600 cursor-pointer my-2 ms-2" onClick={() => handleToggleReply(review.review_id)}>
                                            <BsChatRightText />
                                            <p className='ms-2 m-0'>Phản hồi</p>
                                        </div>
                                    </div>
                                    <div className="comment-view-feedback w-[180px] flex items-center hover:text-blue-500 cursor-pointer my-2" onClick={() => handleToggleFeedback(review.review_id)}>
                                        {isOpenFeedback ? "Thu gọn phản hồi" : "Xem tất cả 1 phản hồi"}
                                        <IoIosArrowDown className={`ml-1 transition-transform duration-200 ${isOpenFeedback ? 'rotate-180' : ''}`} />
                                    </div>
                                    {
                                        isOpenFeedback &&
                                        (
                                            <div className="list-rep-comment my-4">

                                                <AdminFeedback />
                                                <hr />

                                                <UserFeedback />

                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            {/* <ReplyReview/> */}
                            {activeReplyId === review.review_id && (
                                <div className="mt-2">
                                    <Feedback />
                                    <hr />
                                </div>
                            )}
                            <hr />
                        </div>
                    )
                })
            }
        </>
    )
}

export default BoxReview