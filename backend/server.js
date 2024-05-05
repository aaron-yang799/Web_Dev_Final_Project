const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const crypto = require('crypto');

function generateHash(email, password) {
    const hash = crypto.createHash('sha256');
    hash.update(email + password + "123456789"); // our salt is 123456789 lol xd
    console.log(hash)
    return hash.digest('hex').slice(0, 32); // Take the first 32 characters
  }


const app = express()
app.use(cors())
app.use(express.json())

const databse = mysql.createConnection({
    host: 'web-final-db.cnge86iqy455.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'webDevFinal',
    database: 'webdevdb'
})

app.post('/signup', (req, res) => {
    const sql = 'INSERT INTO users (`email`, `hashkey`, `username`, `birthday`) VALUES (?)';
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

app.post('/sendFriendRequest', (req, res) => {
    const { fromUsername, toUsername } = req.body;
    if (fromUsername === toUsername) {
        return res.status(400).json({ message: "Cannot send friend request to yourself." });
    }

    // SQL to check for existing friend requests
    const checkSql = `
        SELECT * FROM Friend_Requests 
        WHERE (From_Username = ? AND To_Username = ?) OR (From_Username = ? AND To_Username = ?)
    `;

    databse.query(checkSql, [fromUsername, toUsername, toUsername, fromUsername], (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ message: "Error checking friend requests", error: err });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: "Friend request already exists." }); // 409 Conflict
        }

        // If no existing request, proceed to insert the new friend request
        const insertSql = 'INSERT INTO Friend_Requests (From_Username, To_Username, Status) VALUES (?, ?, "pending")';
        databse.query(insertSql, [fromUsername, toUsername], (insertErr, insertData) => {
            if (insertErr) {
                console.error("SQL Error:", insertErr);
                return res.status(500).json({ message: "Error sending friend request", error: insertErr });
            }
            return res.status(200).json({ message: "Friend request sent successfully" });
        });
    });
});

// Endpoint to remove friend
app.post('/removeFriend', (req, res) => {
    const { username, friendUsername } = req.body;
    
    // SQL to delete the friend relationship
    const sql = `
        DELETE FROM Friend_Requests
        WHERE (From_Username = ? AND To_Username = ? AND Status = 'accepted')
        OR (From_Username = ? AND To_Username = ? AND Status = 'accepted')
    `;

    databse.query(sql, [username, friendUsername, friendUsername, username], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ message: "Error removing friend", error: err });
        }
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Friend removed successfully" });
        } else {
            return res.status(404).json({ message: "Friend not found" });
        }
    });
});



// Endpoint to get pending friend requests using usernames
app.get('/getFriendRequests', (req, res) => {
    const sql = 'SELECT * FROM Friend_Requests WHERE `To_Username` = ? AND `Status` = "pending"';
    const values = [req.query.toUsername];

    databse.query(sql, values, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error retrieving friend requests", error: err });
        }
        return res.status(200).json(data);
    });
});


// Endpoint to accept friend requests using usernames
app.post('/acceptFriendRequest', (req, res) => {
    const sql = 'UPDATE Friend_Requests SET `Status` = "accepted" WHERE `From_Username` = ? AND `To_Username` = ?';
    const values = [req.body.fromUsername, req.body.toUsername];

    databse.query(sql, values, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error accepting friend request", error: err });
        }
        return res.status(200).json({ message: "Friend request accepted" });
    });
});

// Endpoint to get a list of friends
app.get('/getFriends', (req, res) => {
    const username = req.query.username; // Get username from query parameters
    const sql = `
        SELECT CASE
            WHEN From_Username = ? THEN To_Username
            WHEN To_Username = ? THEN From_Username
        END AS FriendUsername
        FROM Friend_Requests
        WHERE (From_Username = ? OR To_Username = ?) AND Status = 'accepted'
    `;

    databse.query(sql, [username, username, username, username], (err, results) => {
        if (err) {
            console.error("Error fetching friends:", err);
            return res.status(500).json({ message: "Error fetching friends", error: err });
        }
        return res.status(200).json(results);
    });
});


app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE `email` = ? AND `hashkey` = ?';
    databse.query(sql, [req.body.email, generateHash(req.body.email, req.body.password)], (err, data) => {
        if(err) {
            return res.json("error")
        }
        if(data.length > 0){
            return res.json(data[0])
        }else{
            return res.json("Fail")
        }
    })
})

app.get('/messages/:userID', (req, res) => {
    const sql = 'SELECT * FROM messages WHERE userID_from = ?';
    databse.query(sql, [req.query.to], (err, data) => {
        if(err) {
            return res.json("error")
        }
        return res.json(data)
    })
})

