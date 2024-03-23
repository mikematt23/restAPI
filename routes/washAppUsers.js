const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const db = require('../data/database')
const Stripe = require("stripe")
const publishableKey="pk_live_51NscI7Lx7VH0NwaaMDWy7H7ar2KyydHO0Xw9aR1AMWWnKWAZf1cjZFEucm7yqu85pDkKpoZcHCFpFglwQ0VlCAYd00cITOPxbR"
const secretKey=process.env.stripeSecretKey

const stripe = Stripe(secretKey,{apiVersion:"2023-08-16"})

router.post("/getWashAppUser",async (req,res)=>{
  const userID = req.body.user
  const query =`SELECT * FROM WashApp_User WHERE UserId = ${userID}`
  const user = await db.query(query)
  res.json({user:user[0][0]})
})

router.post("/userNameCheck",async (req,res)=>{
  const userName= req.body.userName
  const query1 = `SELECT * FROM WashApp_User WHERE UserName = "${userName}"`
  const user = await db.query(query1)
  if(user[0][0] !== undefined){
    return res.json({message: "Taken"})
  }
  if(user[0][0] === undefined){
    return res.json({message:"Available",user:user[0][0]})
  }
})

router.post("/emailCheck",async(req,res)=>{
  const email = req.body.email
  const query = `SELECT * FROM WashApp_User WHERE email = "${email}"`
  const emailCheck = await db.query(query)
  if(emailCheck[0][0] !== undefined){
    return res.json({message:"Taken"})
  }
  return res.json({message:"Available"})
})

router.post('/phoneNumberCheck',async(req,res)=>{
  const phoneNumber = req.body.phoneNumber
  const query = `SELECT * FROM WashApp_User WHERE phoneNumber = "${phoneNumber}"`
  const phoneCheck = await db.query(query)
  if(phoneCheck[0][0] !== undefined){
    return res.json({message:"Taken"})
  }
  return res.json({message:"Available"})
})

router.post('/addWashAppUser',async (req,res)=>{
  const userName = req.body.user
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const password = req.body.password
  const email = req.body.email
  const phoneNumber = req.body.phoneNumber
  const address = req.body.address
  const city =req.body.city
  const state = "Texas"
  await bcrypt.hash(password, 10, async (err,hash)=>{
    let hashedPassword = hash
    if(err){
      return res.json(err)
    }
    await db.query(`INSERT INTO WashApp_User (
          UserName,
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          password,
          city,
          State) 
        VALUES 
        (
          '${userName}',
          '${firstName}',
          '${lastName}',
          '${email}',
          '${phoneNumber}',
          '${address}',
          '${hashedPassword}',
          '${city}',
          '${state}'
         )`)
  })
  const customer = await stripe.customers.create({
    email:email,
    name:userName
  })
  console.log(customer)
 return res.json({message:"it is working",stripeCustomer:customer})
})
//
router.post("/WashAppLogIn",async (req,res)=>{
  const userName = req.body.user
  const password = req.body.password
  const query = `SELECT * FROM WashApp_User WHERE UserName = '${userName}'`
  const user = await db.query(query)  
  if(user[0][0] === undefined){
    return res.json({message: "No User"})
  }
  await bcrypt.compare(password,user[0][0].password,async (err,result)=>{
    if(result){
      const customer = await stripe.customers.search({
        query: `name:"${userName}"`
      })
      return res.json({
        user:user[0][0],
        customer:customer
      })
    }else{
      return res.json({message:"password not correct"})
    }
  })
})

router.post("/getTimes",async (req,res)=>{
    const day = req.body.day
    const city = req.body.city
    const query = `SELECT * FROM WashApp_Orders WHERE orderDate = ${day} AND OrderCity='${city}'`
    const orders = await db.query(query)
    if(orders[0].length === 0){
      return res.json({message:"No Orders"})  
    }
    return res.json(orders[0])
})

router.put("/updateUserAddress",async (req,res)=>{
   const user = req.body.user
   const address = req.body.address
   const query = `UPDATE WashApp_User SET address = '${address}' WHERE UserId = ${user}`
   const update = await db.query(query)
   return res.json({message:"Updated"})
})

router.put("/updateUserPhoneNumber", async (req,res)=>{
  const user = req.body.user
  const phoneNumber = req.body.phoneNumber
  const query = `UPDATE WashApp_User SET phoneNumber = "${phoneNumber}" WHERE UserID = ${user}`
  const update = await db.query(query)
  return res.json({message:"Updated"})
})

router.post("/getUserOrder",async (req,res)=>{
  const user = req.body.user
  const query = `SELECT * from WashApp_Orders WHERE userID = ${user}`
  const userOrders = await db.query(query)
  if(userOrders[0].length === 0){
    return res.json({message:"No Orders"})  
  }
  return res.json(userOrders[0])
})

router.post("/getUserORders",async(req,res)=>{
  const user = req.body.user
  const query = `SELECT * FROM WashApp_Order_History WHERE userID = ${user}`
  const passedOrders = await db.query(query)
  if(passedOrders.length === 0){
    return res.json({message:"No Orders"})
  }
  return res.json(passedOrders[0])
})




module.exports = router