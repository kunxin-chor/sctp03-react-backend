const mysql = require('mysql2/promise');

// A pool basically is a pool of MySQL connections
// it allows Express to have multiple connections to the MySQL at the same time
// it's more efficient and faster than managing a single connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // if all connections are in use, Express will wait for a new one to be available
    connectionLimit: 10, // up to 10 concurrent connections to MySQL
    queueLimit: 0 // can wait forever until a connection is available
});

module.exports = pool;  // export default pool (if using React syntax)