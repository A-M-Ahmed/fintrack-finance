const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res) => {
    try {
        const { walletId, type, category, title, amount, date, note } = req.body;

        // Validate request
        if (!walletId || !type || !amount || !title) {
            return res.status(400).json({ message: 'Please provide all details' });
        }

        const wallet = await Wallet.findById(walletId);

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        if (wallet.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Create Transaction
        const transaction = await Transaction.create({
            user: req.user.id,
            wallet: walletId,
            type,
            category,
            title,
            amount,
            date: date || Date.now(),
            note
        });

        // Update Wallet Balance
        let balanceChange = 0;
        if (type === 'income') {
            balanceChange = Number(amount);
        } else if (type === 'expense') {
            balanceChange = -Number(amount);
        }
        // If transfer, we might treat it as expense from this wallet. 
        // Implementing full transfer logic across 2 wallets requires more UI input.
        // For now, assuming transfer acts as expense (money leaving this wallet).
        else if (type === 'transfer') {
            balanceChange = -Number(amount);
        }

        wallet.currentBalance += balanceChange;
        await wallet.save();

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        const { walletId, type, search, sort } = req.query;

        let query = { user: req.user.id };

        if (walletId) {
            query.wallet = walletId;
        }

        if (type) {
            query.type = type;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Default sort by date desc
        let sortStr = '-date';
        if (sort) {
            sortStr = sort;
        }

        const transactions = await Transaction.find(query).sort(sortStr).populate('wallet', 'name type');

        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const wallet = await Wallet.findById(transaction.wallet);

        // Reverse balance
        if (wallet) {
            let balanceChange = 0;
            // If we are deleting an INCOME, we MUST SUBTRACT it to revert
            if (transaction.type === 'income') {
                balanceChange = -Number(transaction.amount);
            }
            // If we are deleting an EXPENSE, we MUST ADD it back
            else if (transaction.type === 'expense' || transaction.type === 'transfer') {
                balanceChange = Number(transaction.amount);
            }

            wallet.currentBalance += balanceChange;
            await wallet.save();
        }

        await transaction.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
