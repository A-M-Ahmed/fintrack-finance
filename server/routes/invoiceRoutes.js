import express from 'express';
import { createInvoice, getInvoices, getInvoice, updateInvoiceStatus } from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { createInvoiceSchema, updateInvoiceStatusSchema } from '../schemas/invoiceSchemas.js';

const router = express.Router();

router.route('/')
    .post(protect, validate(createInvoiceSchema), createInvoice)
    .get(protect, getInvoices);

router.route('/:id')
    .get(protect, getInvoice);

router.put('/:id/status', protect, validate(updateInvoiceStatusSchema), updateInvoiceStatus);

export default router;
