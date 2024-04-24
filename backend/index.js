const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const app = express()
const port = 3001

app.use(cors())

app.get('/api', (req, res) => {
    res.json({message : "Hello from the backend!"})
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

