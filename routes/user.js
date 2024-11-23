const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const jwt = require('jsonwebtoken');

// register your routes
router.post("/register", async function(req,res){
    try {
        const userId = await userService.registerUser(req.body);
        res.status(200).json({
            "message":"New user created",
            "userId": userId
        })

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.post("/login", async function(req,res){
   try {
    const {email, password} = req.body;
    const user = await userService.loginUser(email, password);
    const token = jwt.sign({
        userId: user.id,
        email: user.email,
        name: user.name
    }, process.env.JWT_SECRET, { expiresIn: "1h"})
    res.json({
        "message":"Login successful",
        "token": token
    })
   } catch(error) {
    res.status(401).json({
        message: error.message
    }) 
   } 
})

// export routes
module.exports = router;