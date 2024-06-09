const Stripe = require('stripe');
const { sendResponse } = require("../utils/responseHandler");
const stripe = Stripe(process.env.STRIPE_SECRET);



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