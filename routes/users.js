const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const db = require('../data/database')

router.get('/users',async function(req,res){
  console.log(req)
  console.log('here')
   let query = `SELECT * FROM users`
   return res.json(await db.query(query))
})
//
router.post('/addUser',async (req,res)=>{
  const userName = req.body.user
  const password = req.body.password
  const email = req.body.email

  await bcrypt.hash(password, 10, async (err,hash)=>{
    let hashedPassword = hash
    console.log(password,  hashedPassword)
    await db.query(`INSERT INTO users (usersName,password,email,level,lives) VALUES ('${userName}','${hashedPassword}','${email}',0,0)`)
  })
 return res.json({message:"it is working"})
})
//
router.post("/logIn",async (req,res)=>{
  const userName = req.body.user
  const password = req.body.password
  console.log(password)
  
  const query = `SELECT * FROM users WHERE usersName = '${userName}'`
  const user = await db.query(query)
  
  console.log(user[0][0].password)
  await bcrypt.compare(password,user[0][0].password,async (err,result)=>{
    console.log(result)
    let isUser = result
    if(isUser){
      return res.json(user[0][0])
    }else{
      return res.json({message:"password not correct"})
    }
  })
})

module.exports = router