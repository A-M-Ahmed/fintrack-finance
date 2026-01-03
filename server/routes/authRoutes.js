import express from 'express';
import { registerUser, loginUser, getMe, changePassword, updateDetails, setPin, verifyPin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema, setPinSchema, verifyPinSchema } from '../schemas/authSchemas.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);
router.put('/updatedetails', protect, upload.single('avatar'), updateDetails);
router.post('/set-pin', protect, validate(setPinSchema), setPin);
router.post('/verify-pin', protect, validate(verifyPinSchema), verifyPin);

export default router;
