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
    if (userLocation) {
      if (username.trim()) {
        socket.emit("addUser", { username, lat: userLocation[1], lng: userLocation[0] });
        setUsername("");
      }
    }
  };

  return (
    <div className="AppMain">
      <div className="functionalities">
        {isUserAdded ? (
          <></>
        ) : (
          <>
            <input type="text" value={username} onChange={handleInputChange} placeholder="Enter username" />
            <button onClick={handleButtonClick}>Add User</button>
          </>
        )}

        {users.length > 0 && (
          <>
            <h2>Users</h2>
            <ul>
              {users.map((user) => (
                <User key={user.index} user={user} userLocation={userLocation ? userLocation : null} />
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
        ) : (
          <></>
        )}
      </div>

      <MapBoxV1 setUserLocation={setUserLocation} users={users} />
    </div>
  );
};

export default App;
