import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './components/chat';

const socket = io('http://172.18.223.0:5000'); // Backend address

function App() {
  return (
    <div className="App">
      <h1>Real-Time Messaging App</h1>
      <Chat socket={socket} />
    </div>
  );
}

export default App;

