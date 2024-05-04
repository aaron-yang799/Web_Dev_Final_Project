import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

function FriendsList() {
    const { user } = useUser(); // Accessing the current user's data
    const [friends, setFriends] = useState([]);
    const [username, setUsername] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        if (user) { // Ensure there is a user before fetching
            const fetchPendingRequests = async () => {
                try {
                    const response = await axios.get('http://localhost:8081/getFriendRequests', {
                        params: { toUsername: user.username } // Use the logged-in user's username
                    });
                    setPendingRequests(response.data);
                } catch (error) {
                    console.error('Failed to fetch friend requests:', error);
                }
            };

            fetchPendingRequests();
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

    return (
        <div>
            <h2>Friends List</h2>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        {friend.username} - {friend.status}
                        <button onClick={() => console.log('Start Chat')}>Start Chat</button>
                    </li>
                ))}
            </ul>
            <h2>Pending Friend Requests</h2>
            <ul>
                {pendingRequests.map(request => (
                    <li key={request.From_Username}>
                        {request.From_Username}
                        <button onClick={() => handleAcceptRequest(request.From_Username)}>Accept</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Friend's username"
                value={username}
                onChange={handleInputChange}
                required
            />
            <button onClick={handleSendClick}>Send Friend Request</button>
        </div>
    );
}

export default FriendsList;
