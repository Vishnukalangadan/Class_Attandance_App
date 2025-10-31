# Attendance App Backend

This is the backend API for the Attendance Management application.

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your MongoDB connection string and other settings.

4. Start the development server:
   ```
   npm run dev
   ```

## Production Deployment (Render)

1. Create a new Web Service on Render.

2. Connect your GitHub repository.

3. Set the following environment variables in Render:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string for JWT token generation
   - `FRONTEND_URL` - Your frontend URL (e.g., https://classattandance.netlify.app)
   - `NODE_ENV` - production

4. Set the build command:
   ```
   npm install
   ```

5. Set the start command:
   ```
   npm start
   ```

6. Set the root directory to `/server`.

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/students` - Student management
- `GET /api/attendance` - Attendance records
- `POST /api/auth` - Authentication

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing
- `FRONTEND_URL` - Allowed frontend origin for CORS
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)