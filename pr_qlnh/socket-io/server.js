const io = require('socket.io')(3001, {
    cors: {
        origin: "*",  // Cho phép frontend connect (thay bằng http://localhost:3000 nếu cần secure)
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Lắng nghe events từ Laravel (nếu cần custom)
    socket.on('message', (data) => {
        console.log('Message received:', data);
        io.emit('message', data);  // Broadcast lại
    });
});

console.log('Socket.io server running on port 3001');