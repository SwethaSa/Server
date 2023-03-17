import express from 'express';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {auth} from '../middleware/auth.js';
import { findCake, findCart, updateCart, deleteCake, updateCartVar, findCakeOne, clearCart, getAllCart } from '../services/carts.services.js';
const router = express.Router();
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URL = process.env.MONGO_URL;
export const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connected to MongoDB server');
});

// Add a cake to cart
router.post('/:id/add-to-cart', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userEmail = req.user.email;
    if (!quantity) {
      return res.status(400).send('Quantity is required');
    }

    const cake = await findCake(id);
    if (!cake) {
      return res.status(404).send('Cake not found');
    }

    const cartItem = await findCart(id);

    let updatedPrice = cake.price;
    let updatedQuantity = parseInt(quantity, 10);
    let updatedImage = cake.image;
    let updatedName = cake.itemName;

    if (cartItem) {
      updatedQuantity += cartItem.quantity;
      updatedPrice = cartItem.price;
      updatedImage = cartItem.image;
      updatedName = cartItem.name;
    }

    const result = await updateCartVar(id, updatedPrice, updatedQuantity, updatedImage, updatedName, userEmail);

    res.status(200).send('Item added to cart successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});




// Remove a cake from cart
router.delete('/:id/remove-from-cart', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCake(id);
    if (result.deletedCount === 0) {
      return res.status(404).send('Cake not found in cart');
    }
    const cake = await findCakeOne(id);
    res.status(200).send(`Cake removed from cart`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Clear all items from cart
router.delete('/clear-cart', auth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const result = await clearCart(userEmail);
    res.status(200).send('Cart cleared successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const id = req.params.id;
    const quantity = req.body.quantity;
    const result = await updateCart(userEmail, id, quantity);
    res.status(200).send('Cart item updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});




// Get all items in cart
router.get('/', auth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const cartItems = await getAllCart(userEmail);
    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});




  export default router;

