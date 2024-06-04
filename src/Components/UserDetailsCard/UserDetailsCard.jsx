import React, { useState, useEffect } from 'react'
import './UserDetailsCard.css'
import io from "socket.io-client";
import { port } from '../../port';

const socket = io(port);

const UserDetailsCard = ({userLocation}) => {
    const [mobile, setMobile] = useState(localStorage.getItem('liveTracking'));
    const [userName, setUserName] = useState('');


    useEffect(() => {
        socket.emit('getUserName', mobile);
        socket.once('userName', (userName) => {
            setUserName(userName);
        });
    }, []);



  return (
    <div className='UserDetailsCardMain'>
      <div>Name: {userName}</div>
        <div>User Lat: {userLocation.lat  }</div>
        <div>User Lng: {userLocation.lng}</div>
    </div>
  )
}

export default UserDetailsCard
