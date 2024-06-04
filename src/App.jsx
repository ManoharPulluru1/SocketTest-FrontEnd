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

  useEffect(() => {
    const liveTracking = localStorage.getItem("liveTracking");
    if (liveTracking && liveTracking.length > 1) {
      setIsLoggedIn(true);
    }
  }, []);

  
  useEffect(() => {
    console.log("User location updated:", userLocation);
  }, [userLocation]);

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
            <UserDetailsCard setUserLocation={setUserLocation} userLocation={userLocation} />
          </div>
          <MapBox setUserLocation={setUserLocation} />
        </div>
      )}
    </div>
  );
};

export default App;
