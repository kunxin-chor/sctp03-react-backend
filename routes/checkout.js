const express = require('express');
const router = express.Router();
const UserAuth = require('../middlewares/UserAuth');
const checkoutService = require('../service/checkoutService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const orderService = require('../service/orderService')


router.post("/", UserAuth, async function(req,res){
    try {
        const session = await checkoutService.checkout(req.user.userId);
        res.json(session);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            'message': e.message
        })
    }
})

router.post('/webhook',
    express.raw({type:"application/json"}),
    async function(req,res) {
        let event = null;
        try {
            // 1. verify that the call is actually from Stripe
            const sig = req.headers['stripe-signature']; // when Stripe sends you a webhook request, there's always a signature
                                                         // from the WEBHOOK_SECRET, we can see if the signature is really from Stripe
        
            // construct the event and verify if it is really from Stripe
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

            if (event.type === "checkout.session.completed") {
                const session = event.data.object;
                const orderId = session.metadata.orderId;
                await orderService.updateOrderStatus(orderId, "processing");
            }

            res.sendStatus(200);

         } catch (e) {
          console.error(e);
          return res.status(500)
            .send('Webhook error: ' + e.message);
        }
    }
)

 module.exports = router;