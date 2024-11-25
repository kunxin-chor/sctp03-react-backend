const express = require('express');
const cors = require('cors'); // enable cross origin resources sharing
require('dotenv').config(); // read the environmental variables from the .env
                            // make sure to have this line before accessing process.env

// import routers
const productRouter = require("./routes/products");
const userRouter = require('./routes/user');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout')

const app = express();

// setup for RESTFul API
// disable global express.json so that it won't interfere
// with the webhook
// app.use(express.json()); // indicate that we are reciving JSON payloads in requests
app.use(cors()); // enable cross origin resources sharing

// Routes Begin Here

app.get("/", function(req,res){
    res.json({
        "message":"hello world"
    })
})

app.use("/api/products", express.json(), productRouter);
app.use("/api/users", express.json(), userRouter);
app.use("/api/cart", express.json(), cartRouter);
app.use('/api/checkout', checkoutRouter);

// No routes after app.listen()

// this is for changing the port when we do deployment later
// because when deploying, port might be a different number
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log("Server started");
})