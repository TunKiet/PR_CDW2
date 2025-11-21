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
import echo from '../../utils/echo';
import { useRef } from "react";

const endPoint = 'http://localhost:8000/api';

const AdminChat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const adminId = 1;

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
    }, [selectedConversation]);

    // Scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Lắng nghe realtime
    // Lắng nghe realtime
    useEffect(() => {
        if (!selectedConversation) {
            console.warn("⚠️ No conversation selected → skip real-time listener");
            return;
        }

        console.log(
            "🟢 Setting up Admin Echo listener for conversation:",
            selectedConversation.conversation_id
        );

        // 1) Kiểm tra echo instance
        if (!echo) {
            console.error("❌ Echo instance is NULL → listener cancelled");
            return;
        }

        // 2) Kiểm tra connector
        if (!echo.connector) {
            console.error("❌ Echo connector missing → Echo not initialized correctly");
            return;
        }

        // 3) Kiểm tra socket
        const socket = echo.connector.socket;

        if (!socket) {
            console.error("❌ Echo socket missing → Echo failed to connect");
            return;
        }

        // 4) Kiểm tra socket đã kết nối chưa
        if (!socket.connected) {
            console.warn("⚠️ Echo socket NOT connected yet → waiting for connection...");

            socket.on("connect", () => {
                console.log("🟢 Socket connected LATE:", socket.id);
            });
        } else {
            console.log("🟢 Socket already connected:", socket.id);
        }

        console.log("🟢 Emitting subscribe to channel:", `chat.${selectedConversation.conversation_id}`);
        echo.connector.socket.emit("subscribe", {
            channel: `chat.${selectedConversation.conversation_id}`,
        });

        // 5) Lấy kênh chat chung (public)
        const channel = echo.channel(`chat.${selectedConversation.conversation_id}`);

        if (!channel) {
            console.error("❌ echo.channel('chat') returned NULL → check Echo config");
            return;
        }

        // 6) Kiểm tra channel.listen tồn tại không
        if (typeof channel.listen !== "function") {
            console.error(
                "❌ channel.listen is NOT a function → Echo is not ready\nChannel object:",
                channel
            );
            return;
        }

        console.log("🟢 Channel 'chat' is READY → attaching debug listeners...");

        // Debug thử tất cả event có thể Laravel broadcast ra
        channel.listen("message.sent", (data) =>
            console.log("📩 [DEBUG] Event message.sent received:", data)
        );


        // 7) Listener thực tế
        const listener = (event) => {
            console.log("📩 Raw realtime event:", event);

            const msg = event.data || event.message || event;

            console.log("📨 Extracted message:", msg);

            if (!msg.conversation_id) {
                console.warn("⚠️ Event does NOT contain conversation_id:", msg);
                return;
            }

            // Lọc theo đúng conversation
            if (msg.conversation_id !== selectedConversation.conversation_id) {
                console.log(
                    `⚠️ Message from conversation ${msg.conversation_id}, not ${selectedConversation.conversation_id} → ignore`
                );
                return;
            }

            console.log("✅ Message belongs to active conversation → updating state");

            // Append message
            setMessages((prev) => [...prev, msg]);

            // Update danh sách conversation
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.conversation_id === msg.conversation_id
                        ? { ...conv, lastMessage: msg }
                        : conv
                )
            );
        };

        // Lắng nghe đúng tên broadcast của Laravel
        channel.listen("message.sent", listener);

        console.log("🟢 Admin Echo listener ATTACHED");

        return () => {
            console.log("🔴 Cleaning up Admin Echo listener...");
            channel.stopListening("message.sent", listener);
            echo.leave("chat"); // đảm bảo rời channel
        };
    }, [selectedConversation]);



    // Gửi tin nhắn
    const sendMessage = () => {
        if (!input.trim() || !selectedConversation) {
            console.log("⚠️ Cannot send: input empty or no conversation selected");
            return;
        }

        console.log("📤 Sending message:", { conversation_id: selectedConversation.conversation_id, user_id: adminId, sender_type: 'admin', message: input });
        axios.post(`${endPoint}/send-message`, {
            conversation_id: selectedConversation.conversation_id,
            user_id: adminId,
            sender_type: 'admin',
            message: input
        })
            .then((response) => {
                console.log("✅ Send message response:", response.data);
                const newMessage = response.data.message || response.data;
                console.log("📝 Adding new message to state:", newMessage);
                setMessages(prev => {
                    const updated = [...prev, newMessage];
                    console.log("📝 Messages state after send:", updated);
                    return updated;
                });

                // Cập nhật lastMessage của conversation
                setConversations(prev => {
                    const updated = prev.map(conv =>
                        conv.conversation_id === selectedConversation.conversation_id
                            ? { ...conv, lastMessage: newMessage }
                            : conv
                    );
                    console.log("📝 Conversations state after send:", updated);
                    return updated;
                });

                setInput('');
            })
            .catch(err => {
                console.error('❌ Error sending message:', err);
            });
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
                                                <span className="text-[15px] font-medium">Đang soạn...</span>
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
                                        {/* Thêm ref để scroll */}
                                        <div ref={messagesEndRef} />
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
