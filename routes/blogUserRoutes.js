const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const db = require('../data/database')


router.post('/getBlogUser',async (req,res)=>{
  const userName = req.body.user
  const password = req.body.password
  const query = `SELECT * FROM blog_users WHERE userName = '${userName}'`
  const user = await db.query(query)
  console.log(user[0][0])
  if(user[0][0] === undefined){
    return res.json({message:"No User"})
  }
  await bcrypt.compare(password,user[0][0].password,async (err,result)=>{
    if(result){
      return res.json(user[0][0])
    }else{
      return res.json({message:"password not correct"})
    }
  })
})

router.post("/addBlogUser",async (req,res)=>{
  const userName = req.body.user
  const password =req.body.password
  const email = req.body.email

  const query = `SELECT * FROM blog_users WHERE userName = '${userName}'`
  const user = await db.query(query)
  const emailCheck = `SELECT * FROM blog_users WHERE email = '${email}'`
  const emailUsed = await db.query(emailCheck)

  if(user[0][0] !== undefined){
    return res.json({message:"already a user"})
  }
  if(emailUsed[0][0] !== undefined){
    return res.json({message:"email already Used"})
  }

  bcrypt.hash(password, 10, async (err,hash)=>{
    let hashedPassword = hash
    const query = `INSERT INTO blog_users(userName,email,password) VALUES('${userName}','${email}','${hashedPassword}')`
    db.query(query)
    if(err){
      return res.json({err:err})
    }
  })
  return res.json({message: "added"})
})



module.exports = router