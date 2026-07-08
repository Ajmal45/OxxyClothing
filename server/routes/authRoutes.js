import express from 'express';
import { loginAdmin, logoutAdmin, getAdminProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema } from '../validators/authValidator.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Stricter rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login requests per `window`
    message: 'Too many login attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login', loginLimiter, validateRequest(loginSchema), loginAdmin);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getAdminProfile);

export default router;
