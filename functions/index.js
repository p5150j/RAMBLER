const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

const stripeSecret = defineSecret("STRIPE_SECRET_KEY");

admin.initializeApp();

console.log("Function starting...");

exports.createPaymentIntent = onRequest(
  {
    secrets: [stripeSecret],
    cors: ["http://localhost:3000", "http://127.0.0.1:3000"],
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const stripe = require("stripe")(stripeSecret.value());
    const { amount, currency = "usd" } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });
      res.status(200).send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  }
);
