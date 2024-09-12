"use client"
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to the Socket.IO server
const socket = io("http://localhost:3001");

export const CurrentUser = () => {
    const [users, setUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

      socket.on("current_users", (users: string[]) => {
        console.log(users);
        setUsers(users);
         setLoading(false);
    });

        return () => {
           
            socket.off("current_users");
        };
    }, []);

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <div className="flex flex-col h-full p-4">
            <div className="overflow-auto flex-1">
                <div className="bg-gray-200 p-4 rounded-lg">
                    <div className="text-lg font-bold mb-2">Users in Room</div>
                    {users.length > 0 ? (
                        <ul>
                            {users.map((user) => (
                                <li key={user} className="p-2 border-b">{user}</li>
                            ))}
                        </ul>
                    ) : (
                        <div>No users in the room</div>
                    )}
                </div>
            </div>
        </div>
    );
};
