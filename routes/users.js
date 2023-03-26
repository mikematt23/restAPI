const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const db = require('../data/database')

router.get('/users',async function(req,res){
  console.log(req)
  console.log('here')
   let query = `SELECT * FROM users`
   return res.json(await db.query(query))
})
router.post('/addUser',async (req,res)=>{
  const userName = req.body.user
  const password = req.body.password
  const email = req.body.email

  await bcrypt.hash(password, 10, async (err,hash)=>{
    let hashedPassword = hash
    await db.query(`INSERT INTO users (usersName,password,email,level,lives) VALUES ('${userName}','${hashedPassword}','${email}',0,0)`)
  })
 return res.json({message:"it is working"})
})

module.exports = router