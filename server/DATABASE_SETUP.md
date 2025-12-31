# Database Setup Guide

This project is configured to work with both **Local MongoDB** (for development) and **MongoDB Atlas** (for production).

## 1. Development (Local MongoDB)

For development, it is recommended to use a local MongoDB instance. This is faster, works offline, and keeps your development data separate from production.

### Setup
1. Ensure you have MongoDB installed locally (MongoDB Community Server).
2. The default connection string in `server/.env` is usually:
   ```env
   MONGO_URI=mongodb://localhost:27017/fintrack
   ```
3. Run the server:
   ```bash
   npm run dev
   ```

## 2. Production (MongoDB Atlas)

For production (when you deploy your app online), you need a cloud database. MongoDB Atlas is the best choice.

### Setup Steps
1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2. **Create Cluster**: Create a new "Shared" cluster (free tier is fine).
3. **Network Access**:
   - Go to "Network Access" in the sidebar.
   - Click "Add IP Address".
   - Select "Allow Access from Anywhere" (0.0.0.0/0) or whitelist your production server's IP.
4. **Database User**:
   - Go to "Database Access".
   - Create a new database user (e.g., `fintrack_user`) and password. **Remember this password!**
5. **Get Connection String**:
   - Go back to "Database" (Clusters).
   - Click "Connect".
   - Choose "Drivers" (Node.js).
   - Copy the connection string. It will look like this:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
     ```
6. **Update Configuration**:
   - Replace `<username>` with your database user (step 4).
   - Replace `<password>` with your user's password.
   - **In Production**: Set this string as the `MONGO_URI` environment variable on your hosting platform (Render, Heroku, Vercel, etc.).
   - **(Optional) To Test Locally**: Update your local `server/.env` file with this new string to test the connection.

## Switching Environments

You do not need to change code to switch environments. Just change the `MONGO_URI` environment variable.

- **Local .env file**: Keeps your local config.
- **Server Environment Variables**: Holds your production config (set via your hosting provider's dashboard).
