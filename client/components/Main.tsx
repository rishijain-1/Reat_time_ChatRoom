"use client"
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3001");

export const Main = () => {
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [receivedMessage, setReceivedMessage] = useState<string[]>([]);

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room);
        }
    };

    const sendMessage = () => {
        if (message !== "") {
            socket.emit("send_message", { roomId: room, message });
        }
    };

    // Listen for incoming messages
    useEffect(() => {
        // Listen for messages only after joining a room
        socket.on("receive_message", (message) => {
            setReceivedMessage((prevMessages) => [...prevMessages, message]);
        });

        // Clean up listener when component unmounts
        return () => {
            socket.off("receive_message");
        };
    }, []);

    return (
        <div>
            <h1>Chat Room</h1>
            <input
                type="text"
                placeholder="Room ID"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>

            <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send Message</button>

            <h2>Received Message:</h2>
            <p>{receivedMessage}</p>
        </div>
    );
};