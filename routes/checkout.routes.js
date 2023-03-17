// Import the Stripe library and create a new instance with your secret key
import express from 'express';
import {auth} from '../middleware/auth.js';
import {getAllCart } from '../services/carts.services.js';
import stripe from 'stripe';
const stripeSecretKey = 'sk_test_51MmC4TSBtToua9svf4Kh14GKIexHjGyBA674lPB5amWws7uWGncUFM8TLwTUiT1pcw3WAmym4V0O8xqFo0NypxT700T2dBzMWa';
const stripeClient = new stripe(stripeSecretKey);
const router = express.Router();




// Define the checkout endpoint
router.post('/', auth, async (req, res) => {
  try {
    // Get the authenticated user's email
    const userEmail = req.user.email;

    // Retrieve the user's cart items from your MongoDB database
    const cartItems = await getAllCart(userEmail);

    // Create a line item for each cart item
    const lineItems = cartItems.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      };
    });

    // Create a checkout session with Stripe
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/payment',
      cancel_url: 'http://localhost:3000/cart',
    });

    // Send the checkout session ID to the client
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


export default router;