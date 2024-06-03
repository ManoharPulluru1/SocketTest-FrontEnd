import { useState } from "react";
import React from "react";
import io from "socket.io-client";
import { port } from "./port";

const socket = io(port); 

const User = ({ user, useLocation }) => {
  const { name, index, lat, lng } = user;
  const [updatedMessage, setUpdatedMessage] = useState("");
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
      {name} : {index} : {lat} : {lng} 
    </div>
  );
};

export default User;
