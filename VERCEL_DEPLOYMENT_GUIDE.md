# Vercel Deployment Guide for Attendance App

## Environment Variables Required

For successful deployment on Vercel, you need to set these environment variables in your Vercel project settings:

1. `MONGODB_URI` - Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/attendance_app`
   - This is required as Vercel cannot connect to localhost databases

2. `JWT_SECRET` - A secure random string for JWT token signing
   - Example: `attendance_app_secret_key` (use a more secure one in production)

3. `FRONTEND_URL` - Your deployed frontend URL
   - Example: `https://classattandance.netlify.app`

4. `NODE_ENV` - Set to `production`
   - Value: `production`

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Add a database user with read/write permissions
4. Add your Vercel deployment IP to the IP whitelist (or allow access from anywhere for testing)
5. Get your connection string from the "Connect" button
6. Replace username and password placeholders with your actual credentials

## Vercel Project Configuration

1. Create two Vercel projects:
   - One for the frontend (root directory)
   - One for the backend (/server directory)

2. For the backend project:
   - Set the root directory to `/server`
   - Ensure `server/vercel.json` exists (it's already configured)
   - Set environment variables as listed above

3. For the frontend project:
   - Set the root directory to `/client` (or root if using monorepo)
   - Set `REACT_APP_API_URL` to your Vercel backend URL
   - Example: `https://your-backend-project.vercel.app/api`

## Troubleshooting

If you're getting 500 errors:

1. Check that `MONGODB_URI` is correctly set in Vercel environment variables
2. Verify your MongoDB Atlas connection string works locally
3. Check Vercel logs for detailed error messages
4. Ensure your MongoDB Atlas cluster is not paused
5. Confirm IP whitelist settings in MongoDB Atlas

## Local Development vs Production

- Local development uses `mongodb://localhost:27017/attendance_app`
- Production (Vercel) requires a MongoDB Atlas connection string