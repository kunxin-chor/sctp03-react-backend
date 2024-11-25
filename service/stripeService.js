// Setup the Stripe library with the STRIPE SECRET KEY
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function createLineItems(orderItems) {
    // line items is in an array of object
    // each object is representing one item the user want to buy (aka one line item)
    // the keys of the line item object is predefined by Stripe
    const lineItems = [];
    for (let item of orderItems) {
        const lineItem = {
            'price_data': {
                'currency':'usd',
                'product_data': {
                    'name': item.productName,
                    // even just one image, must use an array
                    'images': [item.imageUrl],
                    // data of no interest to Stripe but we
                    // need it for so reason can go into metadata
                    'metadata': {
                        product_id: item.product_id
                    }
                },
                // IN CENTS
                'unit_amount': Math.round(item.price * 100)
            },
            'quantity': item.quantity
        }
        lineItems.push(lineItem);
    }
    return lineItems;
}

// this function will create the line items and 
// also the checkout session
async function createCheckoutSession(userId, orderItems, orderId) {

    const lineItems = createLineItems(orderItems);
    console.log(lineItems[0].price_data.product_data);
    const session = await stripe.checkout.sessions.create({
        'payment_method_types':['card'],
        'line_items': lineItems,
        'mode':'payment',
        // on the user's browser, the URL to go to if the payment is successful
        'success_url':'https://www.google.com',
        'cancel_url':'https://www.yahoo.com',
        'metadata': {
            'userId': userId,
            'orderId': orderId
        }
    });
    return session;
}

module.exports = {
    createLineItems, createCheckoutSession
}