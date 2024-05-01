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
    database: 'web_dev_db'
})

app.post('/signup', (req, res) => {
    const sql = 'INSERT INTO User_Info (`Email`, `Hashkey`, `Full_Name`, `Birthday`) VALUES (?)';
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
    const sql = 'SELECT * FROM User_Info WHERE `Email` = ? AND `Hashkey` = ?';
    databse.query(sql, [req.body.email, generateHash(req.body.email, req.body.password)], (err, data) => {
        if(err) {
            return res.json("error")
        }
        if(data.length > 0){
            return res.json("Success")
        }else{
            return res.json("Fail")
        }
    })
})

app.listen(8081, () => {
    console.log('Listening...')
})