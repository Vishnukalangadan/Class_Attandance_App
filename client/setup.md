# 🚀 Attendance App Setup Guide

This guide will help you set up both the frontend (React) and backend (Node.js + MongoDB) for the Attendance Management App.

## 📋 Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Git** (optional) - [Download here](https://git-scm.com/)

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Configure database access:
   - Go to "Database Access" in the left sidebar
   - Add a new database user with read/write permissions
4. Configure network access:
   - Go to "Network Access" in the left sidebar
   - Add your current IP address or allow access from anywhere (0.0.0.0/0) for development
5. Get your connection string:
   - Go to "Clusters" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
6. Update `backend/.env` with your Atlas connection string:
   ```bash
   # Replace placeholders with your actual credentials
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```

## 🔧 Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env with your MongoDB connection string
   # For local MongoDB:
   # MONGODB_URI=mongodb://localhost:27017/attendance_app
   
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database-name
   ```

4. **Seed the database with initial student data:**
   ```bash
   node scripts/seedDatabase.js
   ```

5. **Start the backend server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Or production mode
   npm start
   ```

   The backend will run on `http://localhost:3001`

## 🎨 Frontend Setup

1. **Navigate to the root directory:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## 🧪 Testing the Setup

1. **Check backend health:**
   Visit `http://localhost:3001/api/health`

2. **Check frontend:**
   Visit `http://localhost:3000`

3. **Test the full flow:**
   - Open the calendar
   - Click on any date
   - Mark some students as present/absent
   - Refresh the page - data should persist!

## 📁 Project Structure

```
attendance-app/
├── backend/                 # Node.js + Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── scripts/            # Database seeding
│   ├── server.js           # Main server file
│   └── package.json
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── context/            # React context
│   ├── services/           # API services
│   └── types/              # TypeScript types
└── package.json
```

## 🔗 API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:date` - Get attendance for specific date
- `POST /api/attendance` - Create/update attendance
- `PUT /api/attendance/:date` - Update attendance for date
- `GET /api/attendance/stats/:date` - Get attendance statistics

### Health
- `GET /api/health` - Health check

## 🚨 Troubleshooting

### Backend Issues
- **MongoDB connection error**: Check if MongoDB is running and connection string is correct
- **Port already in use**: Change PORT in `.env` file
- **CORS errors**: Check FRONTEND_URL in `.env`

### Frontend Issues
- **API connection error**: Check if backend is running on port 3001
- **Build errors**: Run `npm run build` to check for TypeScript errors

### Database Issues
- **No students showing**: Run the seed script: `node scripts/seedDatabase.js`
- **Data not persisting**: Check MongoDB connection and database name

## 🎯 Next Steps

Once everything is running:

1. **Mark attendance** for different dates
2. **Refresh the page** - data should persist
3. **Check the database** - you can use MongoDB Compass to view data
4. **Customize students** - add/edit/remove students via API

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all services are running
3. Check the API health endpoint
4. Ensure MongoDB is accessible

Happy coding! 🎉
