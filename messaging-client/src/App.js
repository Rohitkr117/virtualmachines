import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';

const socket = io('http://192.168.22.176:5000'); // Backend address

function App() {
  return (
    <div className="App">
      <h1>Real-Time Messaging App</h1>
      <Chat socket={socket} />
    </div>
  );
}

export default App;


