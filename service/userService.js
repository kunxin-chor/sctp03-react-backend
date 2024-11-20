const userData = require('../data/userData');
const bcrypt = require('bcrypt');

async function registerUser({name, email, password, salutation, marketingPreferences, country }) {
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters in length");
    }

    // email addresses must be unique
    const existingUser = await userData.getUserByEmail(email);
    if (existingUser) {
        throw new Error("Email already in use");
    }

    // hash our password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userData.createUser({
        name, 
        email,
        password: hashedPassword,
        salutation,
        marketingPreferences,
        country
    });
    return userId;
}

async function loginUser(email, password) {
    // try the user  by the email
    const user = await userData.getUserByEmail(email);
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    return user;
}

module.exports = {
    registerUser, loginUser
}