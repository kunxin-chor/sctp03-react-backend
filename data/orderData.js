const pool = require("../database");

// get all the orders bu a specific user id
async function getOrdersByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    return rows;
}

// create an order
async function createOrder(userId, orderItems) {
    // get a connection
    const connection = await pool.getConnection();
    try {
        // we will be performing multiple inserts
        // and we need to rollback if any inserts fail
        // so need to begin a transaction
        await connection.beginTransaction();

        // Calculate total order amount
        const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Insert order data
        const [orderResult] = await connection.query("INSERT INTO orders (user_id, total) VALUES (?, ?)", [userId, total]);
        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of orderItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
                [orderId, item.product_id, item.quantity]
            );
        }

        // commit all changes
        await connection.commit();
        return orderId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        // release the connection to the pool
        connection.release();
    }
}

// given an orderid and return the order
async function getOrderDetails(orderId) {
    const [rows] = await pool.query(`
        SELECT
            oi.product_id,
            p.name,
            p.price,
            oi.quantity
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `, [orderId]);

    return rows;
}

// update the order status
async function updateOrderStatus(orderId, status) {
    // validate status before updating
    if (!['created', 'processing', 'completed', 'cancelled'].includes(status)) {
        throw new Error('Invalid status');
    }
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
}

async function updateOrderSessionId(orderId, sessionId) {
    await pool.query('UPDATE orders SET checkout_session_id = ? WHERE id = ?', [sessionId, orderId]);
}

module.exports = {
    getOrdersByUserId,
    createOrder,
    getOrderDetails,
    updateOrderStatus,
    updateOrderSessionId
};