
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mailCheck, insertUser, findMail, getUserByEmail } from '../services/users.services.js';
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import cors from "cors";
import {auth} from '../middleware/auth.js';


dotenv.config();

const router = express.Router();
router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: 'Content-Type'
}));

const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const collection =  client.db('Aadithya').collection('useractivity');
client.connect(err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Connected to MongoDB server");
});

function logUserActivity(email, action) {
  const activity = {
    email: email,
    action: action,
    timestamp: new Date()
  };
  collection.insertOne(activity, function (err, res) {
    if (err) throw err;
    console.log('User activity logged');
  });
}



// Register a new user
router.post('/signup', async (req, res) => {
  try {
    console.log(req.body)
    const { firstName, lastName, email, password, phone } = req.body;
    // Check if email already exists
    const existingUser = await mailCheck(email);
    if (existingUser) {
      return res.status(400).json({ msg: 'OOPS!!👀Email already exists' });
    } if (!email || !password || !firstName || !phone) {
      return res.status(400).json({ msg: "All the fields are required" })
    }
    
    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const user = await insertUser(firstName, lastName, email, hashedPassword, phone);
    return res.status(201).json({ msg: 'User created Successfully😍👍' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


  

// // Login a user
router.post('/login',   async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the email exists
    if (!email || !password) {
      return res.status(400).json({ msg: "All the fields are required" })
    }
    const user = await findMail(email);
    if (!user) {
      return res.status(400).json({ msg: 'OOPS!!👀Invalid Credentials' });
    }
    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'OOPS!!👀Invalid Credentials' });
    }
    console.log(user._id);
    // Create and assign a token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '2h' });
logUserActivity(user.email, 'login');
return res.status(200).cookie('token', token, {
  maxAge: 7200000, // set the cookie to expire after 2 hours
  httpOnly: true,
  secure: true,
  sameSite: 'none'
}).json({ user: { email: user.email, firstName: user.firstName }, token });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

    // Logout a user
    router.get('/logout', auth, async (req, res) => {
        try {
          
console.log(req.user);
          logUserActivity(req.user.email, 'logout');
          res.clearCookie('token').sendStatus(200);
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      });
      router.get('/', auth, async (req, res) => {
        try {
          const user = await getUserByEmail(req.user.email);
          return res.json({ email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone });
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      });
      
    
    export default router;
