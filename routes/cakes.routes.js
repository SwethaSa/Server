import express from 'express';
import { getAllCakes, getCakeById, createCake, updateCakeById, deleteCake } from '../services/cakes.services.js';

const router = express.Router();

// Get all cakes
router.get('/', async (req, res) => {
  try {
    const cakes = await getAllCakes();
    res.json(cakes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific cake by id
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const cake = await getCakeById(id);
      if (!cake) {
        return res.status(404).send('Cake not found');
      }
      res.json(cake);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

// Add a new cake
router.post('/', async (req, res) => {
  try {
    const { image, itemName, price, description, id } = req.body;
    if (!image || !itemName || !price || !description || !id) {
      return res.status(400).send('Missing required fields');
    }
    const result = await createCake(image, itemName, price, description, id);
    res.json({ _id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
// Update a cake by id
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { image, itemName, price, description } = req.body;
      if (!itemName && !price && !description) {
        return res.status(400).send('At least one field is required');
      }
      const result = await updateCakeById(id, image, itemName, price, description);
      if (result.matchedCount === 0) {
        return res.status(404).send('Cake not found');
      }
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Delete a cake by id
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await deleteCake(id);
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

