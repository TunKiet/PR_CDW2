import React from 'react'
import Button from '@mui/material/Button';
import { CiStar } from "react-icons/ci";
const Review = () => {
    return (
        <>
            <div className="container-review w-[80%] h-auto m-auto border border-[#333] p-2">
                <div className="headReview">
                    <h2>Đánh giá món ăn</h2>
                </div>
                <div className="boxReview w-full h-[30px] bg-amber-200">
                    <div className="boxReview-overview">
                        <div className="boxReview-score">
                            <div className="rating"><span className="average-rating text-3xl">4.8</span>/5</div>
                            <div className="item-star">
                                <div className="star flex text-2xl space-x-1">
                                    <div className="icon "><CiStar className='text-yellow-400'/></div>
                                    <div className="icon "><CiStar className='text-yellow-400'/></div>
                                    <div className="icon "><CiStar className='text-yellow-400'/></div>
                                    <div className="icon "><CiStar className='text-yellow-400'/></div>
                                    <div className="icon "><CiStar className='text-yellow-400'/></div>
                                </div>
                            </div>
                            <div className="count-review"></div>
                            <Button variant="contained" color='error'>Viết đánh giá</Button>
                        </div>
                    </div>
                    <div className="boxReview-star"></div>
                </div>
            </div>
        </>
    )
}

export default Review