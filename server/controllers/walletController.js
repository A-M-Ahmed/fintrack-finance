import Wallet from '../models/Wallet.js';

// @desc    Create new wallet
// @route   POST /api/wallets
// @access  Private
export const createWallet = async (req, res) => {
    try {
        const { name, type, initialBalance } = req.body;

        const wallet = await Wallet.create({
            user: req.user.id,
            name,
            type,
            initialBalance: initialBalance || 0,
            currentBalance: initialBalance || 0 // Initialize current with initial
        });

        res.status(201).json(wallet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user wallets
// @route   GET /api/wallets
// @access  Private
export const getWallets = async (req, res) => {
    try {
        const wallets = await Wallet.find({ user: req.user.id });
        res.status(200).json(wallets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single wallet
// @route   GET /api/wallets/:id
// @access  Private
export const getWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        // Ensure user owns wallet
        if (wallet.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(wallet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update wallet
// @route   PATCH /api/wallets/:id
// @access  Private
export const updateWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        if (wallet.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedWallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true // Enforce schema validation on update
        });

        res.status(200).json(updatedWallet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete wallet
// @route   DELETE /api/wallets/:id
// @access  Private
export const deleteWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        if (wallet.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await wallet.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
