const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const db = require('../data/database')
const Stripe = require("stripe")
const publishableKey="pk_live_51NscI7Lx7VH0NwaaMDWy7H7ar2KyydHO0Xw9aR1AMWWnKWAZf1cjZFEucm7yqu85pDkKpoZcHCFpFglwQ0VlCAYd00cITOPxbR"
const secretKey=process.env.stripeSecretKey

const stripe = Stripe(secretKey,{apiVersion:"2023-08-16"})

router.post("/getPublishableKey",(req,res)=>{
  res.json({publishableKey:publishableKey})
})

router.post("/create-payment-intent", async (req,res)=>{
  const amount = req.body.amount
  const customer=req.body.customer
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer:customer},
    {apiVersion:"2023-08-16"}
  )
  try{
   const paymentIntent = await stripe.paymentIntents.create({
     amount: amount*100,
     currency:'usd',
     payment_method_types:['card']
   })
   const clientSecret = paymentIntent.client_secret
   res.json({
    clientSecret:clientSecret,
    ephemeralKey: ephemeralKey.secret,
    id:paymentIntent.id
   })
  }catch(err){
    res.json({error: err.message})
  }
})

router.post("/addOrder",async (req,res)=>{
  const userID = req.body.user
  const time = req.body.time
  const day = req.body.day
  const month = req.body.month
  const package = req.body.package
  const carType = req.body.carType
  const useWater = req.body.useWater
  const price = req.body.price
  const city = req.body.city
  const state = req.body.state
  const address = req.body.address
  const paymentID = req.body.paymentID
  const query = `INSERT INTO WashApp_Orders(
    userID,
    orderTime,
    orderDate,
    orderMonth,
    packageLevel,
    orderCity,
    address,
    State,
    useCustomerWater,
    price,
    carType,
    paymentID,
    status
    ) VALUES(
       ${userID},
       '${time}',
       '${day}',
       '${month}',
       '${package}',
       '${city}',
       '${address}',
       '${state}',
       '${useWater}',
       ${price},
       '${carType}',
       '${paymentID}',
       'ordered'
    )`
  await db.query(query)
  return res.json({message:"order added"})
})

router.post('/refund',async(req,res)=>{
  const paymentId = req.body.id
  const orderId = req.body.order
  const userId = req.body.userId
  const orderTime = req.body.orderTime
  const orderDate = req.body.orderDate
  const orderMonth = req.body.orderMonth
  const packageLevel = req.body.packageLevel
  const city = req.body.orderCity
  const address = req.body.address
  const State = req.body.state
  const useWater = req.body.useWater
  const price = req.body.price
  const carType = req.body.carType
  const queryCheck = `SELECT * FROM railway.WashApp_Orders WHERE OrderID = ${orderId}`
  const check = await db.query(queryCheck)
  if(check[0][0].status === "arrived"){
    return res.json({message:"Washer Has Already Arrived Can Not Refund At This Point"})
  }
  if(check[0].length === 0){
    return res.json({message:"Order Has Been Completed Can Not Cancel Or Refund"})
  }
  const refund = await stripe.refunds.create({
    payment_intent: paymentId
  })
  const query = `DELETE FROM railway.WashApp_Orders WHERE OrderID = ${orderId}`
  await db.query(query)
  const query1 = `INSERT INTO WashApp_Order_History(
    orginal_id,
    orderStatus,
    userID,
    orderTime,
    orderDate,
    orderMonth,
    packageLevel,
    orderCity,
    address,
    State,
    useWater,
    price,
    carType,
    paymentID
    ) VALUES(
      ${orderId},
      'refunded',
       ${userId},
       '${orderTime}',
       '${orderDate}',
       '${orderMonth}',
       '${packageLevel}',
       '${city}',
       '${address}',
       '${State}',
       '${useWater}',
       ${price},
       '${carType}',
       '${paymentId}'
    )`
  await db.query(query1)
  return res.json({message:"Order Refunded"})
})


module.exports = router