app.get('/chats/:userID', (req, res) => {
    const sql = `
        SELECT c.chatID, c.chatName, c.creation_date
        FROM chat c
        JOIN membership m ON c.chatID = m.chat_id
        WHERE m.user_id = ?;
    `;
    databse.query(sql, [req.params.userID], (err, data) => {
        if(err) {
            return res.json("error")
        }
        return res.json(data)
    })
})

app.get('/allmessages/:chatID', (req, res) => {
    const sql = 'SELECT messageID, message, username FROM message WHERE chatID = ?';
    databse.query(sql, [req.params.chatID], (err, data) => {
        if(err) {
            return res.json("error")
        }
        return res.json(data)
    })
})

app.post('/messages/:chatID', (req, res) => {
    const sql = 'INSERT INTO message (`chatID`, `message`, `username`) VALUES (?, ?, ?)';
    const values = [req.params.chatID, req.body.message, req.body.username];
    databse.query(sql, values, (err, insertData) => {
        if(err) {
            return res.json("error")
        }

        const selectSql = 'SELECT * FROM message WHERE messageID = ?';
        databse.query(selectSql, [insertData.insertId], (selectErr, selectData) => {
            if (selectErr) {
                console.error(selectErr);  // Log the error for debugging purposes
                return res.status(500).json({ message: "Error fetching the inserted message", error: selectErr });
            }
            if (selectData.length > 0) {
                return res.status(201).json(selectData[0]);
            } else {
                return res.status(404).json({ message: "Inserted message not found" });
            }
        });
    })
})

// app.post('/startChat', (req, res) => {
//     const { user1, user2} = req.body;
//     const sql = `INSERT INTO chat (user1, user2) VALUES (?, ?)`;
//     const values = [user1, user2];
//     databse.query(sql, values, (err, result) => {
//         if (err) {
//             console.error("SQL Error", err);
//             return res.status(500).json({ message: "Error checking chat", error: err });
//         }
//         return res.status(200).json({ chatID: result.insertId });
//     });
// });

app.post('/startChat', (req, res) => {
    const{ user1, user2} = req.body;
    
    //INSERT into chat, get back the insert ID
    
    const sql = "INSERT INTO chat (chatName) VALUES (?);";
    const values = [user1+" - "+user2];
    let chatID = ''; 
    databse.query(sql, values, (err, result) => {
        if(err) {
            console.error("SQL Error", err);
            return res.status(500).json({message: "Error starting chat", error: err});
        }
        chatID = result.insertID; 
    });
    const userSQL = "SELECT userID FROM users WHERE username IN (?, ?);";
    const userValues = [user1, user2];
    let userIDs = [];
    databse.query(sql, values, (err, result) => {
        if(err) {
            console.error("SQL Error", err);
            return res.status(500).json({message: "Error starting chat", error: err});
        }
        userIDs = result;
    });
    console.log(chatID, ' ', userIDs);
    console.log(userValues);
    const insertSQL = "INSERT INTO membership VALUES (?, ?), (?, ?);";
    const insertValues = [chatID, userIDs[0], chatID, userIDs[1]];
    databse.query(sql, values, (err, result) => {
        if(err) {
            console.error("SQL Error", err);
            return res.status(500).json({message: "Error inserting members for  chat", error: err});
        }
        
    return res.status(200).json({ chatID: chatID});
    });
});

app.post('/newChat', (req, res) => {
    const sql = `INSERT INTO chat (chatName) VALUES (?)`;
    databse.query(sql, [req.body.friendName], (err, insertData) => {
        if (err) {
            console.error("SQL Error", err);
            return res.status(500).json({ message: "Error checking chat", error: err });
        }

        const sql4= `SELECT chatID FROM chat WHERE chatName = ?`;
        databse.query(sql4, [req.body.friendName], (err, dataa) => {
            if (err) {
                console.error("SQL Error", err);
                return res.status(500).json({ message: "Error checking chat", error: err });
            }
            const chatID = dataa[0].chatID;

        const sql2 = `INSERT INTO membership (chat_id, user_id) VALUES (?, ?)`;
        databse.query(sql2, [chatID, req.body.userID], (err, data) => {
            if (err) {
                console.error("SQL Error", err);
                return res.status(500).json({ message: "Error checking chat", error: err });
            }
            const sql3 = `INSERT INTO membership (chat_id, user_id) VALUES (?, ?)`;
            databse.query(sql3, [chatID, req.body.friendID], (err, result) => {
                if (err) {
                    console.error("SQL Error", err);
                    return res.status(500).json({ message: "Error checking chat", error: err });
                }        
                return res.status(200).json({ chatID: insertData.insertID });
            });
            
        });

    });
    });
});

app.get('/friendID/:friendUsername', (req, res) => {
    const sql = 'SELECT userID FROM users WHERE username=?';
    databse.query(sql, [req.params.friendUsername], (err, data) => {
        if(err) {
            return res.json("error")
        }
        return res.json(data[0]);
    })
})

app.listen(8081, () => {
    console.log('Listening...')
})