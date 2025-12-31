const Invoice = require('../models/Invoice');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res) => {
    try {
        const { invoiceId, clientName, items, status, issueDate, dueDate } = req.body;

        // Calculate total
        const total = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

        const invoice = await Invoice.create({
            user: req.user.id,
            invoiceId,
            clientName,
            items,
            total,
            status,
            issueDate,
            dueDate
        });

        res.status(201).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Invoices
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (invoice.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update invoice status
// @route   PUT /api/invoices/:id/status
// @access  Private
exports.updateInvoiceStatus = async (req, res) => {
    try {
        const { status, walletId, type } = req.body;
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        if (invoice.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        if (status === 'paid' && invoice.status !== 'paid') {
            if (!walletId) return res.status(400).json({ message: 'Wallet is required when marking as paid' });

            const wallet = await Wallet.findById(walletId);
            if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
            if (wallet.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

            const transactionType = type || 'income'; // default income
            const amount = invoice.total;

            await Transaction.create({
                user: req.user.id,
                wallet: walletId,
                type: transactionType,
                category: 'Invoice',
                title: `Invoice Payment: ${invoice.clientName} (#${invoice.invoiceId})`,
                amount: amount,
                date: Date.now(),
                note: `Automatically created from Invoice #${invoice.invoiceId}`
            });

            // Update Wallet
            let balanceChange = transactionType === 'income' ? Number(amount) : -Number(amount);
            wallet.currentBalance += balanceChange;
            await wallet.save();
        }

        invoice.status = status;
        await invoice.save();

        res.status(200).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
