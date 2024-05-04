const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const crypto = require('crypto');
const PORT = 8081;


function generateHash(email, password) {
    const hash = crypto.createHash('sha256');
    hash.update(email + password + "123456789"); // our salt is 123456789 lol xd
    console.log(hash)
    return hash.digest('hex').slice(0, 32); // Take the first 32 characters
  }


const app = express()
const http = require('http').Server(app);

app.use(cors())
app.use(express.json())


const databse = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'AaronYang7',
    database: 'webdevtest'
})

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]

    }
});

let users = [];



//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    //Listens and logs the message to the console
    socket.on('message', (data) => {
        try {
            storeMessage(data.fromUserId, data.toUserId, data.message, data.chatId, data.sender_name);
            socketIO.emit('messageResponse', data);
        } catch (error) {
            console.error('Database Error:', error);
        }
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    socket.on('newUser', (data) => {
        //Adds the new user to the list of users
        users.push(data);
        // console.log(users);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
    });

    socket.on('switchChat', (chat_id) => {
        // Fetch messages based on conversationId
        databse.query('SELECT * FROM messages WHERE chat_id = ?', [chat_id], (error, results) => {
          if (error) throw error;
          socket.emit('chatData', results);
        });
      });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);

        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});

function storeMessage(from_user_id, to_user_id, message, chat_id, sender_name) {
    const sql = 'INSERT INTO messages (from_user_id, to_user_id, message, chat_id, sender_name) VALUES (?, ?, ?, ?, ?)';
    return db.execute(sql, [from_user_id, to_user_id, message, chat_id, sender_name]);
}

app.get('/api', (req, res) => {
    res.json({
      message: 'Hello world',
    });
});

  
app.post('/signup', (req, res) => {
    const sql = 'INSERT INTO users (`email`, `hashkey`, `username`, `Birthday`) VALUES (?)';
    const values = [
        req.body.email.join(''),
        generateHash(req.body.email, req.body.password),
        req.body.name.join(''),
        req.body.birthday.slice(0,10)
    ]
    console.log(generateHash("saefsafbib", "fsiefbwi"), values)
    databse.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("error")
        }
        return res.json(data)
    })
})

// Endpoint to send friend requests
app.post('/sendFriendRequest', (req, res) => {
    const sql = 'INSERT INTO Friend_Requests (`From_Email`, `To_Email`, `Status`) VALUES (?, ?, "pending")';
    const values = [req.body.fromEmail, req.body.toEmail];

    database.query(sql, values, (err, data) => {
        if(err) {
            return res.status(500).json({ message: "Error sending friend request", error: err });
        }
        return res.status(200).json({ message: "Friend request sent" });
    });
});

// Endpoint to get pending friend requests
app.get('/getFriendRequests', (req, res) => {
    const sql = 'SELECT * FROM Friend_Requests WHERE `To_Email` = ? AND `Status` = "pending"';
    const values = [req.query.toEmail];

    database.query(sql, values, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error retrieving friend requests", error: err });
        }
        return res.status(200).json(data);
    });
});

// Endpoint to accept friend requests
app.post('/acceptFriendRequest', (req, res) => {
    const sql = 'UPDATE Friend_Requests SET `Status` = "accepted" WHERE `From_Email` = ? AND `To_Email` = ?';
    const values = [req.body.fromEmail, req.body.toEmail];

    database.query(sql, values, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error accepting friend request", error: err });
        }
        return res.status(200).json({ message: "Friend request accepted" });
    });
});


app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE `email` = ? AND `hashkey` = ?';
    databse.query(sql, [req.body.email, generateHash(req.body.email, req.body.password)], (err, data) => {
        if(err) {
            return res.json("error")
        }
        if(data.length > 0){
            return res.json(data)
        }else{
            return res.json("Fail")
        }
    })
})

app.post('/Chat', (req, res) => {
    const sql = 'SELECT chat_id, name, to_user_id FROM chat WHERE `from_user_id` = ?';
    databse.query(sql, [req.userID], (err, data) => {
        if(err) {
            return res.json("error")
        }
        return res.json(data)
    })
});

/*
app.listen(8081, () => {
    console.log('Listening...')
})
*/

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });