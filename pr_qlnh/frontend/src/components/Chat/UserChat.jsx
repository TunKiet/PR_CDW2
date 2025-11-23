import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import { FaImage } from "react-icons/fa";
import { CiPaperplane } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { SlLike } from "react-icons/sl";
import Receiver from "./Receiver";
import Sender from "./Sender";
import axios from 'axios';
import Pusher from 'pusher-js';

const endPoint = 'http://localhost:8000/api';

const UserChat = () => {

    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const userId = 2;
    const conversationId = 1;
    const messagesEndRef = useRef(null);

    // UserChat.jsx
    useEffect(() => {
        if (!openChat) return;

        // 1) Load messages first
        axios.get(`${endPoint}/messages/${conversationId}`)
            .then(res => {
                setMessages(res.data);
            });

        // 2) Setup Pusher
        const pusher = new Pusher("f923893c65fd2311c63c", {
            cluster: "ap1",
        });

        const channelName = `conversation.${conversationId}`;
        const channel = pusher.subscribe(channelName);

        channel.bind("message", (data) => {
            setMessages(prev => {
                if (prev.some(msg => msg.message_id === data.message_id)) return prev;
                return [...prev, data];
            });
        });

        // 3) Cleanup
        return () => {
            pusher.unsubscribe(channelName);
            pusher.disconnect();
        };

    }, [openChat]);  // chỉ chạy khi bật chat

    // Scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message
    const sendMessage = () => {

        if (!input.trim()) {
            console.log("⚠️ Cannot send: input empty");
            return;
        }

        console.log("📤 Sending message:", {
            conversation_id: conversationId,
            user_id: userId,
            sender_type: 'customer',
            message: input
        });

        axios.post(`${endPoint}/send-message`, {
            conversation_id: conversationId,
            user_id: userId,
            sender_type: 'customer',
            message: input
        })
            .then(res => {
                console.log("✅ Send message response:", res.data);

                // ❗ Không thêm vào state nữa — đã có Pusher xử lý
                setInput('');
            })
            .catch(err => console.error("❌ Send message error:", err));
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
                <div className="box-chat fixed right-3 bottom-20 w-[400px] h-[500px]! shadow-lg rounded-l-sm flex flex-col bg-white">
                    {/* Header */}
                    <div className="chat-title flex justify-start items-center gap-2 p-2 border-b border-gray-300">
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
                    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full p-2 space-y-2">
                        {messages.map((msg) =>
                            msg.user_id === userId ? (
                                <Sender
                                    key={`${msg.conversation_id}-${msg.message_id}`}
                                    content={msg.message}
                                    time={msg.created_at}
                                />
                            ) : (
                                <Receiver
                                    key={`${msg.conversation_id}-${msg.message_id}`}
                                    content={msg.message}
                                    time={msg.created_at}
                                />
                            )
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-option flex items-center gap-2 p-2 border-t border-gray-300">
                        <div className="flex gap-2">
                            <ImAttachment size={23} className="cursor-pointer" />
                            <FaImage size={23} className="cursor-pointer" />
                        </div>

                        <div className="flex flex-1 relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
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
            )}
        </>
    );
};

export default UserChat;
