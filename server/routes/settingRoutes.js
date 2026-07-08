import express from 'express';
import {
    getSettings,
    updateSettings
} from '../controllers/settingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { updateSettingSchema } from '../validators/settingValidator.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getSettings)
    .put(validateRequest(updateSettingSchema), updateSettings);

export default router;
