import express from 'express';
import { getAllFondantCakes, getFondantCakeById, createFondantCake, updateFondantCakeById, deleteFondantCake } from '../services/fondant.services.js';

const router = express.Router();

// Get all fondantcakes
router.get('/', async (req, res) => {
  try {
    const fondantcakes = await getAllFondantCakes();
    res.json(fondantcakes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific fondantcakes by id
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const fondantcake = await getFondantCakeById(id);
      if (!fondantcake) {
        return res.status(404).send('Cake not found');
      }
      res.json(fondantcake);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

// Add a new fondantcake
router.post('/', async (req, res) => {
    try {
      const { image, itemName, price, description, id } = req.body;
      if (!image || !itemName || !price || !description || !id) {
        return res.status(400).send('Missing required fields');
      }
      const result = await createFondantCake(image, itemName, price, description, id);
      res.json({ _id: result.insertedId });
    } catch (err) {
      console.error(err);
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Update a fondantcake by id
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { image, itemName, price, description } = req.body;
      if (!itemName && !price && !description) {
        return res.status(400).send('At least one field is required');
      }
      const result = await updateFondantCakeById(id, image, itemName, price, description);
      if (result.matchedCount === 0) {
        return res.status(404).send('Cake not found');
      }
      res.sendStatus(204);
    } catch (err) {
      
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Delete a fondantcake by id
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await deleteFondantCake(id);
      if (result.deletedCount === 0) {
        return res.status(404).send('Cake not found');
      }
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
export default router;

