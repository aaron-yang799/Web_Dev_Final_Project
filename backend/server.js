const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const databse = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'AaronYang789',
    database: 'testlogindb'
})

app.post('/signup', (req, res) => {
    const sql = 'INSERT INTO login (`username`, `email`, `password`) VALUES (?)';
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    databse.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("error")
        }
        return res.json(data)
    })
})

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM login WHERE `email` = ? AND `password` = ?';
    databse.query(sql, [req.body.email, req.body.password], (err, data) => {
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