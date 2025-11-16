import React, { useState, useEffect } from "react";
import Sidebar from '../Sidebar/Sidebar'
import { ImAttachment } from "react-icons/im";
import { FaImage } from "react-icons/fa";
import { CiPaperplane } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { SlLike } from "react-icons/sl";
import Receiver from './Receiver';
import Sender from './Sender';
import axios from 'axios';

const endPoint = 'http://127.0.0.1:8000/api';

const AdminChat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const adminId = 1;

    // Load conversations ban đầu
    useEffect(() => {
        axios.get(`${endPoint}/conversations`)
            .then(res => setConversations(res.data))
            .catch(err => console.error(err));
    }, []);

    // Load messages khi select conversation
    useEffect(() => {
        if (selectedConversation) {
            axios.get(`${endPoint}/messages/${selectedConversation.conversation_id}`)
                .then(res => setMessages(res.data))
                .catch(err => console.error(err));
        }
    }, [selectedConversation]);

    // Listen realtime events
    useEffect(() => {
        const channel = window.Echo.channel('chat');
        channel.listen('message.sent', (e) => {
            if (selectedConversation && e.message.conversation_id === selectedConversation.conversation_id) {
                setMessages(prev => [...prev, e.message]);
            }
            // Update last message trong conversations list
            setConversations(prev => prev.map(conv =>
                conv.conversation_id === e.message.conversation_id
                    ? { ...conv, lastMessage: e.message }
                    : conv
            ));
        });

        return () => channel.stopListening('message.sent');
    }, [selectedConversation]);

    // Send message từ admin
    const sendMessage = () => {
        if (!input.trim() || !selectedConversation) return;
        axios.post(`${endPoint}/send-message`, {
            conversation_id: selectedConversation.conversation_id,
            user_id: adminId,  // user_id của admin
            sender_type: 'admin',
            message: input
        }).then(() => setInput(''));
    };
    return (
        <>
            <div className="section">
                <div className="flex min-h-screen">
                    <Sidebar />
                    <div className="w-[85%] bg-gray-100 p-6 flex h-screen">
                        <div className="w-[20%] h-full flex flex-col">
                            <div className="w-full h-[100px] bg-gray-200"></div> {/* header */}
                            <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {conversations.map(conv => (
                                    <div
                                        key={conv.conversation_id}
                                        onClick={() => setSelectedConversation(conv)}
                                        className="wrapper-chat p-2 flex bg-blue-100 gap-2 cursor-pointer mb-1"
                                    >
                                        <div className="w-[45px] h-[45px] bg-amber-400 flex justify-center items-center rounded-full text-lg font-bold">
                                            {conv.customer.username[0]}
                                        </div>
                                        <div className="wrapper-content flex flex-col justify-center flex-1">
                                            <div className="flex items-center">
                                                <span className="text-[15px] font-medium">{conv.customer.username}</span>
                                                <p className="ms-auto text-[13px] text-gray-600 mb-0">14 giờ</p>
                                            </div>
                                            <div className="text-[14px] text-gray-700 truncate">
                                                {conv.lastMessage?.message || 'No messages'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-[80%] h-full flex flex-col flex-1">
                            {selectedConversation && (
                                <>
                                    <div className="w-full h-auto bg-gray-300 p-2">
                                        <div className="flex gap-2">
                                            <div className="w-[45px] h-[45px] bg-amber-400 flex justify-center items-center rounded-full text-lg font-bold">{selectedConversation.customer.username[0]}</div>
                                            <div>
                                                <div className="name">{selectedConversation.customer.username}</div>
                                                <div className="status relative text-[13px] text-green-400 ps-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-green-400 before:rounded-full">
                                                    Đang hoạt động
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 bg-gray-200 p-2 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                                        {messages.map(msg => (
                                            msg.user_id === adminId ? (
                                                <Sender key={msg.message_id} content={msg.message} time={msg.created_at} />
                                            ) : (
                                                <Receiver key={msg.message_id} content={msg.message} time={msg.created_at} />
                                            )
                                        ))}
                                    </div>
                                    <div className="chat-option flex items-center gap-2 p-2 border">
                                        <div className="flex gap-2">
                                            <div className="icon-attach cursor-pointer">
                                                <ImAttachment size={23} />
                                            </div>
                                            <div className="icon-image cursor-pointer">
                                                <FaImage size={23} />
                                            </div>
                                        </div>
                                        <div className="flex flex-1">
                                            <div className="input-message flex relative w-full">
                                                <input
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                                    type="text"
                                                    className="w-full rounded-full border border-gray-300 px-4 py-2 outline-none"
                                                    placeholder="Nhập tin nhắn..."
                                                />
                                                <CiPaperplane
                                                    onClick={sendMessage}
                                                    size={23}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-600"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="icon-emoji cursor-pointer">
                                                <BsEmojiSmile size={23} />
                                            </div>
                                            <div className="icon-like cursor-pointer">
                                                <SlLike size={23} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AdminChat