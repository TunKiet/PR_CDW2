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
import EmojiPicker from 'emoji-picker-react';
import { Popover } from '@headlessui/react';
import { notify, confirmAction } from '../../utils/notify'


const endPoint = 'http://localhost:8000/api';

const UserChat = () => {

    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    console.log("user id: " + userId);

    const maxLength = 2000;

    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);


    // Load conversation
    useEffect(() => {
        if (!openChat || !conversationId) return;

        axios.get(`${endPoint}/messages/${conversationId}`)
            .then(res => setMessages(res.data));

        const pusher = new Pusher("f923893c65fd2311c63c", { cluster: "ap1" });
        const channelName = `conversation.${conversationId}`;
        const channel = pusher.subscribe(channelName);

        channel.bind("message", (data) => {
            setMessages(prev => {
                if (prev.some(msg => msg.message_id === data.message_id)) return prev;
                return [...prev, data];
            });
        });

        return () => {
            pusher.unsubscribe(channelName);
            pusher.disconnect();
        };
    }, [openChat, conversationId]);

    // Scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    //Create new conversation when user create chat
    useEffect(() => {
        if (!openChat || !userId) return;

        axios.post(`${endPoint}/create-conversation`, { customer_id: userId })
            .then(res => {
                console.log("📌 Conversation:", res.data);
                setConversationId(res.data.conversation_id.conversation_id);
            })
            .catch(err => {
                console.error("❌ Conversation error:", err)
            });

    }, [openChat, userId]);

    // Send message
    const sendMessage = () => {
        if (!input.trim()) return;

        if (input.length > maxLength) {
            setError(`Tin nhắn không được vượt quá ${maxLength} ký tự`);
            return;
        }

        if (!conversationId) {
            console.log("⚠️ Conversation chưa sẵn");
            return;
        }

        axios.post(`${endPoint}/send-message`, {
            conversation_id: conversationId,
            user_id: userId,
            sender_type: 'user',
            message: input
        })
            .then(() => {
                setInput('');
                setError('');
            })
            .catch(err => console.error(err));
    };


    const handleEmojiClick = (emojiData) => {
        const newValue = input + emojiData.emoji;
        if (newValue.length <= maxLength) {
            setInput(newValue);
            setError("");
        } else {
            setError(`Tin nhắn không được vượt quá ${maxLength} ký tự`);
        }
    };

    // Trong component UserChat
    const sendEmoji = (emoji) => {
        if (!conversationId) return;

        console.log("📤 Sending emoji:", emoji);

        axios.post(`${endPoint}/send-message`, {
            conversation_id: conversationId,
            user_id: userId,
            sender_type: 'user',
            message: emoji
        })
            .then(res => {
                console.log("✅ Emoji sent:", res.data);
                // Không cần thêm vào state, Pusher sẽ xử lý
            })
            .catch(err => console.error("❌ Send emoji error:", err));
    };


    //Open select file image
    const handleImage = () => {
        fileInputRef.current.click();
    }

    //Process sent file image
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            console.log('File đã chọn:', selectedFile.name);
        }
    }

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
            {/* Nút mở chat */}
            <div
                onClick={() => setOpenChat(!openChat)}
                className="icon-chat fixed right-3 bottom-3 bg-red-500 text-white w-[60px] h-[60px] flex items-center justify-center p-3 rounded-full shadow-lg cursor-pointer"
            >
                <AiOutlineMessage size={50} />
            </div>

            {/* Box chat */}
            {openChat && (
                <div className="box-chat fixed right-3 bottom-20 w-[400px] h-[500px] !important shadow-lg rounded-l-sm flex flex-col bg-white">
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
                                    messageId={msg.message_id}
                                    handleDelete={handleDelete}
                                />
                            ) : (
                                <Receiver
                                    key={`${msg.conversation_id}-${msg.message_id}`}
                                    content={msg.message}
                                    time={msg.created_at}
                                    messageId={msg.message_id}
                                />
                            )
                        )}

                        <div ref={messagesEndRef} />
                    </div>



                    {/* Input chat */}
                    <div className="chat-option flex flex-col gap-1 p-2 border-t border-gray-300">
                        {/* Thông báo lỗi */}
                        {error && (
                            <div className="text-red-500 text-xs px-2 animate-pulse">
                                {error}
                            </div>
                        )}

                        {/* Main Input Row */}
                        <div className="flex items-center gap-2">
                            {/* Attachment & Image */}
                            <div className="flex gap-2">
                                <ImAttachment size={23} className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors" />
                                <FaImage
                                    onClick={handleImage}
                                    size={23}
                                    className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                            </div>

                            {/* Input chính với counter bên trong */}
                            <div className="flex flex-1 relative">
                                <input
                                    value={input}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= maxLength) {
                                            setInput(value);
                                            setError("");
                                        } else {
                                            setError(`Tin nhắn không được vượt quá ${maxLength} ký tự`);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && input.trim() && input.length <= maxLength) {
                                            sendMessage();
                                        }
                                    }}
                                    type="text"
                                    className={`w-full rounded-full border px-4 py-2 pr-24 outline-none transition-all ${error
                                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                            : "border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                        }`}
                                    placeholder="Nhập tin nhắn..."
                                />

                                {/* Số ký tự bên trong input */}
                                <span
                                    className={`absolute right-12 top-1/2 transform -translate-y-1/2 text-xs font-medium transition-colors ${input.length > maxLength * 0.9
                                            ? 'text-red-500'
                                            : input.length > maxLength * 0.8
                                                ? 'text-orange-500'
                                                : 'text-gray-400'
                                        }`}
                                >
                                    {input.length}/{maxLength}
                                </span>

                                {/* Nút gửi */}
                                <CiPaperplane
                                    size={26}
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all ${input.trim() && input.length <= maxLength
                                            ? "cursor-pointer text-blue-600 hover:text-blue-700 hover:scale-110"
                                            : "opacity-30 cursor-not-allowed text-gray-400"
                                        }`}
                                    onClick={() => {
                                        if (input.trim() && input.length <= maxLength) {
                                            sendMessage();
                                        }
                                    }}
                                />
                            </div>

                            {/* Emoji & Like */}
                            <div className="flex gap-2">
                                <Popover className="relative">
                                    <Popover.Button className="focus:outline-none">
                                        <BsEmojiSmile
                                            size={23}
                                            className="cursor-pointer text-gray-600 hover:text-yellow-500 transition-colors"
                                        />
                                    </Popover.Button>
                                    <Popover.Panel className="absolute z-10 right-0 bottom-full mb-2">
                                        <EmojiPicker
                                            theme="light"
                                            onEmojiClick={handleEmojiClick}
                                            width={320}
                                            height={400}
                                        />
                                    </Popover.Panel>
                                </Popover>
                                <SlLike
                                    onClick={() => sendEmoji("👍")}
                                    size={23}
                                    className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
};

export default UserChat;