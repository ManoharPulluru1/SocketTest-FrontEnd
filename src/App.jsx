import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import User from "./User";
import MapBoxV1 from "./MapBoxV1";
import "./App.css";
import { port } from "./port";

const socket = io(port); // Adjust the URL if your server is running elsewhere

const App = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [isUserAdded, setIsUserAdded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userIndex, setUserIndex] = useState(null);

  useEffect(() => {
    const handleUsersUpdate = (data) => {
      setUsers(data);
    };

    socket.on("users", handleUsersUpdate);

    return () => {
      socket.off("users", handleUsersUpdate);
    };
  }, []);

  useEffect(() => {
    if(userIndex){
      socket.emit("updateUserLocation", userIndex, userLocation[1], userLocation[0]);
    }
  }, [userLocation]);


  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleReset = () => {
    socket.emit("resetUsers");
    setIsUserAdded(false);
  };

  const handleButtonClick = () => {
    if (userLocation && username.trim()) {
      const newUserIndex = users.length; // Calculate the new user's index based on the length of the users array
      socket.emit("addUser", { username, lat: userLocation[1], lng: userLocation[0], index: newUserIndex });
      setUsername("");
      setIsUserAdded(true);
      setUserIndex(newUserIndex); // Set the userIndex state to the new user's index
    }
  };

  useEffect(() => {
    if (isUserAdded && userLocation) {
      const userIndex = users.findIndex((user) => user.name === username);
      if (userIndex !== -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex].lat = userLocation[1];
        updatedUsers[userIndex].lng = userLocation[0];
        setUsers(updatedUsers);
        socket.emit("updateUserLocation", updatedUsers[userIndex].index, userLocation[1], userLocation[0]);
      }
    }
  }, [userLocation, isUserAdded, users, username]);

  return (
    <div className="AppMain">
      <div className="functionalities">
        {!isUserAdded ? (
          <>
            <input type="text" value={username} onChange={handleInputChange} placeholder="Enter username" />
            <button onClick={handleButtonClick}>Add User</button>
          </>
        ) : null}

        {users.length > 0 && (
          <>
            <h2>Users</h2>
            <ul>
              {users.map((user) => (
                <User key={user.index} user={user} />
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="userCard">
        {userLocation ? (
          <div className="userCard">
            <div>
              <h2>User Location</h2>
              <p>Latitude: {userLocation[1]}</p>
              <p>Longitude: {userLocation[0]}</p>
              <p>User index: {userIndex !== null ? userIndex : "Not available"}</p>
              <button onClick={handleReset}>Reset Users</button>
            </div>
          </div>
        ) : null}
      </div>
      <MapBoxV1 setUserLocation={setUserLocation} users={users} />
    </div>
  );
};

export default App;
