import React, { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { IoClose } from "react-icons/io5";
import Star from './Star';
import { FaStar } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import BoxReview from './BoxReview';
import { CiCamera } from "react-icons/ci";
import { notify } from '../../utils/notify'
import axios from "axios";
import { validateImageFile } from "../../utils/validators";

const endPoint = 'http://localhost:8000/api';

const Review = ({ menuItemId }) => {

    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
    const userName = JSON.parse(localStorage.getItem("user"))?.full_name;

    console.log("user id: " + userId);

    const maxLength = 500;


    const [activeFilter, setActiveFilter] = useState(1);
    const [openFormReview, setOpenFormReview] = useState(false);
    // const [values, setValues] = useState(null);

    //get information review
    const [reviews, setReviews] = useState([]);
    const [total, setTotal] = useState(0);
    const [average, setAverage] = useState(0);
    const [ratingCounts, setRatingCounts] = useState({});

    // Process add review
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    //Reply

    const filters = [
        { id: 1, label: "Tất cả" },
        { id: 2, label: "5 sao" },
        { id: 3, label: "4 sao" },
        { id: 4, label: "3 sao" },
        { id: 5, label: "2 sao" },
        { id: 6, label: "1 sao" },
    ];

    //Fetch api review
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${endPoint}/reviews/item/${menuItemId}`);
                setReviews(res.data.reviews);
                setTotal(res.data.total);
                setAverage(res.data.average);
                setRatingCounts(res.data.rating_counts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (menuItemId) fetchReviews();
    }, [menuItemId]);


    const handleClose = () => {
        setOpenFormReview(false);
    }

    //Handle open choose file
    const handleIconClick = () => {
        fileInputRef.current.click();
    }

    //Handle change file
    const handleChangeFile = async (e) => {
        const file = e.target.files[0];

        //Validate trước khi upload
        const errorMsg = validateImageFile(file, 2);
        if (errorMsg) {
            notify.error(errorMsg);
            setPreview(null);
            setImage(null);
            return;
        }

        // Hiển thị preview
        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "image_review");
        formData.append("cloud_name", "dpq6tyosc");

        try {
            notify.info("Đang tải ảnh lên...");

            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dpq6tyosc/image/upload",
                formData
            );

            notify.dismiss();
            notify.success("Tải ảnh thành công!");

            setImage(res.data.secure_url);

        } catch (error) {
            notify.dismiss();
            notify.error("Tải ảnh thất bại");
            console.log("Upload error:", error.response?.data);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxLength) {
            setComment(value);
            setError(""); // xóa lỗi nếu hợp lệ
        } else {
            setError(`Đánh giá không được vượt quá ${maxLength} ký tự`);
        }
    };

    //Handle button submit
    const handleSubmit = async () => {
        if (!rating) {
            notify.error('Vui lòng chọn số sao');
            return;
        }

        if (comment.length > maxLength) {
            setError(`Đánh giá không được vượt quá ${maxLength} ký tự`);
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                `${endPoint}/reviews/add-review`,
                {
                    user_id: userId,
                    menu_item_id: menuItemId,
                    rating,
                    comment,
                    image_url: image
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log(res.data);
            notify.success('Gửi đánh giá thành công');
            handleClose();

        } catch (error) {
            console.log(error.response?.data);
            notify.error('Gửi đánh giá thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container-review w-full h-auto m-auto border border-[#333] p-2 bg-gray-100 rounded-[10px]">
                <div className="headReview">
                    <h2>Đánh giá món ăn</h2>
                </div>
                <div className="boxReview w-full h-[200px] bg-white p-3 flex rounded-lg">
                    <div className="boxReview-overview w-[250px]">
                        <div className="boxReview-score">
                            <div className="rating text-4xl"><span className="average-rating text-6xl">{average}</span>/5</div>
                            <div className="item-star">
                                <Rating readOnly value={average} />
                            </div>
                            <div className="count-review py-1 ">{total} lượt đánh giá</div>
                            <Button variant="contained" color='error' onClick={() => setOpenFormReview(true)}>Viết đánh giá</Button>
                            {/* Form write review for user */}
                            <Dialog open={openFormReview} onClose={handleClose} maxWidth="sm" fullWidth>
                                <div className="container p-3 m-3 max-w-xl w-full mx-auto">
                                    <div className="absolute top-1 right-1 p-3! rounded-full! me-auto! hover:bg-gray-300 w-10! cursor-pointer" onClick={() => setOpenFormReview(false)}><IoClose /></div>
                                    <h2 className='text-5xl font-bold pt-3'>Đánh giá về chúng tôi</h2>
                                    <div className="formReview-info flex items-center">
                                        <div className="formReview-info-avatar">
                                            <Avatar />
                                        </div>
                                        <div className="formReview-info-name">
                                            <p className='mx-3 m-0'>{userName}</p>
                                        </div>
                                    </div>
                                    <div className="formReview-select-rating py-2">
                                        <Rating value={rating} size="large" name="simple-controlled" onChange={(e, newValue) => { setRating(newValue) }}
                                            sx={{
                                                "& .MuiRating-icon": {
                                                    fontSize: 30,
                                                },
                                                color: "#facc15",
                                                "& .MuiRating-iconFilled": {
                                                    color: "#facc15",
                                                },
                                                "& .MuiRating-iconHover": {
                                                    color: "#fbbf24",
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="formReview-upload mb-2">
                                        <div className="formReview-upload-title">
                                            <span>Upload hình ảnh</span>
                                        </div>
                                        <div className="formReview-upload-image flex justify-center items-center w-[200px] h-[100px] border border-[#333] rounded-[5px] cursor-pointer" onClick={handleIconClick}>
                                            {
                                                preview ? (
                                                    <img src={preview} alt="preview" className='w-full h-full object-cover rounded-[5px]' />
                                                ) : (<CiCamera size={50} />)
                                            }
                                            <input type="file" className='hidden' accept='image/*' ref={fileInputRef} onChange={handleChangeFile} />
                                        </div>
                                    </div>
                                    <div className="formReview-comment">
                                        <div className="formReview-comment-title my-2">
                                            <h5>Nhập đánh giá của bạn</h5>
                                        </div>
                                        <div className="formReview-comment-content">
                                            <textarea
                                                className='w-[500px] h-[200px] border border-[#333] focus:ring-0 focus:outline-none resize-none! p-2'
                                                placeholder='Nhập đánh giá của bạn về chúng tôi...'
                                                value={comment}
                                                onChange={handleChange}></textarea>
                                            <div className="text-right text-sm text-gray-500 mt-1">
                                                {comment.length}/{maxLength}
                                            </div>
                                            {error && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {error}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant='contained'
                                        color='error'
                                        onClick={handleSubmit}
                                        disabled={loading}>{loading ? "Dang gui..." : "Gui"}</Button>
                                </div>
                            </Dialog>
                        </div>
                    </div>
                    <div className="boxReview-star w-[500px] space-y-2 mt-3">
                        {[5, 4, 3, 2, 1].map(star => {
                            const count = ratingCounts[star] || 0;
                            const percent = total ? Math.round((count / total) * 100) : 0;
                            return (
                                <div key={star} className="rating-level flex items-center gap-2">
                                    <div className="number-star flex items-center w-8">
                                        <span>{star}</span>
                                        <FaStar className="text-yellow-400 ml-1" />
                                    </div>
                                    <progress max={100} value={percent} className='custom-progress w-[250px] h-2.5 appearance-none'></progress>
                                    <span className="text-sm text-gray-600 ml-2">{count} đánh giá</span>
                                </div>
                            );
                        })}
                    </div>

                </div>

                <div className='w-full h-auto bg-white p-3 my-2 rounded-lg' >
                    <div className="boxReview-filter flex items-center mb-3">
                        <div className="title m-0">Lọc đánh giá</div>
                        <div className="container-filter flex items-center">
                            {
                                filters.map((filter) => (
                                    <div key={filter.id} className={`filter-item py-1 px-2 rounded-2xl border border-[#333] mx-2 cursor-pointer
                                    ${activeFilter === filter.id ? "bg-blue-100 text-blue-600" : 'bg-gray-100'}`}
                                        onClick={() => setActiveFilter(filter.id)}>
                                        {filter.label}
                                    </div>
                                ))
                            }
                        </div>
                        <div className="ms-auto">
                            <div className="reply-rate">Tỉ lệ phản hồi <span>99%</span></div>
                        </div>
                    </div>

                    <BoxReview reviews={reviews} userId={userId} />


                    <div className="flex justify-center mt-3">
                        <Button variant='contained'>Xem tất cả đánh giá <FaChevronRight /> </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Review