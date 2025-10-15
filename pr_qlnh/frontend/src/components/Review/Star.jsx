import React from 'react'
import { FaStar } from "react-icons/fa";
const Star = () => {
    return (
        <>
            <div className="star flex text-2xl py-1">
                <div className="icon"><FaStar className='text-yellow-400 text-[20px]' /></div>
                <div className="icon mx-1"><FaStar className='text-yellow-400 text-[20px]' /></div>
                <div className="icon mx-1"><FaStar className='text-yellow-400 text-[20px]' /></div>
                <div className="icon mx-1"><FaStar className='text-yellow-400 text-[20px]' /></div>
                <div className="icon "><FaStar className='text-yellow-400 text-[20px]' /></div>
            </div>
        </>
    )
}

export default Star