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
    host: 'localhost',
    user: 'root',
    password: '312665Zss###',
    database: 'yap_db'
})

app.post('/signup', (req, res) => {
    const sql = 'INSERT INTO yap_user (`Email`, `Hashkey`, `Full_Name`, `Birthday`) VALUES (?)';
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

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM yap_user WHERE `Email` = ? AND `Hashkey` = ?';
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