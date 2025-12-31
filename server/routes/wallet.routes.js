import express from 'express';
import {
    createWallet,
    getWallets,
    getWallet,
    updateWallet,
    deleteWallet
} from '../controllers/walletController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createWallet)
    .get(protect, getWallets);

router.route('/:id')
    .get(protect, getWallet)
    .patch(protect, updateWallet)
    .delete(protect, deleteWallet);

export default router;
