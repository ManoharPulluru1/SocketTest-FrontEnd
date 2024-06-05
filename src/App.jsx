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
  const [flag, setFlag] = useState(false);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);

  const triggerReset = () => {
    localStorage.removeItem("liveTracking");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const liveTracking = localStorage.getItem("liveTracking");
    socket.on("users", (users) => {
      setUsers(users);
    });

    socket.emit("checkExistingUser", liveTracking);
    socket.on("existingUser", (exists) => {
      if (!exists) {
        localStorage.removeItem("liveTracking");
        setIsLoggedIn(false);
      }
    });
    if (liveTracking && liveTracking.length > 1) {
      setIsLoggedIn(true);
    }
  }, []);

  const currentUser = (lat, lng) => {
    setFlag(true);
    setLat(lat);
    setLng(lng);
    // setFlag(false);
    setTimeout(() => {
      setFlag(false);
    }, 100);
  };

  const triggerDeleteUser = (mobile) => {
    socket.emit("deleteUser", mobile);
  };

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
        <>
          <div className="mapboxParent">
            <div className="yourDetailsCard">
              <UserDetailsCard changeCount={changeCount} setChangeCount={setChangeCount} userLocation={userLocation} />
            </div>
            <MapBox lat={lat} lng={lng} flag={flag} userLocation={userLocation} setUserLocation={setUserLocation} />
          </div>
          <div className="allUsersDiv">
            {users.map((user, index) => (
              <div className="userDiv" key={index}>
                <div className="listUN">{user.userName}</div>
                <div className="buttons">
                  <div onClick={() => currentUser(user.lat, user.lng)} className="listDel">
                    Center
                  </div>
                  <div onClick={() => triggerDeleteUser(user.mobile)} className="listDel">
                    Delete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <button onClick={triggerReset} className="resetButton">
        Log out
      </button>
      <div className="changeCountDiv">{changeCount}</div>
    </div>
  );
};

export default App;
