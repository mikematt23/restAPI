const express = require('express')
const router = express.Router()
const path = require('path')
const app = express()
const db = require('./data/database')
const users = require('./routes/users')
const sqlGameRoutes = require('./routes/sqlGameRoutes')

// app.use(express.bodyParser());
app.use(express.json())


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'/index.html'))
})

let port = 3001
app.use(sqlGameRoutes)
app.use(users)
app.listen(port)
console.log(`app listneing on port ${port}`)
