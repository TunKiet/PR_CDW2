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
import echo from "../../utils/echo";

const endPoint = 'http://localhost:8000/api';

const UserChat = () => {
    console.log("SOCKET_HOST =", import.meta.env.VITE_SOCKET_HOST);

    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const userId = 2;
    const conversationId = 1;
    const messagesEndRef = useRef(null);

    // Load messages ban đầu
    useEffect(() => {
        if (openChat) {
            console.log("🔄 Loading messages for conversation:", conversationId);
            axios.get(`${endPoint}/messages/${conversationId}`)
                .then(res => {
                    console.log("✅ Messages loaded:", res.data);
                    setMessages(res.data);
                })
                .catch(err => {
                    console.error("❌ Error loading messages:", err);
                });
        }
    }, [openChat]);

    // Scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        let interval;
        function setupSocket() {
            if (!echo?.connector?.socket) {
                console.warn("❌ Echo socket not initialized yet, retrying...");
                return false;
            }

            const socket = echo.connector.socket;

            if (socket.connected) {
                console.log("✅ User socket is connected:", socket.id);
            } else {
                console.warn("⚠️ User socket NOT connected yet, will wait for connect event");
                socket.once("connect", () => {
                    console.log("🟢 User socket CONNECTED LATE:", socket.id);
                });
            }

            socket.on("disconnect", (reason) => {
                console.warn("⚠️ User socket disconnected:", reason);
            });

            socket.on("error", (err) => {
                console.error("❌ User socket error:", err);
            });

            return true;
        }

        // Poll every 500ms until socket ready
        interval = setInterval(() => {
            const ready = setupSocket();
            if (ready) clearInterval(interval);
        }, 500);

        return () => clearInterval(interval);
    }, []);


    // Listen realtime
    useEffect(() => {
        console.log("🟢 Setting up Echo listener for conversation:", conversationId);

        // 1) Kiểm tra Echo init
        if (!echo) {
            console.warn("❌ Echo instance is NULL");
            return;
        }

        // 2) Kiểm tra connector
        if (!echo.connector) {
            console.warn("❌ Echo connector missing");
            return;
        }

        // 3) Kiểm tra socket
        const socket = echo.connector.socket;
        if (!socket) {
            console.warn("❌ Echo socket missing");
            return;
        }

        // 4) Kiểm tra socket đã connect chưa
        if (!socket.connected) {
            console.warn("⚠️ Echo socket NOT connected yet. Waiting...");
            socket.on("connect", () => {
                console.log("🟢 Echo socket CONNECTED LATE:", socket.id);
            });
        } else {
            console.log("🟢 Echo socket already connected:", socket.id);
        }

        console.log("🟢 Emitting subscribe to channel:", `chat.${conversationId}`);
        echo.connector.socket.emit("subscribe", {
            channel: `chat.${conversationId}`,
        });


        // 5) Lấy channel
        const channel = echo.channel(`chat.${conversationId}`);

        if (!channel) {
            console.error("❌ Echo channel('chat') returned NULL");
            return;
        }

        // Kiểm tra channel có phương thức listen()
        if (typeof channel.listen !== "function") {
            console.error("❌ channel.listen is NOT a function → nghĩa là Echo chưa sẵn sàng!");
            console.log("🔍 Channel object:", channel);
            return;
        }

        console.log("🟢 Echo channel acquired, attaching listeners now...");

        // Debug tất cả event thử xem SocketIO server đang broadcast tên nào
        channel.listen("message.sent", (data) =>
            console.log("📩 Event [message.sent] received:", data)
        );


        // Listener xử lý logic
        const listener = (event) => {
            console.log("📩 Raw event received from Echo:", event);

            const msg = event.data || event.message || event;

            console.log("📨 Extracted message:", msg);

            if (msg.conversation_id === conversationId) {
                console.log("✅ Message matches current conversation → updating messages...");
                setMessages((prev) => {
                    const newMessages = [...prev, msg];
                    console.log("📝 Updated messages state:", newMessages);
                    return newMessages;
                });
            } else {
                console.log("⚠️ Message belongs to another conversation:", msg.conversation_id);
            }
        };

        // Lắng nghe đúng tên event Laravel broadcastAs()
        channel.listen("message.sent", listener);

        console.log("🟢 Echo listener successfully attached");

        return () => {
            console.log("🔴 Cleaning up Echo listener...");
            channel.stopListening("message.sent", listener);
            echo.leave("chat");
        };
    }, [conversationId]);


    // Send message
    const sendMessage = () => {
        if (!input.trim()) {
            console.log("⚠️ Cannot send: input empty");
            return;
        }

        console.log("📤 Sending message:", { conversation_id: conversationId, user_id: userId, sender_type: 'customer', message: input });
        axios.post(`${endPoint}/send-message`, {
            conversation_id: conversationId,
            user_id: userId,
            sender_type: 'customer',
            message: input
        })
            .then(res => {
                console.log("✅ Send message response:", res.data);
                const newMessage = res.data.message || res.data;
                console.log("📝 Adding new message to state:", newMessage);
                setMessages(prev => {
                    const updated = [...prev, newMessage];
                    console.log("📝 Messages state after send:", updated);
                    return updated;
                });
                setInput('');
            })
            .catch(err => console.error("❌ Send message error:", err));
    };

    // ... (phần return JSX giữ nguyên)


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
                                <Sender key={msg.message_id} content={msg.message} time={msg.created_at} />
                            ) : (
                                <Receiver key={msg.message_id} content={msg.message} time={msg.created_at} />
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
