import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Create a socket instance to connect with the backend server
const socket = io('http://192.168.22.176:5000'); // Make sure to point this to your backend URL

function Chat() {
  const [username, setUsername] = useState(''); // To store the user's name
  const [message, setMessage] = useState('');   // To store the current message being typed
  const [messages, setMessages] = useState([]); // To store all received messages

  // Set up Socket.IO event listeners when the component mounts
  useEffect(() => {
    // Listen for new messages broadcasted from the server
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Add the new message to the messages array
    });

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      socket.off('receive_message');
    };
  }, []);

  // Function to handle sending a message
  const sendMessage = () => {
    if (message !== '' && username !== '') {
      // Emit the 'send_message' event with both the username and message
      socket.emit('send_message', { username, message });
      setMessage(''); // Clear the message input field after sending
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
      
      {/* Input for the username */}
      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Input for the message */}
      <div>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* Display all messages */}
      <div className="messages">
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.username}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Chat;
