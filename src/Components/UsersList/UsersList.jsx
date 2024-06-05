import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { port } from "../../port";
const socket = io(port);

const UsersList = ({ users }) => {
  const handleClear = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <button onClick={handleClear}>clear</button>
      {users?.map((user, index) => (
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
