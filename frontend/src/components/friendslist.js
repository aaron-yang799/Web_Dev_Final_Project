import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

function FriendsList(
    {selectedChat,
    setSelectedChat}
) {
    const { user } = useUser(); // Accessing the current user's data
    const [friends, setFriends] = useState([]);
    const [username, setUsername] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchPendingRequests = async () => {
                const response = await axios.get('http://localhost:8081/getFriendRequests', {
                    params: { toUsername: user.username }
                });
                setPendingRequests(response.data);
            };

            const fetchFriends = async () => {
                const response = await axios.get('http://localhost:8081/getFriends', {
                    params: { username: user.username }
                });
                setFriends(response.data); // Set the friends list
            };

            fetchPendingRequests();
            fetchFriends();
        }
    }, [user]); // Depend on the user state

    const handleSendRequest = async (username) => {
        if (user) { // Ensure there is a user before sending a request
            try {
                const response = await axios.post('http://localhost:8081/sendFriendRequest', {
                    fromUsername: user.username, // Use the logged-in user's username
                    toUsername: username
                });
                alert(response.data.message);
            } catch (error) {
                console.error('Error sending friend request:', error);
                alert('Failed to send friend request');
            }
        }
    };

    const handleRemoveFriend = async (friendUsername) => {
        try {
            const response = await axios.post('http://localhost:8081/removeFriend', {
                username: user.username, // The logged-in user's username
                friendUsername: friendUsername // The username of the friend to remove
            });
            if (response.status === 200) {
                setFriends(currentFriends => currentFriends.filter(f => f.FriendUsername !== friendUsername));
                alert('Friend removed successfully.');
            } else {
                alert('Failed to remove friend.');
            }
        } catch (error) {
            console.error('Error removing friend:', error);
            alert('Failed to remove friend.');
        }
    };
    

    const handleAcceptRequest = async (fromUsername) => {
        if (user) { // Ensure there is a user before accepting a request
            try {
                const response = await axios.post('http://localhost:8081/acceptFriendRequest', {
                    fromUsername: fromUsername,
                    toUsername: user.username // Use the logged-in user's username
                });
                setPendingRequests(pendingRequests.filter(req => req.From_Username !== fromUsername));
                alert(response.data.message);
            } catch (error) {
                console.error('Error accepting friend request:', error);
                alert('Failed to accept friend request');
            }
        }
    };

    const handleInputChange = (event) => {
        setUsername(event.target.value);
    };

    const handleSendClick = () => {
        handleSendRequest(username);
        setUsername(''); // Clear the input after sending the request
    };

    const handleStartChat = async (friendUsername) => {
        try {
            const response = await axios.post('http://localhost:8081/startChat', {
                user1: user.username,
                user2: friendUsername
            });
            const chatID = response.data.chatID;
            setSelectedChat({
                ...selectedChat,
                chatID: chatID
            })
            console.log('Starting chat');
        } catch (error) {
            console.error('Error starting chat:', error);
            alert('Failed to start chat');
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '10px' }}>Friends List</h2>
            <ul className="friends-list">
                {friends.map(friend => (
                    <li key={friend.FriendUsername} className="friend-item">
                        <span className="friend-name">{friend.FriendUsername}</span>
                        <div className="friend-buttons">
                        <button onClick={() => handleStartChat(friend.FriendUsername)}>Start Chat</button>
                        <button onClick={() => handleRemoveFriend(friend.FriendUsername)} style={{ marginLeft: '10px' }}>Remove Friend</button>
                        </div>
                    </li>
                ))}
            </ul>
            <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>Pending Friend Requests</h2>
            <ul>
                {pendingRequests.map(request => (
                    <li key={request.From_Username}>
                        {request.From_Username}
                        <button onClick={() => handleAcceptRequest(request.From_Username)}>Accept</button>
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: '20px' }}>
            <input
                type="text"
                placeholder="Friend's username"
                value={username}
                onChange={handleInputChange}
                required
            />
            <button onClick={handleSendClick} className='chat-btn'>Send Friend Request</button>
            </div>
        </div>
    );
}

export default FriendsList;
