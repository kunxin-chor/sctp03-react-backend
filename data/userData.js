const pool = require('../database')

async function getUserByEmail(email) {
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );

    return rows[0];
}

async function createUser({ name, email, password, salutation, country, marketingPreferences }) {
    // getting a connection so that we can begina  transaction
    const connection = await pool.getConnection();

    try {
        // begin a new transaction -- all changes to the database is
        // temporary
        await connection.beginTransaction();


        // Insert user data
        const [userResult] = await connection.query(
            `INSERT INTO users (name, email, password, salutation, country) VALUES (?, ?, ?, ?, ?)`,
            [name, email, password, salutation, country]
        );
        const userId = userResult.insertId;

        // Insert marketing preferences (will be either "sms" or "email")
        if (Array.isArray(marketingPreferences)) {
            for (const preference of marketingPreferences) {
                // Retrieve preference ID from marketing_preferences table
                const [preferenceResult] = await connection.query(
                    `SELECT id FROM marketing_preferences WHERE preference = ?`,
                    [preference]
                );

                // Check if the preference exists
                if (preferenceResult.length === 0) {
                    throw new Error(`Invalid marketing preference: ${preference}`);
                }

                const preferenceId = preferenceResult[0].id;

                // Insert into user_marketing_preferences table
                await connection.query(
                    `INSERT INTO user_marketing_preferences (user_id, preference_id) VALUES (?, ?)`,
                    [userId, preferenceId]
                );
            }
        }
        

        // finalize all changes in the database
        await connection.commit();
        return userId;
    } catch (error) {
        await connection.rollback(); // if any errors occur int the try block, undo all database changes since beginTransaction()
    }
}

module.exports = {
    getUserByEmail, createUser
}