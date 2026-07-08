import express from 'express';
import {
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection
} from '../controllers/collectionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createCollectionSchema, updateCollectionSchema } from '../validators/collectionValidator.js';

const router = express.Router();

router.use(protect); // All collection routes require authentication

router.route('/')
    .get(getCollections)
    .post(validateRequest(createCollectionSchema), createCollection);

router.route('/:id')
    .put(validateRequest(updateCollectionSchema), updateCollection)
    .delete(deleteCollection);

export default router;
