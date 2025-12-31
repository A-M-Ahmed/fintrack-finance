# FinTrack Server

Express.js Backend for FinTrack Personal Finance System.

## Setup

1. Copy `.env.example` to `.env`
2. Update the values in `.env`
3. Run `npm install`
4. Run `npm run dev`

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me` (Protected)

### Wallets
- POST `/api/wallets` (Protected)
- GET `/api/wallets` (Protected)
- GET `/api/wallets/:id` (Protected)
- PATCH `/api/wallets/:id` (Protected)
- DELETE `/api/wallets/:id` (Protected)

### Transactions
- POST `/api/transactions` (Protected)
- GET `/api/transactions` (Protected)
- DELETE `/api/transactions/:id` (Protected)

### Dashboard
- GET `/api/dashboard/summary` (Protected)

### Invoices
- POST `/api/invoices` (Protected)
- GET `/api/invoices` (Protected)
- GET `/api/invoices/:id` (Protected)
