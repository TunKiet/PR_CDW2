import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { notify } from '../../utils/notify';
import axios from 'axios';
const Feedback = ({ reviewId, userId, onSuccess }) => {

    // console.log('reviewId:', reviewId, 'userId:', userId);

    const [loading, setLoading] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleSubmit = async () => {
        if (!replyText.trim()) {
            notify.info('Vui lòng nhập phản hồi');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                'http://localhost:8000/api/reply',
                {
                    review_id: reviewId,
                    user_id: userId,
                    reply_text: replyText
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            notify.success('Gửi phản hồi thành công');
            setReplyText('');

            // callback để reload list reply ở component cha
            if (onSuccess) onSuccess(res.data.data);

        } catch (error) {
            console.log('Reply error:', error.response?.data);
            notify.error('Gửi phản hồi thất bại');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="formReview-feedback-wapper w-full h-auto flex justify-end mb-2">
                <div className="formReview-feedback-textarea flex items-center w-full max-w-[1200px] gap-1.5">
                    <div className="input-comment flex-1">
                        <input
                            type="text"
                            className="border border-[#333] rounded-[5px] w-full h-[45px] p-2 focus:ring-0 focus:outline-none"
                            placeholder="Viết phản hồi"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            disabled={loading}
                        />
                    </div>

                    <Button
                        variant="contained"
                        color="error"
                        className="ml-2 mb-1 px-4 py-2 shrink-0"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Feedback