import express from 'express';
import {
    getHomepageContent,
    updateHomepageContent
} from '../controllers/homepageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { updateHomepageSchema } from '../validators/homepageValidator.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getHomepageContent)
    .put(validateRequest(updateHomepageSchema), updateHomepageContent);

export default router;
