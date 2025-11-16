import React, { useState, useEffect } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import { FaImage } from "react-icons/fa";
import { CiPaperplane } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { SlLike } from "react-icons/sl";
import Receiver from "./Receiver";
import Sender from "./Sender";
import axios from 'axios';

const endPoint = 'http://127.0.0.1:8000/api';

const UserChat = () => {

    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    // const [conversationId, setConversationId] = useState(null);  // Giả định lấy từ API hoặc props
    const userId = 2;  // Hardcode user_id của customer
    const conversationId = 1;

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 🔥 Lắng nghe tin nhắn realtime từ Laravel Reverb
    useEffect(() => {
        Echo.channel(`conversation.${conversationId}`)
            .listen(".message.sent", (event) => {
                setMessages((prev) => [...prev, event.message]);
            });

        return () => {
            Echo.leaveChannel(`conversation.${conversationId}`);
        };
    }, [conversationId]);

    // 📤 Gửi tin nhắn
    const sendMessage = async () => {
        if (!text.trim()) return;

        await fetch(`${endPoint}/send-message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                conversation_id: conversationId,
                sender_id: senderId,
                message: text,
            }),
        });

        setText("");
    };
    

    return (
        <>
            {/* Nút mở chat */}
            <div
                onClick={() => setOpenChat(!openChat)}
                className="icon-chat fixed right-3 bottom-3 bg-red-500 text-white w-[60px] h-[60px] flex items-center justify-center p-3 rounded-full shadow-lg cursor-pointer"
            >
                <AiOutlineMessage size={50} />
            </div>

            {/* Box chat */}
            {openChat && (
                <div className="box-chat fixed right-3 bottom-20 w-[400px] h-[500px] shadow-lg rounded-2xl flex flex-col bg-white">
                    <div className="box-wrapper p-2 flex flex-col flex-1">

                        {/* Header */}
                        <div className="chat-title flex justify-start items-center gap-2 mb-2">
                            <div className="avatar w-10 h-10 rounded-full p-3 bg-red-600 flex justify-center items-center text-white font-bold text-2xl">
                                Q
                            </div>
                            <div>
                                <div className="uppercase font-bold text-[19px]">
                                    Quản trị viên
                                </div>
                                <div className="status relative text-[13px] text-green-400 ps-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-green-400 before:rounded-full">
                                    Đang hoạt động
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="message-text flex flex-col flex-1 overflow-y-auto w-full [&::-webkit-scrollbar]:hidden">
                            {messages.map((msg) =>
                                msg.sender_id === senderId ? (
                                    <Sender key={msg.message_id} text={msg.message} />
                                ) : (
                                    <Receiver key={msg.message_id} text={msg.message} />
                                )
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="chat-option flex items-center gap-2 mt-2">
                            <div className="flex gap-2">
                                <ImAttachment size={23} className="cursor-pointer" />
                                <FaImage size={23} className="cursor-pointer" />
                            </div>

                            <div className="flex flex-1 relative">
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    type="text"
                                    className="w-full rounded-full border border-gray-300 px-4 py-2 outline-none"
                                    placeholder="Nhập tin nhắn..."
                                />

                                <CiPaperplane
                                    size={23}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-600"
                                    onClick={sendMessage}
                                />
                            </div>

                            <div className="flex gap-2">
                                <BsEmojiSmile size={23} className="cursor-pointer" />
                                <SlLike size={23} className="cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserChat;
