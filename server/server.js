require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection - Use MONGO_URI_PRO for production, fallback to MONGO_URI
const mongoUri = process.env.MONGO_URI_PRO || process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/wallets', require('./src/routes/wallet.routes'));
app.use('/api/transactions', require('./src/routes/transaction.routes'));
app.use('/api/dashboard', require('./src/routes/dashboard.routes'));
app.use('/api/invoices', require('./src/routes/invoice.routes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from client/dist
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Handle client-side routing - send index.html for any non-API routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('FinTrack API is running...');
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
