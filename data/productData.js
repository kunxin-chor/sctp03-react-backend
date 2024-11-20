// data access layer for products
const pool = require('../database.js');

async function getAllProducts() {
    // when MySQL returns a decimal value
    // it becomes a string
    // CAST(price AS DOUBLE) -> convert the price into a number
    const [rows] = await pool.query(`SELECT id, name, 
                                CAST(price AS DOUBLE) AS price, image FROM products `);
    return rows;    
}

async function getProductById(id) {
    const [rows] = await pool.query("SELECT * FROM products WHERE id =?", [id]);
    return rows;    
}

// export functions to other JavaScript files
module.exports = {
    getAllProducts, getProductById
}