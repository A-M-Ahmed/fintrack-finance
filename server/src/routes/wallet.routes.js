const express = require('express');
const router = express.Router();
const {
    createWallet,
    getWallets,
    getWallet,
    updateWallet,
    deleteWallet
} = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createWallet)
    .get(protect, getWallets);

router.route('/:id')
    .get(protect, getWallet)
    .patch(protect, updateWallet)
    .delete(protect, deleteWallet);

module.exports = router;
