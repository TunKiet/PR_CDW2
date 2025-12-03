import React, { useEffect, useRef, useState } from 'react'
import { CiCamera } from "react-icons/ci";
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import Button from '@mui/material/Button';
import axios from "axios";

const endPoint = 'http://127.0.0.1:8000/api';

const RatingInfo = () => {
    const menuItemId = 1;

    const [openFormReview, setOpenFormReview] = useState(false);

    //get average, count, breakdown review
    const [ratingData, setRatingData] = useState(null);

    //get information review
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    //Handle open choose file
    const handleIconClick = () => {
        fileInputRef.current.click();
    }

    //Handle change file
    const handleChangeFile = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };


    const handleClickOpen = () => {
        setOpenFormReview(true);
    }
    const handleClose = () => {
        setOpenFormReview(false);
    }

    //Handle button submit
    const handleSubmit = async () => {
        if (!rating) return alert('Vui long chon sao!');
        setLoading(true);

        const formData = new FormData();
        formData.append("menu_item_id", menuItemId);
        formData.append("rating", rating);
        formData.append("comment", comment);

        if (image) {
            formData.append("image_url", image);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const res = await axios.post(`${endPoint}/api/reviews`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert(res.data.message);
            handleClose();
        } catch (error) {
            console.log(error);
            alert("Gui danh gia that bai");
        }
        finally {
            setLoading(false);
        }
    }

    //fetch api average, count, breakdown review
    useEffect(() => {
        if (!menuItemId) return; // tránh fetch khi chưa có id
        const fetchRating = async () => {
            try {
                const res = await axios.get(`${endPoint}/menu/${menuItemId}/ratings`);
                setRatingData(res.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
            }
        };
        fetchRating();
    }, [menuItemId]);

    const count = ratingData?.count || 0;
    const breakdown = ratingData?.breakdown || {};
    return (
        <>
            <div className="boxReview w-full h-[200px] bg-white p-3 flex rounded-lg">
                <div className="boxReview-overview w-[250px]">
                    <div className="boxReview-score">
                        <div className="rating text-4xl"><span className="average-rating text-6xl">{ratingData?.average ?? 0}</span>/5</div>
                        <div className="item-star">
                            <Rating value={5} readOnly />
                        </div>
                        <div className="count-review py-1 ">{ratingData?.count ?? 0} lượt đánh giá</div>
                        <Button variant="contained" color='error' onClick={handleClickOpen}>Viết đánh giá</Button>
                        <Dialog open={openFormReview} onClose={handleClose}>
                            <div className="container p-3 m-3 max-w-xl w-full mx-auto">
                                <div className="absolute top-1 right-1 p-3! rounded-full! me-auto! hover:bg-gray-300 w-10! cursor-pointer" onClick={handleClose}><IoClose /></div>
                                <h2 className='text-5xl font-bold pt-3'>Đánh giá về chúng tôi</h2>
                                <div className="formReview-info flex items-center">
                                    <div className="formReview-info-avatar">
                                        <Avatar />
                                    </div>
                                    <div className="formReview-info-name">
                                        <p className='mx-3 m-0'>User 1</p>
                                    </div>
                                </div>
                                <div className="formReview-select-rating py-2">
                                    <Rating value={rating} size='large' onChange={(e, newValue) => { setRating(newValue) }} />
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
                                            onChange={(e) => setComment(e.target.value)}></textarea>
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

                    {[5, 4, 3, 2, 1].map((star) => {
                        const starCount = breakdown[star] ?? 0;
                        const percent = count > 0 ? ((starCount / count) * 100).toFixed(1) : 0;

                        return (
                            <div key={star} className="rating-level flex items-center gap-2">
                                <div className="number-star flex items-center w-8">
                                    <span>{star}</span>
                                    <FaStar className="text-yellow-400 ml-1" />
                                </div>
                                <progress max={100} value={percent} className='custom-progress w-[250px] h-2.5 appearance-none'></progress>
                                <span className="text-sm text-gray-600 ml-2">{starCount} đánh giá</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default RatingInfo
