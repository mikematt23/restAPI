const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const users = require('./routes/users')
const sqlGameRoutes = require('./routes/sqlGameRoutes')
const blogUserRoutes = require('./routes/blogUserRoutes')
const reduxCartRoutes = require("./routes/reduxCartRoutes")

app.use(cors())
app.use(express.json())
let port = process.env.PORT

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'/index.html'))
})
app.use(sqlGameRoutes)
app.use(users)
app.use(blogUserRoutes)
app.use(reduxCartRoutes)

app.listen(port)
console.log(`app listneing on port ${port}`)
