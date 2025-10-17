import React, { useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import ManagerReview from './ManagerReview';
import ManagerReply from './ManagerReply';
import { CiSearch } from "react-icons/ci";
import Button from '@mui/material/Button';

const ReviewModerator = () => {

  const [showComment, setShowComment] = useState(true);

  return (
    <>
      <div className="section">
      </div><div className="flex min-h-screen">
        <div className="w-[20%]">
          <Sidebar />
        </div>
        <div className="w-[80%] bg-gray-100 p-6">
          <div className="container">
            <h2 className="text-2xl font-semibold mb-4">ReviewModerator</h2>
            <hr />
            <div className="reviewModerator-box-setting flex">
              <div className="reviewModerator-box-search w-[600px]">
                <div className="search-input relative">
                  <div className="search-icon">
                    <CiSearch className='absolute right-0 top-2.5 me-2' />
                  </div>
                  <input type="search" className='form-control' placeholder='Tim kiem danh gia...' />
                </div>
              </div>
              <div className="reviewModerator-box-view flex ms-auto">
                <div className="reviewModerator-button flex">
                  <div className="reviewModerator-button-left" onClick={() => setShowComment(true)}>
                    <Button variant={showComment ? "contained" : "outlined"}>Đánh giá</Button>
                  </div>
                  <div className="reviewModerator-button-right mx-3" onClick={() => setShowComment(false)}>
                    <Button variant={!showComment ? "contained" : "outlined"} color='error'>Phản hồi</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showComment ? <ManagerReview /> : <ManagerReply />}
        </div>
      </div>
    </>
  )
}

export default ReviewModerator