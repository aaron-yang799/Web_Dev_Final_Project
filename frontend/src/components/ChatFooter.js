import React, { useState } from 'react';

const ChatFooter = ({ socket, currentChat }) => {
  const [message, setMessage] = useState('');

  const handleTyping = () =>
    socket.emit('typing', `${localStorage.getItem('userEmail')} is typing`);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem('userEmail')) {
      socket.emit('message', {
        message: message,
        sender_name: localStorage.getItem('userEmail'),
        fromUserId: localStorage.getItem('userID'),
        toUserId: currentChat.to_user_id,
        chatId: currentChat.chat_id,
      });
    }
    setMessage('');
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;