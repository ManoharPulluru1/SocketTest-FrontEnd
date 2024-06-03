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

  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data);
    });

    return () => {
      socket.off("users");
    };
  }, []);

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleReset = () => {
    socket.emit("resetUsers");
    setIsUserAdded(false);
  };

  const handleButtonClick = () => {
    setIsUserAdded(true);
    if (userLocation && username.trim()) {
      socket.emit("addUser", { username, lat: userLocation[1], lng: userLocation[0] });
      setUsername("");
    }
  };

  useEffect(() => {
    if (isUserAdded && userLocation) {
      const user = users.find((user) => user.name === username);
      if (user) {
        socket.emit("updateUserLocation", user.index, userLocation[1], userLocation[0]);
      }
    }
  }, [userLocation]);

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
