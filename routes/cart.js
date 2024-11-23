const express = require('express');  // <-- require is commonJS (is a way to have modules in JavaScript)
const router = express.Router();
const UserAuth = require('../middlewares/UserAuth')

// import the service layer
const cartService = require('../service/cartService');

// get the current content of the shopping cart
router.get("/", [UserAuth], async function(req,res){
    try {
        const cartItems = await cartService.getCartContents(req.user.userId);
        res.json(cartItems);
    
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.put("/", [UserAuth], async function(req,res){
    try {
        const cartItems = req.body.cartItems;
        await cartService.updateCart(req.user.userId, cartItems);
        res.status(200).json({
            'message':'Cart updated successfully'
        })
        
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

// save or update the current contenet of the shopping cart
router.put("/", async function (req,res){
    res.send("Put Cart Route")
})

module.exports = router;