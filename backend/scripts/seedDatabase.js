const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_app';

const seedStudents = [
    { name: 'Alice Johnson', email: 'alice.johnson@email.com', rollNumber: 'A001' },
    { name: 'Bob Smith', email: 'bob.smith@email.com', rollNumber: 'A002' },
    { name: 'Charlie Brown', email: 'charlie.brown@email.com', rollNumber: 'A003' },
    { name: 'Diana Prince', email: 'diana.prince@email.com', rollNumber: 'A004' },
    { name: 'Ethan Hunt', email: 'ethan.hunt@email.com', rollNumber: 'A005' },
    { name: 'Fiona Green', email: 'fiona.green@email.com', rollNumber: 'A006' },
    { name: 'George Wilson', email: 'george.wilson@email.com', rollNumber: 'A007' },
    { name: 'Hannah Davis', email: 'hannah.davis@email.com', rollNumber: 'A008' },
    { name: 'Ian Murphy', email: 'ian.murphy@email.com', rollNumber: 'A009' },
    { name: 'Julia Roberts', email: 'julia.roberts@email.com', rollNumber: 'A010' },
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing students
        await Student.deleteMany({});
        console.log('🗑️  Cleared existing students');

        // Insert seed data
        const students = await Student.insertMany(seedStudents);
        console.log(`🌱 Seeded ${students.length} students`);

        console.log('✅ Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

seedDatabase();
