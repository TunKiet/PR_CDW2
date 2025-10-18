import React from 'react'
import BoxReview from '../Review/BoxReview'

export const ReviewAll = () => {
  return (
    <>
        <div className="container w-[80%] h-auto bg-gray-100 border border-[#333] rounded-[8px] p-3">
            <div className="allReview">
                <div className="allReview-head">
                    <h2 className='font-bold'>Đánh giá về món Bún bò</h2>
                </div>
                <div className="block-dish">
                    <div className="block-dish-item flex p-3 bg-white rounded-[8px]">
                        <div className="dish-image w-[200px] h-[120px]">
                            <img src="https://i.ytimg.com/vi/A_o2qfaTgKs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDLj67gTiQBsryAaEQJ6s5Fa07yWg" alt="" />
                        </div>
                        <div className="block-dish-info ms-2">
                            <p className='info-name text-2xl m-0'>Bún bò</p>
                            <div className="info-price text-2xl text-red-600 font-bold">
                                45.000 vnd
                            </div>
                        </div>
                    </div>
                </div>
                <div className="allReview-list rounded-[8px] bg-white mt-3">
                    <div className="allReview-list-item p-3">
                        <BoxReview/>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
