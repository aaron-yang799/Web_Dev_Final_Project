import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure you have axios installed using 'npm install axios'

function FriendsList() {
    const [friends, setFriends] = useState([]);
    const [email, setEmail] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8081/getFriendRequests', {
                    params: { toEmail: 'yourEmail@example.com' } // Replace with logged-in user email
                });
                setPendingRequests(response.data);
            } catch (error) {
                console.error('Failed to fetch friend requests:', error);
            }
        };

        fetchPendingRequests();
    }, []);

    const handleSendRequest = async (email) => {
        try {
            const response = await axios.post('http://localhost:8081/sendFriendRequest', {
                fromEmail: 'yourEmail@example.com', // This should be the email of the logged-in user
                toEmail: email
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request');
        }
    };

    const handleAcceptRequest = async (fromEmail) => {
        try {
            const response = await axios.post('http://localhost:8081/acceptFriendRequest', {
                fromEmail: fromEmail,
                toEmail: 'yourEmail@example.com' // Replace with logged-in user email
            });
            setPendingRequests(pendingRequests.filter(req => req.From_Email !== fromEmail));
            alert(response.data.message);
        } catch (error) {
            console.error('Error accepting friend request:', error);
            alert('Failed to accept friend request');
        }
    };

    const handleInputChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSendRequest(email);
        setEmail('');
    };

    return (
        <div>
            <h2>Friends List</h2>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        {friend.name} - {friend.status}
                        <button onClick={() => console.log('Start Chat')}>Start Chat</button>
                    </li>
                ))}
            </ul>
            <h2>Pending Friend Requests</h2>
            <ul>
                {pendingRequests.map(request => (
                    <li key={request.From_Email}>
                        {request.From_Email}
                        <button onClick={() => handleAcceptRequest(request.From_Email)}>Accept</button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Friend's email"
                    value={email}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Send Friend Request</button>
            </form>
        </div>
    );
}

export default FriendsList;
