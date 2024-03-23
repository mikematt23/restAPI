const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const db = require('../data/database')



router.post("/workerLogIn",async (req,res)=>{
  const userName = req.body.userName
  const password = req.body.password
  const query1 = `SELECT * FROM WashApp_Workers WHERE email = '${userName}'`
  const worker = await db.query(query1) 
  if(worker[0][0] === undefined){
    return res.json({message:"No Worker"})
  }
  await bcrypt.compare(password, worker[0][0].workerPassword,async(err,result)=>{
    if(result){
      return res.json({worker:worker[0][0]})
    }else{
      return res.json({message:"password incorrect"})
    }
  })
})

router.put("/workerPhoneUpdate",async(req,res)=>{

})

router.put("/workerCityUpdate",async(req,res)=>{

})

router.post("/getOpenOrders",async(req,res)=>{
  const city = req.body.city
  const state = req.body.state
  const day = req.body.day.toString()
  const query = `SELECT * FROM WashApp_Orders WHERE orderCity = "${city}" AND State = "${state}" AND orderDate = "${day}" AND status != "claimed" OR "arrived"`
  const openOrders = await db.query(query)  
  res.json({orders:openOrders[0]})
})

router.put('/claimOrder',async(req,res)=>{
   const order = req.body.orderId
   const workerID = req.body.workerID
   const query = `SELECT * FROM WashApp_Orders WHERE workerID = ${workerID}`
   const hasClaimed = await db.query(query)
   if(hasClaimed[0].length != 0){
    return res.json({message:"Already Have Order"})
   }
   const query1 = `UPDATE WashApp_Orders SET status ="claimed",workerID=${workerID} WHERE OrderID=${order}`
   await db.query(query1)
   const query2 = `UPDATE WashApp_Workers SET ClaimedOrder = 'true' WHERE workerID = ${workerID}`
   await db.query(query2)
   return res.json({message:"Working"})
})

router.post("/getClaimedOrder",async (req,res)=>{
  const workerID = req.body.workerID
  const query = `SELECT * FROM WashApp_Orders WHERE workerID = ${workerID}`
  let order = await db.query(query)
  if(order[0].length === 0){
    return res.json({message:"No Orders"})
  }
  return res.json({order:order[0]})
})

router.put('/arrived',async(req,res)=>{
  const order = req.body.orderID
  const query = `UPDATE WashApp_Orders SET status="arrived" WHERE OrderID = ${order}`
  await db.query(query)
  return res.json({message:"Working"})
})

router.post("/completeOrder",async(req,res)=>{
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
  const workerID = req.body.workerID
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
    paymentID,
    workerID,
    workerPayed
    ) VALUES(
      ${orderId},
      'completed',
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
       '${paymentId}',
       ${workerID},
       'false'
    )`
  await db.query(query1)
  const query = `DELETE FROM railway.WashApp_Orders WHERE OrderID = ${orderId}`
  await db.query(query)
  const query2 = `UPDATE WashApp_Workers SET ClaimedOrder = 'false' WHERE workerID = ${workerID}`
  await db.query(query2)
  return res.json({message:"worker updated and order complete"})
})

router.post("/getWorkerCompletedOrders",async (req,res)=>{
  const workerID = req.body.workerID
  const query = `SELECT * FROM WashApp_Order_History WHERE workerID = ${workerID}`
  const orders = await db.query(query)
  return res.json({orders:orders[0]})
})


module.exports = router