const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const db = require('../data/database')
const Stripe = require("stripe")
const publishableKey="pk_live_51NscI7Lx7VH0NwaaMDWy7H7ar2KyydHO0Xw9aR1AMWWnKWAZf1cjZFEucm7yqu85pDkKpoZcHCFpFglwQ0VlCAYd00cITOPxbR"
const secretKey=process.env.stripeSecretKey

const stripe = Stripe(secretKey,{apiVersion:"2023-08-16"})


router.post('/addWorker',async(req,res)=>{ 
   const name = req.body.name
   const lastName = req.body.lastName
   const email = req.body.email
   const phoneNumber = req.body.phoneNumber
   const password = req.body.password
   const city  = req.body.city
   const state = req.body.state
   bcrypt.hash(password,10,async(err,hash)=>{
    const query = `INSERT INTO WashApp_Workers (
      FirstName,
      LastName,
      phoneNumber,
      email,
      workerPassword,
      City,
      State
    )VALUES( 
      '${name}',
      '${lastName}',
      '${phoneNumber}',
      '${email}',
      '${hash}',
      '${city}',
      '${state}'
    )`
    await db.query(query)
    return res.json({"message":"it is working"})
   })
})

router.post('/checkData',async (req,res)=>{
  const userName = req.body.userName
  const password = req.body.password
  const query = `SELECT * FROM WashApp_User WHERE email= '${userName}'`
  const user = await db.query(query)  
  if(user[0][0] === undefined){
    return res.json({message: "No User"})
  }
  bcrypt.compare(password,user[0][0].password,async (err,result)=>{
    if(result){
      return res.json({
        user:user[0][0],
      })
    }else{
      return res.json({message:"password not correct"})
    }
  })
})

router.post('/deleteData',async(req,res)=>{
  const email = req.body.user
  const userName = req.body.userName
  console.log(userName)
  const query = `DELETE FROM WashApp_User where email = '${email}'`
  await db.query(query)
  const customer = await stripe.customers.search({
    query: `name:"${userName}"`
  })
  console.log("full customer",customer)
  console.log("herer is the customer",typeof customer.data[0])
  const deleted = await stripe.customers.del(customer.data[0].id)
  return res.json({message:"working"})
})
  


module.exports = router