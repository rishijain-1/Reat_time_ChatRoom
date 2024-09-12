import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.get('/', (req, res) => {
    res.send("Server is running");
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("join_room", ({ room, userName }) => {  
        socket.join(room);
        console.log(`${userName} with ID: ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", ({ roomId, message,userName }) => {
        io.to(roomId).emit("receive_message",{userName, message});
        console.log(`Message sent to room ${roomId} by ${userName}: ${message}`);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3001, () => console.log("Server running on port 3001"));
