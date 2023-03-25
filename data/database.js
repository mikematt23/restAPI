const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'containers-us-west-77.railway.app',
  database: "railway",
  user: 'root',
  password: 'hAzu7OB3FEbZmk9CnRty',
  port: '6641'
})

module.exports = pool