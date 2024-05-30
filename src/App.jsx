import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://sockettest-1.onrender.com'); // Adjust the URL if your server is hosted elsewhere

const App = () => {
  const [notification, setNotification] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    socket.on('notification', (data) => {
      setNotification(data);
    });

    // Cleanup the effect when the component is unmounted
    return () => {
      socket.off('notification');
    };
  }, []);

  const sendMessage = () => {
    if (inputValue.trim()) {
      socket.emit('newMessage', inputValue);
      setInputValue(''); // Clear the input field after sending the message
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      {notification && (
        <p>
          {notification.dateTime}: {notification.message}
        </p>
      )}
      <div>
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
