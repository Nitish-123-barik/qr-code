import express from 'express';
import { login, getProfile, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { loginLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/login', loginLimiter, login);
router.get('/me', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;
