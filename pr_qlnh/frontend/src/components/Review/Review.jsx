import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { FaChevronRight } from "react-icons/fa";
import BoxReview from './BoxReview';
import RatingInfo from './RatingInfo';



const Review = () => {
    const menuItemId = 1;
    const [activeFilter, setActiveFilter] = useState(1);
    const navigateAllReview = useNavigate();

    const filters = [
        { id: 1, label: "Tất cả" },
        { id: 2, label: "5 sao" },
        { id: 3, label: "4 sao" },
        { id: 4, label: "3 sao" },
        { id: 5, label: "2 sao" },
        { id: 6, label: "1 sao" },
    ];

    //handle click navigate
    const handleNavigate = () => {
        navigateAllReview(`/all-review/${menuItemId}`);
    }


    return (
        <>
            <div className="container-review w-[80%] h-auto m-auto border border-[#333] p-2 bg-gray-100 rounded-[10px]">
                <div className="headReview">
                    <h2>Đánh giá món ăn</h2>
                </div>

                <RatingInfo />

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
                    <BoxReview menuItemId={1} />

                    <div className="flex justify-center">
                        <Button onClick={handleNavigate} variant='contained'>Xem tất cả đánh giá <FaChevronRight /> </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Review