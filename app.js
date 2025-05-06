const express = require("express");
const app = express();
const port = 3000;

const path = require("path");
const http = require("http");
const socketio = require("socket.io");

// Create server
const server = http.createServer(app);
const io = socketio(server);

// Serve static files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// 🔥 Fix: Store all connected users' locations
const users = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // When a user sends their location
    socket.on("send-location", (data) => {
        users[socket.id] = data; // Save user's location
        io.emit("receive-location", users); // Broadcast all users' locations
    });

    // When a user disconnects
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[socket.id]; // Remove user from list
        io.emit("user-disconnected", socket.id);
    });
});

// Handle root route
app.get("/", (req, res) => {
    res.render("index");
});

// Start server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
