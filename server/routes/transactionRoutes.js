import express from 'express';
import {
    addTransaction,
    getTransactions,
    deleteTransaction
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { createTransactionSchema } from '../schemas/transactionSchemas.js';

const router = express.Router();

router.route('/')
    .post(protect, validate(createTransactionSchema), addTransaction)
    .get(protect, getTransactions);

router.route('/:id')
    .delete(protect, deleteTransaction);

export default router;
