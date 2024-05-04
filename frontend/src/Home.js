import React, { useState, useEffect, useRef} from 'react';
import { Container, Row, Col, ListGroup, Form, Button, ListGroupItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import "./Home.css";
import { useUser } from './components/UserContext';


function Home() {
  const { user } = useUser(); // Accessing the current user's data
  //example chats to show functionality
  const [chats, setChats] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);


  const [message, setMessage] = useState('');


  useEffect(() => {
    fetchChats(user.userID);
  }, [user.userID]);

  const fetchChats = async (userID) => {
    try {
      const response = await fetch(`http://localhost:8081/chats/${userID}`);
      const data = await response.json();
      setChats(data);
      } catch (error) {
      console.error(error);  
    }
  }

  useEffect(() => {
    if (chats != null) {
      console.log(chats);
      setSelectedChat(chats[0]);
    }
  }, [chats]);

  useEffect(() => {
    const fetchMessages = async (chatID) => {
      // await axios.get(`http://localhost:8081/messages/${chatID}`)
      // .then(res => {
      //   console.log(res.data); // Add this line
      //   setMessages(res.data);
      // });
      try {
        const response = await fetch(`http://localhost:8081/allmessages/${chatID}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedChat != null) {
      fetchMessages(selectedChat.chatID);
    }
  }, [selectedChat]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // {messageID: 5, message: 'mannn', userID_from: 1, userID_to: 2}
    // const newMessage = {};
    // const newMessages = [...messages, message];
    // setMessages(newMessages);
    try {
      const response = await axios.post(`http://localhost:8081/messages/${selectedChat.chatID}`, { 
          message: message, 
          chat: selectedChat,
          username: user.username
        });
      if(response.data) {
        const newMessages = [...messages, response.data];
        setMessages(newMessages);
      }
    }   
    catch (error) {
      console.error(error);
    }
    setMessage('');
  };

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container fluid className="container">
      <Row>
        <Col md={4}>
          <ListGroup>
            {chats && chats.map(chat => (
              <ListGroup.Item className="chat-btn" key={chat.chatID} onClick={() => handleSelectChat(chat)} action>
                {chat.chatName}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8}>
          <div className="chat-window">
            <div className='chat-messages'>
            {messages && messages.map(message => (
                <div key={message.messageid} className="message">{message.username}: {message.message}</div>
            ))}
            <div ref={bottomRef} />
            </div>
          </div>
        <Form className="d-flex fixed-message-box">
            <Form.Control
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Enter a message..."
            />
            <Button variant="primary" className='messageInput' onClick={handleSendMessage}>Send</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;