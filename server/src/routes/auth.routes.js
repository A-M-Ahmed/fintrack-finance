const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/change-password', protect, require('../controllers/authController').changePassword);
router.put('/updatedetails', protect, require('../controllers/authController').updateDetails);

module.exports = router;
