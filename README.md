# 📅 Attendance Management App

A modern attendance management system with a React frontend and Node.js backend.

## 📁 Project Structure

```
attendance-app/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   ├── package.json       # Frontend dependencies
│   └── ...
├── server/                # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API endpoints
│   ├── scripts/           # Utility scripts
│   ├── server.js          # Entry point
│   └── package.json       # Backend dependencies
├── package.json           # Root package.json for workspace management
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Install dependencies for all packages:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start both the frontend (on port 3000) and backend (on port 3001) servers.

### Manual Setup

#### Frontend (Client)
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm start
   ```

#### Backend (Server)
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

4. Start the backend:
   ```bash
   npm run dev
   ```

## 🌐 Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 📞 Support

For issues with the application, check the individual README files in the client and server directories.