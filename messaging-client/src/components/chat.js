import React, { useState, useEffect } from 'react';

const Chat = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Listen for typing indicator
    socket.on('user_typing', (data) => {
      setIsTyping(data);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
    };
  }, [socket]);

  // Send message
  const sendMessage = () => {
    socket.emit('send_message', { message });
    setMessage('');
  };

  // Handle typing indicator
  const handleTyping = () => {
    socket.emit('typing', true);
    setTimeout(() => socket.emit('typing', false), 2000);
  };

  return (
    <div>
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index}>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        {isTyping && <p>User is typing...</p>}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
