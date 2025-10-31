const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_app';

async function cleanAttendanceRecords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Find attendance records with null student references
        const attendanceRecords = await Attendance.find({});
        console.log(`Found ${attendanceRecords.length} attendance records`);

        let cleanedCount = 0;

        for (const record of attendanceRecords) {
            // Filter out null student references
            const validStudents = record.students.filter(s => s.studentId !== null);

            if (validStudents.length !== record.students.length) {
                console.log(`Cleaning record for date ${record.date}: ${record.students.length} -> ${validStudents.length} students`);

                // Update the record with valid students only
                record.students = validStudents;
                await record.save();
                cleanedCount++;
            }
        }

        console.log(`✅ Cleaned ${cleanedCount} attendance records`);
        console.log('✅ Database cleaning completed successfully!');
    } catch (error) {
        console.error('❌ Error cleaning database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

cleanAttendanceRecords();