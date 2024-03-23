const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const washAppUserRoutes = require("./routes/washAppUsers")
const washAppOrderRoutes = require("./routes/washAppOrders")
const washAppWorkRoutes = require('./routes/washAppWork')
const washAppAdminRoutes = require('./routes/washAppAdmin')

'test'

app.use(cors())
app.use(express.json())
let port = process.env.PORT 

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'/index.html'))
})

app.use(washAppUserRoutes)
app.use(washAppOrderRoutes)
app.use(washAppWorkRoutes)
app.use(washAppAdminRoutes)

app.listen(port)
console.log(`app listneing on port ${port}`)
