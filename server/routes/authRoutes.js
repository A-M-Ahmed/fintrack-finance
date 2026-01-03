import express from 'express';
import { registerUser, loginUser, getMe, changePassword, updateDetails } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);
router.put('/updatedetails', protect, upload.single('avatar'), updateDetails);

export default router;
