import React, { useEffect, useState } from 'react';
import { BsChatRightText } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import Tooltip from '@mui/material/Tooltip';
import { MdAccessTime } from "react-icons/md";
import Rating from '@mui/material/Rating';
import AdminFeedback from './AdminFeedback';
import UserFeedback from './UserFeedback';
import Feedback from './Feedback';
import axios from "axios";

const endPoint = 'http://localhost:8000/api';

const BoxReview = ({ reviews, userId }) => {

    // console.log("User id" + userId);

    const [loading, setLoading] = useState(true);

    // State để mở/tắt feedback per review
    const [openFeedbackIds, setOpenFeedbackIds] = useState([]);
    const [openReplyIds, setOpenReplyIds] = useState([]);

    const [repliesByReview, setRepliesByReview] = useState({});

    // State likes/dislikes riêng cho từng review
    const [likesState, setLikesState] = useState({});
    const [dislikesState, setDislikesState] = useState({});


    // Fetch api reply review
    useEffect(() => {
        const fetchAllReplies = async () => {
            const data = {};
            for (const review of reviews) {
                const res = await axios.get(`${endPoint}/reviews/${review.review_id}/reply`);
                data[review.review_id] = res.data.reply;
            }
            setRepliesByReview(data);
        };
        if (reviews?.length) fetchAllReplies();
    }, [reviews]);


    useEffect(() => {
        if (reviews?.length) {
            const initialLikes = {};
            const initialDislikes = {};
            reviews.forEach(r => {
                initialLikes[r.review_id] = r.like || 0;
                initialDislikes[r.review_id] = r.dislike || 0;
            });
            setLikesState(initialLikes);
            setDislikesState(initialDislikes);
        }
        setLoading(false);
    }, [reviews]);

    const handleToggleFeedback = (id) => {
        setOpenFeedbackIds(prev =>
            prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
        );
    };

    const handleToggleReply = (id) => {
        setOpenReplyIds(prev =>
            prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
        );
    };

    const handleLike = (id) => {
        setLikesState(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const handleDislike = (id) => {
        setDislikesState(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };


    if (loading) return <p>Loading reviews...</p>;
    if (reviews.length === 0) return <p>Chưa có đánh giá nào</p>;

    return (
        <div className="space-y-4">
            {reviews.map(review => {
                const isOpenFeedback = openFeedbackIds.includes(review.review_id);
                const isOpenReply = openReplyIds.includes(review.review_id);
                return (
                    <div key={review.review_id} className="boxReview-comment flex border-b border-gray-300 mt-2">
                        <div className="w-[15%] flex items-start mb-2 me-3 gap-1">
                            <div className="w-10 h-10 flex items-center justify-center text-white text-2xl font-bold bg-blue-700 rounded-full">
                                {review.user?.full_name?.[0] || 'A'}
                            </div>
                            <div className="mt-2">
                                <div className="font-bold text-lg">{review.user?.full_name || "User"}</div>
                            </div>
                        </div>
                        <div className="w-[85%]">
                            <div className="flex items-center mb-1 gap-1.5">
                                <Rating value={review.rating} readOnly />
                                <span className="ml-2 text-gray-700">{review.rating >= 4 ? "Tuyệt vời" : "Bình thường"}</span>
                                <div className="flex items-center ml-4 text-gray-500 text-sm">
                                    <MdAccessTime className="mr-1" />
                                    <span>{new Date(review.created_at).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mb-2 text-justify">{review.comment}</div>

                            {review.image_url && (
                                <div className="mb-2">
                                    <img
                                        src={`${review.image_url}`}
                                        alt="review"
                                        className="w-48 h-24 object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center space-x-4 mb-2 gap-1.5">
                                <Tooltip title="Like">
                                    <div className="flex items-center cursor-pointer" onClick={() => handleLike(review.review_id)}>
                                        <AiOutlineLike size={20} className="mr-1" />
                                        <span>{likesState[review.review_id]}</span>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Dislike">
                                    <div className="flex items-center cursor-pointer" onClick={() => handleDislike(review.review_id)}>
                                        <AiOutlineDislike size={20} className="mr-1" />
                                        <span>{dislikesState[review.review_id]}</span>
                                    </div>
                                </Tooltip>
                                <div className="flex items-center text-red-600 cursor-pointer" onClick={() => handleToggleReply(review.review_id)}>
                                    <BsChatRightText className="mr-1" /> Phản hồi
                                </div>
                            </div>

                            <div className="flex items-center cursor-pointer text-blue-600 mb-2" onClick={() => handleToggleFeedback(review.review_id)}>
                                {isOpenFeedback ? "Thu gọn phản hồi" : "Xem tất cả phản hồi"}
                                <IoIosArrowDown className={`ml-1 transition-transform duration-200 ${isOpenFeedback ? 'rotate-180' : ''}`} />
                            </div>

                            {isOpenFeedback && (
                                <div className="ml-4 border-l-2 border-gray-300 pl-2">
                                    {(repliesByReview[review.review_id] || []).map(reply => {
                                        if (reply.user?.role === 'admin') {
                                            return <AdminFeedback key={reply.reply_id} reply={reply} userId={userId} />;
                                        } else if (reply.user) {
                                            return <UserFeedback key={reply.reply_id} reply={reply} userId={userId} />;
                                        } else {
                                            return null;
                                        }
                                    })
                                    }
                                </div>
                            )}

                            {isOpenReply && (
                                <Feedback
                                    reviewId={review.review_id}
                                    userId={userId}
                                    onSuccess={(newReply) => {
                                        setRepliesByReview(prev => {
                                            const reviewId = newReply.review_id;
                                            const prevReplies = prev[reviewId] || [];
                                            return {
                                                ...prev,
                                                [reviewId]: [...prevReplies, newReply]
                                            };
                                        });
                                    }}

                                />
                            )}

                        </div>

                    </div>
                );
            })}
        </div>
    );
};

export default BoxReview;
