const express = require('express')
const router = express.Router()
const path = require('path')
const app = express()
const db = require('./data/database')
const sqlGameRoutes = require('./routes/sqlGameRoutes')

// app.use(express.bodyParser());
app.use(express.json())


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'/index.html'))
})
app.get('/users',async function(req,res){
  console.log(req)
  console.log('here')
   let query = `SELECT * FROM users`
   return res.json(await db.query(query))
})
app.post('/addUser',async (req,res)=>{
  let userName = req.body.user
  let password = req.body.password
  let email = req.body.email

 await db.query(`INSERT INTO users (usersName,password,email,level,lives) VALUES ('${userName}','${password}','${email}',0,0)`)
 return res.json({message:"it is working"})
})
let port = process.env.PORT 
app.use(sqlGameRoutes)
app.listen(port)
console.log(`app listneing on port ${port}`)
