const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));

// More flexible CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3002',
            'https://classattandance.netlify.app',
            // Add any other origins you want to allow
        ];

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with better error handling and debugging
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_app';

console.log('Attempting to connect to MongoDB with URI:', MONGODB_URI.substring(0, 30) + '...'); // Log first 30 chars for security

// Track connection status
let isDbConnected = false;

// Enhanced MongoDB connection options for Render deployment
// Removed conflicting options that cause "Cannot combine replicaSet option with srvMaxHosts" error
const mongoOptions = {
    serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    // SSL/TLS options for Render deployment
    tls: true,
    // Retry options
    retryWrites: true,
    retryReads: true,
    // Connection pool options
    maxPoolSize: 10,
    minPoolSize: 5
    // Removed srvMaxHosts as it conflicts with replicaSet option in the connection string
};

mongoose.connect(MONGODB_URI, mongoOptions)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        isDbConnected = true;
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('Full error details:', error);
        isDbConnected = false;
        console.log('⚠️  Server will start without database connection. Some features may not work.');
        console.log('💡 Troubleshooting steps:');
        console.log('   1. Verify your MONGODB_URI is correct');
        console.log('   2. Confirm your IP is whitelisted in MongoDB Atlas');
        console.log('   3. Check if your MongoDB Atlas cluster is paused (resume if needed)');
        console.log('   4. Try connecting with MongoDB Compass to test the connection string');
        console.log('   5. For Render deployment, ensure 0.0.0.0/0 is in your Atlas IP whitelist');
    });

// Log MongoDB connection events
mongoose.connection.on('connecting', () => {
    console.log('MongoDB connecting...');
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected event fired');
    isDbConnected = true;
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    isDbConnected = false;
});

mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error event:', error);
    isDbConnected = false;
});

// Authentication middleware function
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'attendance_app_secret_key';

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
}

// Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/auth', require('./routes/auth'));

// Health check endpoint with database status
app.get('/api/health', (req, res) => {
    const dbStatus = isDbConnected && mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        mongooseState: mongoose.connection.readyState,
        uptime: process.uptime()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Attendance App API',
        activeStatus: true,
        error: false
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    
    // Check MongoDB connection status after startup
    setTimeout(() => {
        if (isDbConnected && mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB connection confirmed after startup');
        } else if (!isDbConnected) {
            console.log('⚠️  MongoDB is not connected. Some features may not work properly.');
            console.log('💡 Check your MONGODB_URI and network connectivity.');
        }
    }, 3000);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    }
    process.exit(0);
});

module.exports = app;