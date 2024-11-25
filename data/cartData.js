const pool = require('../database');

async function getCartContents(userId) {

    // use a prepared statement to query the database
    //  to prevent SQL injections
    const [rows] =  await pool.query(
        `SELECT cart_items.id, 
            product_id, 
            name AS productName,
            image AS imageUrl, 
            CAST(price AS DOUBLE) AS price, 
            quantity
          FROM
            cart_items JOIN products
            ON cart_items.product_id = products.id       
          WHERE user_id = ?
        `, [userId]
    );
    return rows;

}

// cartItems is the array of objects from the React shopping cart
async function updateCart(userId, cartItems) {
    const connection = await pool.getConnection();
    try {
        // begin a transaction. No changes to the database is finalized
        // until connection.commit() is called
        await connection.beginTransaction();

        // empty the user's shopping cart
        await connection.query(`DELETE FROM cart_items WHERE user_id=?`, [userId]);

        // insert in all the items from the shopping cart
        for (const item of cartItems) {
            await connection.query(
                `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`,
                [userId, item.product_id, item.quantity]
            )
        }

        await connection.commit();
    } catch (e) {
        await connection.rollback();
    } finally {
        // always release connection regardless of error or not
        connection.release();
    }
}

module.exports = {
    getCartContents, updateCart
}