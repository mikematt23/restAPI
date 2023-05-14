const express = require('express')
const router = express.Router()
const db = require('../data/database')


router.post("/addCart",async (req,res)=>{
   const cartItems = JSON.stringify(req.body.cartItems)
   console.log(cartItems)
   const query = `INSERT INTO reducCart (items) VALUES('${cartItems}')`
   await db.query(query)

   return res.json({message:"added"})
})


module.exports = router