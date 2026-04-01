const mysql = require("mysql2");

const db = mysql.createConnection(process.env.MYSQL_PUBLIC_URL);

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    console.log("ENV URL:", process.env.MYSQL_PUBLIC_URL);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;