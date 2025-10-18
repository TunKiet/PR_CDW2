import React, { useRef, useState } from 'react'
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
import Feedback from './Feedback';
import axios from "axios";

const Review = () => {

    const [activeFilter, setActiveFilter] = useState(1);
    const [openFormReview, setOpenFormReview] = useState(false);
    // const [values, setValues] = useState(null);

    //get information review
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);


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

    //Handle button submit
    const handleSubmit = async () => {
        if (!rating) return alert('Vui long chon sao!');
        setLoading(true);

        const formData = new FormData();
        formData.append("menu_item_id", 1);
        formData.append("rating", rating);
        formData.append("comment", comment);

        if (image) {
            formData.append("image_url", image);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const res = await axios.post("http://localhost:8000/api/reviews", formData, {
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
                                                className='w-[500px] h-[200px] border border-[#333] focus:ring-0 focus:outline-none !resize-none p-2'
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
                                    <div key={filter.id} className={`filter-item py-1 px-2 rounded-2xl border border[#333] mx-2 cursor-pointer
                                    ${activeFilter === filter.id ? "bg-blue-100 text-blue-600" : 'bg-gray-100 text-black'}`}
                                        onClick={() => setActiveFilter(filter.id)}>
                                        {filter.label}
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* Info review */}
                    <BoxReview menuItemId={1}/>
                    {/* <Feedback /> */}

                    <hr />
                    

                    {/* <Feedback /> */}

                    <div className="flex justify-center">
                        <Button variant='contained'>Xem tất cả đánh giá <FaChevronRight /> </Button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Review