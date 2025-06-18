import express from 'express';
import { createItem, getItems, getItemById } from '../../controllers/item.controller';
// import { authenticate } from '../../middleware/auth'; // Placeholder

const router = express.Router();

// router.use(authenticate); // Apply auth to all item routes

router.post('/', createItem);
router.get('/', getItems);
router.get('/:itemId', getItemById);

// TODO: Add PUT and DELETE routes for items

export default router;
