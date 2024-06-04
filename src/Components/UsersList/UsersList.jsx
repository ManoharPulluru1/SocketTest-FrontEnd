import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import { port } from '../../port'; // Ensure this is the correct path to your port configuration

const socket = io(port);

const UsersList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const handleUsersUpdate = (users) => {
            setUsers(users);
        };

        socket.on('users', handleUsersUpdate);

        return () => {
            socket.off('users', handleUsersUpdate);
        };
    }, []);

    return (
        <div>
            {users.map((user, index) => (
                <div key={index}>
                    <div>Name: {user.userName}</div>
                    <div>lat: {user.lat}</div>
                    <div>lng: {user.lng}</div>
                </div>
            ))}
        </div>
    );
};

export default UsersList;
