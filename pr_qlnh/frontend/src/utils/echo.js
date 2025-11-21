import Echo from "laravel-echo";
import { io } from "socket.io-client";

window.io = io; // 👈 BẮT BUỘC PHẢI CÓ

const echo = new Echo({
  broadcaster: "socket.io",
  client: io,
  host: import.meta.env.VITE_SOCKET_HOST,  
  transports: ["websocket"],
  forceTLS: false,
});


// Debug
console.log("✅ Echo initialized:", echo);
console.log("🟢 Echo connector:", echo.connector);
console.log("🟢 Echo socket:", echo.connector?.socket);
console.log("🔄 Socket connected?", echo.connector.socket.connected);

window.echo = echo;
export default echo;
