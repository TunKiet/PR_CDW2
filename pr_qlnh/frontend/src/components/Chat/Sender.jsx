import React from 'react'

const Sender = ({ content, time }) => {
    const formattedTime = new Date(time).toLocaleTimeString();  // Format time
    return (
        <div className="box-content max-w-[75%] bg-blue-200 rounded-md p-2 mb-2 inline-block wrap-break-word self-end">
            <div className="content text-base leading-relaxed">{content}</div>
            <div className="time text-xs text-gray-500 mt-1 text-left">{formattedTime}</div>
        </div>
    );
};

export default Sender