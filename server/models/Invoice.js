import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    invoiceId: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    items: [{
        name: String,
        qty: Number,
        price: Number
    }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Invoice', InvoiceSchema);
