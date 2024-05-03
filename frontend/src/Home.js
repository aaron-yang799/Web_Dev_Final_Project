import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import "./Home.css";

function Home() {
  
  //example chats to show functionality
  const [chats, setChats] = useState([
    { id: 1, name: "Alice", messages: ["Hello", "How are you?"] },
    { id: 2, name: "Bob", messages: ["Hey!", "What's up?"] },
    { id: 3, name: "Charlie", messages: ["Hi", "See you later"] }
  ]);

  //manage state of selected convo and state of the message box.
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [message, setMessage] = useState('');

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    const newMessages = [...selectedChat.messages, message];
    const newChat = { ...selectedChat, messages: newMessages };
    const updatedChats = chats.map(chat => chat.id === newChat.id ? newChat : chat);
    setChats(updatedChats);
    setSelectedChat(newChat);
    setMessage('');
  };

  return (
    <Container fluid className="container">
      <Row>
        <Col md={4}>
          <ListGroup>
            {chats.map(chat => (
              <ListGroup.Item key={chat.id} onClick={() => handleSelectChat(chat)} action>
                {chat.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8}>
          <div className="chat-window" style={{ height: '70%', overflowY: 'scroll' }}>
            {selectedChat.messages.map((msg, index) => (
              <div key={index}>{msg}</div>
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