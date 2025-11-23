import React from 'react'

const Receiver = ({ content, time }) => {
    const formattedTime = new Date(time).toLocaleTimeString();
    return (
        <div className="mb-2 flex justify-start">
            <div className="box-content bg-gray-100 rounded-md p-2 max-w-[75%] min-w-[50px] wrap-break-word inline-block">
                <div className="content text-base leading-relaxed">{content}</div>
                <div className="time text-xs text-gray-500 mt-1 text-left">{formattedTime}</div>
            </div>
        </div>
    );
};

export default Receiver