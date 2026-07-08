import express from 'express';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js';

const router = express.Router();

router.use(protect); // All category routes require authentication

router.route('/')
    .get(getCategories)
    .post(validateRequest(createCategorySchema), createCategory);

router.route('/:id')
    .put(validateRequest(updateCategorySchema), updateCategory)
    .delete(deleteCategory);

export default router;
