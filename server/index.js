import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
const port=process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
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
        socket.data.userName = userName;
        socket.data.room = room;
        console.log(`${userName} with ID: ${socket.id} joined room: ${room}`);
        socket.to(room).emit("user_joined", { userName, message: `${userName} has joined the room` });
    });

    socket.on("send_message", ({ roomId, message,userName }) => {
        io.to(roomId).emit("receive_message",{userName, message});
        console.log(`Message sent to room ${roomId} by ${userName}: ${message}`);
    });

    socket.on("disconnect", () => {
        const { room, userName } = socket.data; 

        if (room && userName) {
            socket.to(room).emit("user_left", { userName, message: `${userName} has left the room` });
            console.log(`${userName} with ID: ${socket.id} has left room: ${room}`);
        }
        console.log(`User disconnected: ${socket.id},${userName} has left the room `);
    });
});

server.listen(port, () => console.log("Server running on port 3001"));
