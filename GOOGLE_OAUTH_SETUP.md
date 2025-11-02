# Google OAuth Setup Guide

This guide will help you set up Google Sign-In for your Attendance App.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: "Attendance App" (or your preferred name)
5. Click "Create"

## Step 2: Enable Google+ API

1. In your Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "People API"
3. Click on it and click "Enable"

## Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in required fields:
     - App name: Attendance App
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Add scopes (optional for now)
   - Add test users if needed
   - Click "Save and Continue"

4. Back to creating OAuth client ID:
   - Application type: "Web application"
   - Name: "Attendance App Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:3002`
     - Your production URL (e.g., `https://classattandance.netlify.app`)
   - Authorized redirect URIs:
     - `http://localhost:3000`
     - `http://localhost:3002`
     - Your production URL
   - Click "Create"

5. Copy the **Client ID** (it will look like: `xxxxx.apps.googleusercontent.com`)

## Step 4: Configure Environment Variables

### Frontend (client/.env.development)

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```

### Backend (server/.env)

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```

**Important:** Replace `YOUR_CLIENT_ID_HERE` with your actual Google Client ID!

## Step 5: For Production Deployment

### Netlify (Frontend)
Add environment variable in Netlify dashboard:
- Key: `REACT_APP_GOOGLE_CLIENT_ID`
- Value: Your Google Client ID

### Render (Backend)
Add environment variable in Render dashboard:
- Key: `GOOGLE_CLIENT_ID`
- Value: Your Google Client ID

Also update the authorized origins in Google Cloud Console to include your production URLs.

## Step 6: Test the Integration

1. Start your backend server:
   ```bash
   cd server
   node server.js
   ```

2. Start your frontend:
   ```bash
   cd client
   npm start
   ```

3. Click on "Log in with Google" button
4. Select a Google account
5. Authorize the app
6. You should be logged in!

## Troubleshooting

### "Google Sign-In failed"
- Check that GOOGLE_CLIENT_ID is set correctly in both frontend and backend
- Verify authorized origins in Google Cloud Console
- Check browser console for detailed error messages

### "Invalid client ID"
- Make sure you copied the complete client ID including `.apps.googleusercontent.com`
- Ensure the client ID in frontend and backend match

### "Redirect URI mismatch"
- Add your current URL to authorized redirect URIs in Google Cloud Console
- URLs must match exactly (including http/https, port numbers, etc.)

## How It Works

1. User clicks "Log in with Google"
2. Google OAuth popup appears
3. User selects Google account and authorizes
4. Google returns user info (name, email, picture)
5. Frontend sends this info to backend `/api/auth/google`
6. Backend creates or updates user in MongoDB
7. Backend returns JWT token
8. User is logged in!

## Security Notes

- Never commit `.env` files to Git
- Keep your Client ID safe (though it's okay to be public)
- Use HTTPS in production
- Regularly review OAuth consent screen and authorized domains
