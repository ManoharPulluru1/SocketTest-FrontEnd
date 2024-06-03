import { useState } from "react";
import React from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Ensure socket is not reinitialized

const User = ({ user }) => {
  const { name, message, index } = user;
  const [updatedMessage, setUpdatedMessage] = useState(message);
  const [newMessage, setNewMessage] = useState("");

  const triggerIpChange = (e) => {
    setNewMessage(e.target.value);
  };

  const triggerUpdate = () => {
    if (newMessage === "") return;
    console.log("triggerUpdate", index, newMessage);
    socket.emit("updateUserMessage", index, newMessage);
    setUpdatedMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div>
      {name} : {message} : {index}
      <input
        type="text"
        value={newMessage}
        onChange={triggerIpChange}
      />
      <button onClick={triggerUpdate}>Update</button>
    </div>
  );
};

export default User;
