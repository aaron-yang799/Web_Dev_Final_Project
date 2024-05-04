import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
// import ChatBar from './ChatBar';
// import ChatBody from './ChatBody';
// import ChatFooter from './ChatFooter';
import axios from 'axios';

const ChatBody = lazy(() => import('./ChatBody'));
const ChatFooter = lazy(() => import('./ChatFooter'));
const ChatBar = lazy(() => import('./ChatBar'));

const ChatPage = ({ socket , userID}) => {
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef(null);


  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  
  async function fetchChats(userID) {
    try {
      const response = await axios.post(`http://localhost:8081/Chat`,userID);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;  // Optional: re-throw the error if you want to handle it further up the chain.
    }
  }

  useEffect(() => {
    // Fetch conversations when the component mounts
    async function loadChats() {
      try {
        const chatsData = await fetchChats(userID);
        setChats(chatsData);
        if (chatsData.length > 0) {
          switchChat(chatsData[0]);  // Automatically switch to the first conversation
        }
      } catch (error) {
        console.error('Failed to load chats:', error);
      }
    }
    loadChats();
    socket.on('chatData', (data) => {
      setMessages(data);
    });

    return () => socket.off('chatData');
  }, [socket, userID]);

  const switchChat = (chat) => {
    setCurrentChat(chat);
    socket.emit('switchChat', chat.chat_id);
  };

  useEffect(() => {
    console.log('Chats:', chats); // This will show what chats looks like at runtime
  }, [chats]);

  useEffect(() => {
    socket.on('chatSwitch', (data) => {
      setCurrentChat(data);
      socket.emit('switchChat', data);

    })
  });

  useEffect(() => {
    socket.on('messageResponse', (data) => {
      setMessages([...messages, data])});
  }, [socket, messages]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(data));
  }, [socket]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typingStatus) {
        setTypingStatus('')
      }
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [typingStatus])

  return (
    <div className="chat">
      <Suspense fallback={<div>Loading Chat Components...</div>}>
        <ChatBar socket={socket} chats={chats} />
        <div className="chat__main">
          <ChatBody messages={messages} lastMessageRef={lastMessageRef} typingStatus={typingStatus} />
          <ChatFooter socket={socket} currentChat={currentChat} />
        </div>
      </Suspense>
    </div>
  );
};

export default ChatPage;