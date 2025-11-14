import React from 'react'

const Receiver = () => {
    return (
        <>
            <div className="box-content max-w-[75%] bg-gray-100 rounded-md p-2 mb-2 inline-block wrap-break-word">
                <div className="content text-base leading-relaxed">
                    Giúp tôi với tin nhắn dài có thể tự xuống dòng khi tới max-width.
                </div>
                <div className="time text-xs text-gray-500 mt-1 text-left">20:30</div>
            </div>
        </>
    )
}

export default Receiver