const Stripe = require('stripe');
const { sendResponse } = require("../utils/responseHandler");
const stripe = Stripe('sk_test_51KrXtbHLo4sgkNKUHT9XLWvuxPnFCNzhm7LfyFkueICEaoB8GYvMQ1kyqZJniHYsmKOunCJc3cz1BLvQh2nps0JR00lI1xKGMI');



const payment = async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'PKR',
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        sendResponse(res, 500, error);
    }
};

module.exports = {
    payment,
};