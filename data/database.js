const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'monorail.proxy.rlwy.net',
  database: "railway",
  user: 'root',
  password:process.env.dbPassword,
  port: process.env.dbPort
})

module.exports = pool