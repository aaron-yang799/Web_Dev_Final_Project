import React, { useState, useEffect } from 'react'

function ChatWindow() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const userID = localStorage.getItem("userID");
        fetchMessages(userID);
    }, []);

    const fetchMessages = async (userID) => {
        const response = await fetch('http://localhost:8081/messages/${userID}');
        const data = await response.json();
        setMessages(data);
    }

    return (
    <div>
        
    </div>
  )
}

export default ChatWindow
