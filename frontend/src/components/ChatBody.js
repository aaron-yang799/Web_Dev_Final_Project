import React from 'react';
import { useNavigate } from 'react-router-dom';


const ChatBody = ({ messages, lastMessageRef, typingStatus}) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
    window.location.reload();
  };

  

  return (
    <>
      <header className="chat__mainHeader">
        <p>Start Chatting!</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message) =>
          message.sender_name === localStorage.getItem('userEmail') ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.message}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.sender_name}</p>
              <div className="message__recipient">
                <p>{message.message}</p>
              </div>
            </div>
          )
        )}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
        </div>
    </>
  );
};

export default ChatBody;