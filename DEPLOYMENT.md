# Render Deployment Guide (Single Server)

Deploy both frontend and backend as **ONE Web Service** on Render.

## Setup on Render

1. Create a new **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: *(leave empty - use repo root)*
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

## Environment Variables

Add these in Render dashboard:

```
NODE_ENV=production
PORT=5000
MONGO_URI_PRO=mongodb+srv://your-atlas-connection-string
JWT_SECRET=your-super-secret-key
CLOUDINARY_CLOUD_NAME=dlzqwvmmr
CLOUDINARY_API_KEY=732742539369175
CLOUDINARY_API_SECRET=qWmSNWrolMlePXRYKijO0gZ-id4
```

## How It Works

1. **Build**: `npm run build` installs client dependencies and builds the React app to `client/dist`
2. **Start**: `npm start` runs the Express server which:
   - Serves API routes at `/api/*`
   - Serves React static files from `client/dist`
   - Handles client-side routing (sends `index.html` for non-API routes)

## Quick Checklist

- [ ] Create MongoDB Atlas cluster (free tier works)
- [ ] Create Web Service on Render
- [ ] Add environment variables
- [ ] Deploy!

## Notes

- First deploy may take 2-3 minutes to build
- Free tier has cold starts (~30 seconds after inactivity)
- Your app will be at: `https://your-app-name.onrender.com`
