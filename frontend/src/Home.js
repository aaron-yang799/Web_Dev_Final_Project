import React, { useState, useEffect} from 'react';
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import "./Home.css";

function Home() {
  
  //example chats to show functionality
  const [chats, setChats] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [message, setMessage] = useState('');


  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async (userID) => {
      const response = await fetch('http://localhost:8081/chats');
      const data = await response.json();
      setChats(data);
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
      console.log(chatID);
      const response = await fetch(`http://localhost:8081/allmessages/${chatID}`);
      const data = await response.json();
      console.log(data);
      setMessages(data);
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
          chat: selectedChat
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

  return (
    <Container fluid className="container">
      <Row>
        <Col md={4}>
          <ListGroup>
            {chats && chats.map(chat => (
              <ListGroup.Item key={chat.chatID} onClick={() => handleSelectChat(chat)} action>
                {chat.chatName}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8}>
          <div className="chat-window">
          {messages && messages.map(message => (
              <div key={message.id} className="message">{message.message}</div>
          ))}
          </div>
          <Form className="d-flex fixed-message-box">
            <Form.Control
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Enter a message..."
            />
            <Button variant="primary" onClick={handleSendMessage}>Send</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;