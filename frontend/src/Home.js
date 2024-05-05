import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import "./Home.css";
import FriendsList from './components/friendslist';  // Verify this path is correct
import { useUser } from './components/UserContext';


function Home() {
  const { user } = useUser(); // Accessing the current user's data
  
  const [chats, setChats] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [newChat, setNewChat] = useState(null);

  useEffect(() => {
    const makeNewChat = async (userID, friendID) => {
      try {
        const fname = localStorage.getItem('friendName');
        const response = await axios.post(`http://localhost:8081/newChat`, { 
            userID: userID, 
            friendID: friendID,
            friendName: fname
          });
      } catch (error) {
        console.error(error);
      }
      fetchChats(user.userID);
    }
    if (newChat != null) {
        makeNewChat(user.userID, newChat);
    }
    
  },[newChat]);

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
            setSelectedChat(chats[0]);
        }
    }, [chats]);

    useEffect(() => {
                const fetchMessages = async (chatID) => {
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
                <Col md={0}>
                    <FriendsList
                    onSendData={(data) => setNewChat(data)}/>
                </Col>
                <Col md={3}>
                    <ListGroup>
                        {chats && chats.map(chat => (
                            <ListGroup.Item className="chat-btn" key={chat.chatID} onClick={() => handleSelectChat(chat)} action>
                                {chat.chatName}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={6}>
                    <div className="chat-window">
                        <div className='chat-messages'>
                            {messages && messages.map(message => (
                                <div key={message.messageID} className="message">{message.username}: {message.message}</div>
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
