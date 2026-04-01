const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
    console.log("MYSQLHOST:", process.env.MYSQLHOST || process.env.DB_HOST);
    console.log("MYSQLUSER:", process.env.MYSQLUSER || process.env.DB_USER);
    console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE || process.env.DB_NAME);
    console.log("MYSQLPORT:", process.env.MYSQLPORT || process.env.DB_PORT);
  } else {
    console.log(" Connected to MySQL database ✅");
    connection.release();
  }
});

module.exports = db;