import { useEffect } from "react";
import React from "react";
import io from "socket.io-client";
import { port } from "./port";

const socket = io(port);

const User = ({ user }) => {
  const { name, index, lat, lng } = user;

  useEffect(() => {
    socket.emit("updateUserLocation", index, lat, lng);
  }, [lat, lng]);

  return (
    <div>
      {name} : {index} : {lat} : {lng}
    </div>
  );
};

export default User;
