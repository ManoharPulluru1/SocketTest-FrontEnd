import React, { useState } from 'react';
import './LoginCard.css';
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const LoginCard = ({ setIsLoggedIn }) => {
  const [userName, setUserName] = useState('');
  const [mobile, setMobile] = useState('');

  const triggerSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    socket.emit('checkExistingUser', mobile);

    socket.once('existingUser', (exists) => { // Use `once` to avoid multiple event triggers
      if (!exists) {
        localStorage.setItem('liveTracking', mobile);
        socket.emit('addAnUser', { userName, mobile });
        setIsLoggedIn(true);
      } else {
        alert('User already exists');
      }
    });
  };

  const triggerUserName = (e) => {
    setUserName(e.target.value);
  };

  const triggerMobileNumber = (e) => {
    setMobile(e.target.value);
  };

  return (
    <div className='LoginCardMain'>
      <form className='LoginForm' onSubmit={triggerSubmit}>
        <h2>Login</h2>
        <div className='inputGroup'>
          <label htmlFor='username'>Username:</label>
          <input onChange={triggerUserName} type='text' id='username' name='username' required />
        </div>
        <div className='inputGroup'>
          <label htmlFor='mobile'>Mobile Number:</label>
          <input onChange={triggerMobileNumber} type='tel' id='mobile' name='mobile' required />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default LoginCard;
