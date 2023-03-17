import express from 'express';
import { getAlliceCakes, geticeCakeById, createiceCake, updateiceCakeById, deleteiceCake } from '../services/icecakes.services.js';

const router = express.Router();

// Get all icecakes
router.get('/', async (req, res) => {
  try {
    const icecakes = await getAlliceCakes();
    res.json(icecakes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific icecake by id
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const icecake = await geticeCakeById(id);
      if (!icecake) {
        return res.status(404).send('iceCake not found');
      }
      res.json(icecake);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

// Add a new icecake
router.post('/', async (req, res) => {
    try {
      const { image, itemName, price, description, id } = req.body;
      if (!image || !itemName || !price || !description || !id) {
        return res.status(400).send('Missing required fields');
      }
      const result = await createiceCake(image, itemName, price, description, id);
      res.json({ _id: result.insertedId });
    } catch (err) {
      console.error(err);
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Update a icecake by id
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { image, itemName, price, description } = req.body;
      if (!itemName && !price && !description) {
        return res.status(400).send('At least one field is required');
      }
      const result = await updateiceCakeById(id, image, itemName, price, description);
      if (result.matchedCount === 0) {
        return res.status(404).send('Cake not found');
      }
      res.sendStatus(204);
    } catch (err) {
      
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Delete a icecake by id
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await deleteiceCake(id);
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

