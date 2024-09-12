

"use client";
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3001");

export const Main = () => {
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room);
        }
    };

    const sendMessage = () => {
        if (message !== "") {
            socket.emit("send_message", { roomId: room, message });
            setMessage("");  // Clear the input field after sending
        }
    };

    useEffect(() => {
        // Listen for messages only after joining a room
        socket.on("receive_message", (message) => {
            setReceivedMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Chat Room</h1>

                {/* Room ID Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    <button
                        onClick={joinRoom}
                        className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Join Room
                    </button>
                </div>

                {/* Message Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Message"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        onClick={sendMessage}
                        className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Send Message
                    </button>
                </div>

                {/* Display Received Messages */}
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Messages:</h2>
                <div className="h-64 p-4 overflow-y-auto bg-gray-50 border border-gray-300 rounded-lg">
                    {receivedMessages.length > 0 ? (
                        receivedMessages.map((msg, index) => (
                            <p key={index} className="p-2 mb-2 bg-gray-200 rounded-lg">{msg}</p>
                        ))
                    ) : (
                        <p className="text-gray-500">No messages yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};