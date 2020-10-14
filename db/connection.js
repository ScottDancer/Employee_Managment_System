require("dotenv").config()
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "employees_db",
})

connection.connect(err => {
  // console.log("Connected")
  if(err) throw err 
})

module.exports = connection;