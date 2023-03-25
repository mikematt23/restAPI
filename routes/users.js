const express = require('express')
const router = express.Router()
const db = require('../data/database')

router.get('/users',async function(req,res){
  console.log(req)
  console.log('here')
   let query = `SELECT * FROM users`
   return res.json(await db.query(query))
})
router.post('/addUser',async (req,res)=>{
  let userName = req.body.user
  let password = req.body.password
  let email = req.body.email

 await db.query(`INSERT INTO users (usersName,password,email,level,lives) VALUES ('${userName}','${password}','${email}',0,0)`)
 return res.json({message:"it is working"})
})

module.exports = router