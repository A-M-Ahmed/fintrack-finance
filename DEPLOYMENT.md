# Render Deployment Guide

## Backend (Web Service)

### Setup
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Environment Variables
Add these in Render dashboard:
```
PORT=5000
MONGO_URI=mongodb+srv://your-atlas-connection-string
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.onrender.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Frontend (Static Site)

### Setup
1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Environment Variables
Add in Render dashboard:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Important Notes

1. **MongoDB**: Use MongoDB Atlas for production (free tier available)
2. **CORS**: After deploying frontend, update `CLIENT_URL` in backend env vars
3. **First Deploy**: Backend cold starts may take 30-60 seconds on free tier
4. **Order**: Deploy backend first, get URL, then deploy frontend with that URL

## Quick Checklist
- [ ] Create MongoDB Atlas cluster
- [ ] Deploy backend → Get URL
- [ ] Deploy frontend with backend URL
- [ ] Update backend CLIENT_URL with frontend URL
- [ ] Test all features
