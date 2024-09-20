// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

// Create the Express app
const app = express();
app.use(cors());

// Create the HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIO(server, {
    cors: {
        origin: "*", // allow all origins (you can restrict this later)
        methods: ["GET", "POST"]
    }
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Listen for incoming messages
    socket.on('send_message', (data) => {
        console.log('Message received:', data);

        // Broadcast message to everyone
        io.emit('receive_message', data);
    });

    // Listen for typing events
    socket.on('typing', (data) => {
        socket.broadcast.emit('user_typing', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
