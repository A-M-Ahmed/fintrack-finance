import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['cash', 'bank', 'mobile'], // Enforce wallet types
        required: true
    },
    initialBalance: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for current balance (calculated via transactions later)
// For now, we might just store currentBalance or calculate it on the fly.
// Use schema virtual or just calculate in controller. 
// Blueprint says "Wallet balance calculation based on transactions".
// So we won't store a hard "currentBalance" here unless we cache it.
// Let's add a cached 'balance' field that we update or leave it dynamic.
// For simplicity and speed in MERN, caching it is often easier for UI.
// But let's stick to the blueprint which implies calculation.
// Actually, let's add `currentBalance` for performance, updated on transaction.

WalletSchema.add({
    currentBalance: {
        type: Number,
        default: 0
    }
});
// Actually I should have defined it in the schema above.

export default mongoose.model('Wallet', WalletSchema);
