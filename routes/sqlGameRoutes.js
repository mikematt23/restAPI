const express = require('express')
const router = express.Router()
const db = require('../data/database')

router.post('/updateUserLevel',async (req,res)=>{
  let user = req.body.user
  let level = req.body.level

  const query = `UPDATE users SET level = ${level} WHERE usersName = '${user}'`
  await db.query(query)
  return res.json({"message":"Update Worked"})
})

router.post('/updateUserLives',async (req,res)=>{
  const user = req.body.user
  const live = req.body.live

  const query = `UPDATE users SET lives = ${live} WHERE usersName = '${user}'`
  const result = await db.query(query)
  const num = result[0].affectedRows
  let message = {message: ""}
  if(num === 1){
    message.message = "Updated"
  }else{
    message.message = "Error"
  }
  return res.json(message)
})


module.exports = router