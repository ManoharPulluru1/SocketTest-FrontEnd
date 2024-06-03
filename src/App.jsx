import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import User from "./User";
import MapBoxV1 from "./MapBoxV1";
import "./App.css";

const socket = io("http://localhost:4000"); // Adjust the URL if your server is running elsewhere

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
  }, [users]);

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleButtonClick = () => {
    setIsUserAdded(true);
    if (username.trim()) {
      socket.emit("addUser", { username });
      setUsername("");
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
                <>
                  <User user={user} />
                </>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="userCard">

        {
          userLocation ? <div className="userCard">
            {
              // console.log(userLocation, "userLocation")
              <div>

                <h2>User Location</h2>
                <p>Latitude: {userLocation[1]}</p>
                <p>Longitude: {userLocation[0]}</p>
              </div>
            }
          </div> : <>
          
          </>
        }
      </div>

      <MapBoxV1 setUserLocation={setUserLocation} />
    </div>
  );
};

export default App;
