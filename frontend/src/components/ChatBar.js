import React, { useState, useEffect } from 'react';

const ChatBar = ({ socket, chats }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket]);

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        {chats.map(chat => (
        <button key={chat.chat_id} onClick={() => socket.emit('chatSwitch', chat)}>
          {chat.name}
        </button>
      ))}
      </div>
    </div>
  );
};

export default ChatBar;