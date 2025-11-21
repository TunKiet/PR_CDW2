import { createServer } from "http";
import { Server } from "socket.io";
import Redis from "ioredis";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// -----------------------------
// 1. Kết nối Redis (Docker)
// -----------------------------
const redisConfig = {
  host: "redis",      // TÊN SERVICE TRONG DOCKER
  port: 6379,
  retryStrategy(times) {
    console.log(`🔄 Redis retry: ${times}`);
    return Math.min(times * 50, 2000);
  },
};

// Publisher + Subscriber
const redis = new Redis(redisConfig);
const redisSub = new Redis(redisConfig);

// Xử lý lỗi Redis
redis.on("error", (err) => console.error("❌ Redis error:", err));
redisSub.on("error", (err) => console.error("❌ RedisSub error:", err));

redis.on("connect", () => console.log("✅ Redis publisher connected"));
redisSub.on("connect", () => console.log("✅ Redis subscriber connected"));

// -----------------------------
// 2. Subscribe vào channel Laravel publish
// -----------------------------
redisSub.on("ready", () => {
  console.log("✅ Redis subscriber ready, now subscribing...");
  redisSub.subscribe("laravel-database-chat", (err, count) => {
    if (err) console.error("❌ Redis subscribe error:", err);
    else console.log("📬 Subscribed to Redis channel: laravel-database-chat");
  });
});


// -----------------------------
// 3. Redis nhận tin → emit qua Socket.IO
// -----------------------------
redisSub.on("message", (redisChannel, message) => {

  let payload;
  try {
    payload = JSON.parse(message);
  } catch (e) {
    console.error("❌ Invalid JSON payload:", e);
    return;
  }

  console.log(`📩 [Redis → Socket.IO] Message from channel ${redisChannel}: ${message}`);

  const event = payload.event;
  const data = payload.data;
  const room = payload.channel;  // Phải có 'channel' từ Laravel

  if (!room) {
    console.error("❌ Missing room in payload:", payload);
    return;
  }

  console.log(`➡ Emit to room: ${room}, event: ${event}`);
  io.to(room).emit(event, data);
});

// -----------------------------
// 4. Socket.IO connection
// -----------------------------
io.on("connection", (socket) => {
  console.log(`🔥 Client connected: ${socket.id}`);

  // Client đăng ký room
  socket.on("subscribe", ({ channel }) => {
    socket.join(channel);
    console.log(`📨 Client ${socket.id} subscribed to ${channel}`);
  });

  // Client rời room
  socket.on("unsubscribe", ({ channel }) => {
    socket.leave(channel);
    console.log(`📨 Client ${socket.id} unsubscribed from ${channel}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`⚠️ Client disconnected: ${socket.id} (${reason})`);
  });
});

// -----------------------------
// 5. Start server
// -----------------------------
httpServer.listen(3001, "0.0.0.0", () => {
  console.log("🚀 Socket.IO server running on 0.0.0.0:3001");
});

// -----------------------------
// 6. Optional: publish function
// -----------------------------
export const publishMessage = (channel, message) => {
  console.log(`📤 Publishing message to Redis channel: ${channel}`, message);
  redis.publish(channel, JSON.stringify(message));
};
