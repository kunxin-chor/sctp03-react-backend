const productData = require('../data/productData');

async function getAllProducts() {
    // idea for future business logic:
    // 1. may have to pass parameter to getAllProducts to filter by country
    // 2. may have to pass parameter to getAllProducts to get stuff the user will likely 
    // to buy
    const products = await productData.getAllProducts();
    return products;
}

async function getProductById(id) {
    const product = await productData.getProductById(id);
    return product;
}

module.exports = {
    getAllProducts, getProductById
}