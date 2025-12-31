import express from 'express';
import { createInvoice, getInvoices, getInvoice, updateInvoiceStatus } from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createInvoice)
    .get(protect, getInvoices);

router.route('/:id')
    .get(protect, getInvoice);

router.put('/:id/status', protect, updateInvoiceStatus);

export default router;
