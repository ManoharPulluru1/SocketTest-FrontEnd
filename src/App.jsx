import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import LoginCard from "./Components/LoginCard/LoginCard";
import "./App.css";
import MapBox from "./Components/MapBox/MapBox";
import { port } from "./port";
import UserDetailsCard from "./Components/UserDetailsCard/UserDetailsCard";

const socket = io(port);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [users, setUsers] = useState([]);
  const [changeCount, setChangeCount] = useState(0);

  const triggerReset = () => {
    localStorage.removeItem("liveTracking");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const liveTracking = localStorage.getItem("liveTracking");
    socket.on("users", (users) => {
      setUsers(users);
    });
    if (liveTracking && liveTracking.length > 1) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    console.log(isLoggedIn, 999);
  }, [isLoggedIn]);

  return (
    <div className="appMain">
      {!isLoggedIn ? (
        <div className="LoginCardParent">
          <LoginCard setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
        </div>
      ) : (
        <div className="mapboxParent">
          <div className="yourDetailsCard">
            <UserDetailsCard changeCount={changeCount} setChangeCount={setChangeCount} userLocation={userLocation} />
          </div>
          <MapBox userLocation={userLocation} setUserLocation={setUserLocation} />
        </div>
      )}
      <button onClick={triggerReset} className="resetButton">
        Reset
      </button>
      <div className="changeCountDiv">{changeCount}</div>
      <div className="allUsersDiv">
        {
          users.map((user, index) => (
            <div key={index}>
              <div>Name: {user.userName}</div>
              <div>lat: {user.lat}</div>
              <div>lng: {user.lng}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default App;
