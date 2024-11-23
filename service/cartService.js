const cartData = require('../data/cartData');

async function getCartContents(userId) {
    // idea for business logic:
    // 1. check existing stock level
    // 2. apply changes to price
    // 3. data analysis and give recommendations
    return await cartData.getCartContents(userId);
}

async function updateCart(userId, cartItems) {
    return await cartData.updateCart(userId, cartItems)
}

module.exports = {
    getCartContents, updateCart
}