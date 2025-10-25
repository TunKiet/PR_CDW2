import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import RatingInfo from '../Review/RatingInfo'
import { BsChatRightText } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import Tooltip from '@mui/material/Tooltip';
import { MdAccessTime } from "react-icons/md";
import Rating from '@mui/material/Rating';
import AdminFeedback from '../Review/AdminFeedback';
import UserFeedback from '../Review/UserFeedback';
import Feedback from '../Review/Feedback';
import axios from "axios";
import Pagination from '@mui/material/Pagination';

export const ReviewAll = () => {
    const { menuItemId } = useParams();
    // const menuItemId = 1;

    const [menuItem, setMenuItem] = useState(null);

    const [likes, setLikes] = useState(0);
    const [disLikes, setDisLikes] = useState(0);

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

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/reviews/${menuItemId}/all`);
                setReviews(res.data);

                // lấy thông tin món ăn từ review đầu tiên
                if (res.data.length > 0) {
                    setMenuItem(res.data[0].menu_item);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [menuItemId]);

    if (loading) return <p>Loading reviews...</p>
    if (reviews.length === 0) return <p>Chua co danh gia nao</p>

    return (
        <div className="container w-[80%] h-auto bg-gray-100 border border-[#333] rounded-[8px] p-3">
            <div className="allReview">
                <div className="allReview-head">
                    <h2 className="font-bold">Đánh giá về món {menuItem.menu_item_name}</h2>
                </div>

                <div>
                    <div className="block-dish">
                        <div className="block-dish-item flex p-3 bg-white rounded-[8px]">
                            <div className="dish-image w-[200px] h-[120px]">
                                <img
                                    src={`http://localhost:8000/storage/${menuItem.image_url}`}
                                    alt={menuItem.menu_item_name}
                                />
                            </div>
                            <div className="block-dish-info ms-2">
                                <p className="info-name text-2xl m-0">{menuItem.menu_item_name}</p>
                                <div className="info-price text-2xl text-red-600 font-bold">
                                    {menuItem.price} VND
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-3">
                        <RatingInfo />
                    </div>

                    <div className="allReview-list rounded-[8px] bg-white">
                        <div className="allReview-list-item p-3">
                            {reviews.map((review) => {
                                const isOpenFeedback = activeFeedbackId === review.review_id;
                                return (
                                    <div key={review.review_id}>
                                        {/* Review chính */}
                                        <div className="boxReview-comment flex mb-1 p-1">
                                            <div className="boxReview-comment-titel w-[200px] flex items-start mb-2">
                                                <div className="flex">
                                                    <p className="w-[40px] h-[40px] flex items-center justify-center text-white text-2xl font-bold bg-blue-700 rounded-full m-0">
                                                        A
                                                    </p>
                                                </div>
                                                <div className="block-infor flex ms-2 mt-1">
                                                    <div className="block-infor-name">
                                                        <span className="font-bold text-2xl">{review.user.username}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="boxReview-comment-item">
                                                <div className="comment-item-rating flex items-center">
                                                    <div className="star flex text-2xl py-1">
                                                        <Rating name="simple-controlled" value={review.rating} readOnly />
                                                    </div>
                                                    <span className="ms-2">Tuyệt vời</span>
                                                    <div className="comment-item-time flex items-center ms-2 text-gray-500">
                                                        <MdAccessTime className="me-1" />
                                                        <span>{new Date(review.created_at).toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                <div className="comment-item-review">
                                                    <div className="comment-content text-justify">{review.comment}</div>
                                                </div>

                                                {review.image_url && (
                                                    <div className="comment-item-view-image my-3">
                                                        <div className="view-image-item w-[200px] h-[100px]">
                                                            <img
                                                                src={`http://localhost:8000/storage/${review.image_url}`}
                                                                alt="Review"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="comment-control flex items-center">
                                                    <div className="comment-control-like flex items-center me-2 cursor-pointer">
                                                        <Tooltip title="Like">
                                                            <div
                                                                className="rounded-full p-2 hover:bg-gray-300"
                                                                onClick={handleLike}
                                                            >
                                                                <AiOutlineLike size={20} />
                                                            </div>
                                                        </Tooltip>
                                                        <span className="text-[18px]">{review.like}</span>
                                                    </div>

                                                    <div className="comment-control-dislike flex items-center me-2 cursor-pointer">
                                                        <Tooltip title="Dislike">
                                                            <div
                                                                className="rounded-full p-2 hover:bg-gray-300"
                                                                onClick={handleDisLike}
                                                            >
                                                                <AiOutlineDislike size={20} />
                                                            </div>
                                                        </Tooltip>
                                                        <span className="text-[18px]">{review.dislike}</span>
                                                    </div>

                                                    <div
                                                        className="comment-feedback w-[90px] flex items-center text-red-600 cursor-pointer my-2 ms-2"
                                                        onClick={() => handleToggleReply(review.review_id)}
                                                    >
                                                        <BsChatRightText />
                                                        <p className="ms-2 m-0">Phản hồi</p>
                                                    </div>
                                                </div>

                                                <div
                                                    className="comment-view-feedback w-[180px] flex items-center hover:text-blue-500 cursor-pointer my-2"
                                                    onClick={() => handleToggleFeedback(review.review_id)}
                                                >
                                                    {isOpenFeedback ? "Thu gọn phản hồi" : "Xem tất cả 1 phản hồi"}
                                                    <IoIosArrowDown
                                                        className={`ml-1 transition-transform duration-200 ${isOpenFeedback ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </div>

                                                {isOpenFeedback && (
                                                    <div className="list-rep-comment my-4">
                                                        <AdminFeedback />
                                                        <hr />
                                                        <UserFeedback />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Reply */}
                                        {activeReplyId === review.review_id && (
                                            <div className="mt-2">
                                                <Feedback />
                                                <hr />
                                            </div>
                                        )}

                                        <hr />
                                    </div>
                                );
                            })}

                            <div className="reviewModerator-pagination flex justify-center">
                                <Pagination count={5} variant="outlined" color="primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
