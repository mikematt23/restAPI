const express = require('express')
const path = require('path')
const app = express()
const users = require('./routes/users')
const sqlGameRoutes = require('./routes/sqlGameRoutes')

app.use(express.json())
let port = process.env.PORT

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'/index.html'))
})
app.use(sqlGameRoutes)
app.use(users)

app.listen(3001)
console.log(`app listneing on port ${port}`)
