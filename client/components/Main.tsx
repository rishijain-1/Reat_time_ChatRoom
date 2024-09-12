"use client";
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3001");

export const Main = () => {
    const [userName, setUserName] = useState(""); 
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [receivedMessages, setReceivedMessages] = useState<{ user: string; message: string }[]>([]);

    const joinRoom = () => {
        if (room !== "" && userName !== "") {
            socket.emit("join_room", { room, userName }); 
        }
    };

    const sendMessage = () => {
        if (message !== "" && userName !== "") {
            socket.emit("send_message", { roomId: room, message, userName }); // Correct object format
            setMessage("");  // Clear the input field after sending
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setReceivedMessages((prevMessages) => [...prevMessages, { user: data.userName, message: data.message }]);
        });
        return () => {
            socket.off("receive_message");
        };
    }, []);
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Chat Room</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Your Name"
                        className="w-full px-4 py-2 border text-black font-bold border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                {/* Room ID Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        className="w-full px-4 py-2 border text-black font-bold border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <div className="h-64 p-4 overflow-y-auto bg-gray-50 border border-gray-600 rounded-lg">
                    {receivedMessages.length > 0 ? (
                        receivedMessages.map((msg, index) => (
                            <p key={index} className="p-2 mb-2 bg-gray-700 rounded-lg text-white">
                                <strong>{msg.user}:</strong> {msg.message}
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-500">No messages yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
