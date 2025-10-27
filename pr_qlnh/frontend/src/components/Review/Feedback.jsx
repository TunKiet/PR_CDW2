import React from 'react'
import Button from '@mui/material/Button';
const Feedback = () => {
    return (
        <>
            <div className="formReview-feedback-wapper w-full h-auto flex">
                <div className="formReview-feedback-textarea flex items-center ms-auto">
                    <div className="textarea-comment w-[900px] ">
                        <textarea name="" id="" className='!leading-[35px] border border-[#333] rounded-[5px] w-full h-[45px] !p-1 focus:ring-0 focus:outline-none !resize-none' placeholder='Viết phản hồi'></textarea>
                    </div>
                    <Button variant='contained' color='error' className='ms-2 mb-1 p-2'>Gửi phản hồi</Button>
                </div>
            </div>
        </>
    )
}

export default Feedback