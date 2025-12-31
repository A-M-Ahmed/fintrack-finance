import express from 'express';
import { registerUser, loginUser, getMe, changePassword, updateDetails } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);
router.put('/updatedetails', protect, upload.single('avatar'), updateDetails);

export default router;
