const express = require('express');
const router = express.Router();
const {
    addTransaction,
    getTransactions,
    deleteTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addTransaction)
    .get(protect, getTransactions);

router.route('/:id')
    .delete(protect, deleteTransaction);

module.exports = router;
