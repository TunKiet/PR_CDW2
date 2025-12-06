import React, { useState, useEffect } from "react";
import Sidebar from '../Sidebar'
import { ImAttachment } from "react-icons/im";
import { FaImage } from "react-icons/fa";
import { CiPaperplane } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { SlLike } from "react-icons/sl";
import Receiver from './Receiver';
import Sender from './Sender';
import axios from 'axios';
import { useRef } from "react";
import Pusher from 'pusher-js';
import EmojiPicker from 'emoji-picker-react';
import { Popover } from '@headlessui/react';
import { confirmDialog } from '../../utils/notify'
import { notify, confirmAction } from '../../utils/notify'
const endPoint = 'http://localhost:8000/api';

const AdminChat = () => {

    const adminId = JSON.parse(localStorage.getItem("user"))?.user_id;

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [isSending, setIsSending] = useState(false);

    // Load danh sách conversations
    useEffect(() => {
        console.log("🔄 Loading conversations...");
        axios.get(`${endPoint}/conversations`)
            .then(res => {
                console.log("✅ Conversations loaded:", res.data);
                setConversations(res.data);
            })
            .catch(err => {
                console.error("❌ Error loading conversations:", err);
            });
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Load messages khi chọn conversation

    useEffect(() => {
        if (!selectedConversation) return;

        console.log("🔄 Loading messages for conversation:", selectedConversation.conversation_id);
        axios.get(`${endPoint}/messages/${selectedConversation.conversation_id}`)
            .then(res => {
                console.log("✅ Messages loaded:", res.data);
                setMessages(res.data);
            })
            .catch(err => {
                console.error("❌ Error loading messages:", err);
            });

        // Setup Pusher
        Pusher.logToConsole = true;
        const pusher = new Pusher('f923893c65fd2311c63c', { cluster: 'ap1' });
        const channel = pusher.subscribe(`conversation.${selectedConversation.conversation_id}`);
        console.log("📡 Subscribed to channel:", `conversation.${selectedConversation.conversation_id}`);

        channel.bind('message', (data) => {
            console.log("📨 Pusher received message:", data);
            setMessages(prev => {
                if (prev.some(msg => msg.message_id === data.message_id)) return prev;
                return [...prev, data];
            });
        });

        return () => {
            console.log("❌ Unsubscribing Pusher channel:", `conversation.${selectedConversation.conversation_id}`);
            pusher.unsubscribe(`conversation.${selectedConversation.conversation_id}`);
        };
    }, [selectedConversation]);
    // AdminChat.jsx


    // Gửi tin nhắn
    const sendMessage = async () => {
        if (!input.trim() || !selectedConversation || isSending) {
            await confirmDialog('Không thể gửi', 'Vui lòng nhập nội dung.');
            return;
        }

        if (input.length > 1000) {
            await confirmDialog('Không thể gửi', 'Vui lòng rút ngắn nội dung.');
            return;
        }

        setIsSending(true);

        console.log("📤 Sending message:", {
            conversation_id: selectedConversation.conversation_id,
            user_id: adminId,
            sender_type: 'admin',
            message: input
        });

        axios.post(`${endPoint}/send-message`, {
            conversation_id: selectedConversation.conversation_id,
            user_id: adminId,
            sender_type: 'admin',
            message: input
        })
            .then(response => {
                console.log("✅ Send message response:", response.data);

                const newMessage = response.data.message || response.data;

                setConversations(prev =>
                    prev.map(conv =>
                        conv.conversation_id === selectedConversation.conversation_id
                            ? { ...conv, lastMessage: newMessage }
                            : conv
                    )
                );

                setInput('');
            })
            .catch(err => console.error("❌ Error sending message:", err))
            .finally(() => setIsSending(false));
    };

    const handleEmojiClick = (emojiData) => {
        setInput(prev => prev + emojiData.emoji);
    };

    // Gửi emoji ngay
    const sendEmoji = (emoji) => {
        if (!selectedConversation) {
            console.log("⚠️ Cannot send emoji: no conversation selected");
            return;
        }

        console.log("📤 Sending emoji:", emoji);

        axios.post(`${endPoint}/send-message`, {
            conversation_id: selectedConversation.conversation_id,
            user_id: adminId,
            sender_type: 'admin',
            message: emoji
        })
            .then(res => {
                console.log("✅ Emoji sent:", res.data);
                // Không cần thêm vào state, Pusher sẽ xử lý
            })
            .catch(err => console.error("❌ Send emoji error:", err));
    };

    const handleDelete = async (messageId) => {
        const isConfirmed = await confirmAction('Bạn chắc chắn muốn xóa tin nhắn này?');
        if (!isConfirmed) return;

        try {
            notify.info('Đang xóa...');
            notify.dismiss();

            await axios.delete(`${endPoint}/delete-message/${messageId}`);
            setMessages(prev => prev.filter(msg => msg.message_id !== messageId));
            notify.success('Xóa tin nhắn thành công');
        } catch (error) {
            notify.error('Xóa tin nhắn không hợp lệ. Vui lòng tải lại trang');
            console.log(error);
        }
    }

    return (
        <>
            <div className="section">
                <div className="flex min-h-screen">
                    <Sidebar />

                    <div className="w-[85%] bg-gray-100 p-6 flex h-screen">
                        {/* Sidebar danh sách hội thoại */}
                        <div className="w-[20%] h-full flex flex-col">
                            <div className="w-full h-[100px] bg-gray-200"></div> {/* header */}

                            <div className="overflow-y-auto flex-1 
              [&::-webkit-scrollbar]:w-1 
              [&::-webkit-scrollbar-track]:bg-gray-200 
              [&::-webkit-scrollbar-thumb]:bg-gray-400 
              [&::-webkit-scrollbar-thumb]:rounded-full">
                                {conversations.map(conv => (
                                    <div
                                        key={conv.conversation_id}
                                        onClick={() => setSelectedConversation(conv)}
                                        className="wrapper-chat p-2 flex bg-blue-100 gap-2 cursor-pointer mb-1"
                                    >
                                        <div className="w-[45px] h-[45px] bg-amber-400 flex justify-center items-center rounded-full text-lg font-bold">
                                            {conv.customer.full_name[0]}
                                        </div>
                                        <div className="wrapper-content flex flex-col justify-center flex-1">
                                            <div className="flex items-center">
                                                <span className="text-[15px] font-medium">{conv.customer.full_name}</span>
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

                        {/* Khung chat chính */}
                        <div className="w-[80%] h-full flex flex-col flex-1">
                            {!selectedConversation && (
                                <div className="flex-1 flex justify-center items-center text-gray-600 text-lg">
                                    Chọn cuộc hội thoại
                                </div>
                            )}
                            {selectedConversation && (
                                <>
                                    {/* Header hội thoại */}
                                    <div className="w-full h-auto bg-gray-300 p-2">
                                        <div className="flex gap-2">
                                            <div className="w-[45px] h-[45px] bg-amber-400 flex justify-center items-center rounded-full text-lg font-bold">
                                                {selectedConversation.customer.full_name[0]}
                                            </div>
                                            <div>
                                                <div className="name">{selectedConversation.customer.full_name}</div>
                                                <div className="status relative text-[13px] text-green-400 ps-3 
                        before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 
                        before:w-3 before:h-3 before:bg-green-400 before:rounded-full">
                                                    Đang hoạt động
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    
                                    {/* Danh sách tin nhắn */}
                                    <div className="flex flex-col flex-1 bg-gray-200 p-2 overflow-y-auto 
                  [&::-webkit-scrollbar]:w-1 
                  [&::-webkit-scrollbar-track]:bg-gray-200 
                  [&::-webkit-scrollbar-thumb]:bg-gray-400 
                  [&::-webkit-scrollbar-thumb]:rounded-full">
                                        {messages.map(msg =>
                                            msg.user_id === adminId ? (
                                                <Sender
                                                    key={`${msg.conversation_id}-${msg.message_id}`}
                                                    content={msg.message}
                                                    time={msg.created_at}
                                                    messageId={msg.message_id}
                                                    handleDelete={handleDelete}

                                                />
                                            ) : (
                                                <Receiver
                                                    key={`${msg.conversation_id}-${msg.message_id}`}
                                                    content={msg.message}
                                                    time={msg.created_at}
                                                />
                                            )
                                        )}
                                        {/* Thêm ref để scroll */}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input gửi tin nhắn */}
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
                                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                                    type="text"
                                                    className="w-full rounded-full border border-gray-300 px-4 py-2 outline-none"
                                                    placeholder="Nhập tin nhắn..."
                                                />
                                                <CiPaperplane
                                                    size={23}
                                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-600 transition
                                                    ${isSending ? "opacity-40 cursor-not-allowed" : "opacity-100"}`}
                                                    onClick={!isSending ? sendMessage : undefined}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="icon-emoji cursor-pointer">

                                                <div>
                                                    <Popover className="relative">
                                                        <Popover.Button>
                                                            <BsEmojiSmile size={23} className="cursor-pointer" />
                                                        </Popover.Button>

                                                        <Popover.Panel className="absolute z-10 right-0 bottom-full mb-2">
                                                            <EmojiPicker
                                                                theme="dark"
                                                                onEmojiClick={handleEmojiClick}
                                                            />
                                                        </Popover.Panel>
                                                    </Popover>
                                                </div>
                                            </div>
                                            <div className="icon-like cursor-pointer">
                                                <SlLike onClick={() => sendEmoji("👍")} size={23} className="cursor-pointer" />
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
    );

}

export default AdminChat
