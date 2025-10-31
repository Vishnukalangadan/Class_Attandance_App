const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_app';

async function cleanInvalidAttendanceRecords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Get all current student IDs
        const students = await Student.find({ isActive: true });
        const studentIds = students.map(s => s._id.toString());
        console.log(`Found ${students.length} active students`);

        // Find all attendance records
        const attendanceRecords = await Attendance.find({});
        console.log(`Found ${attendanceRecords.length} attendance records`);

        let deletedCount = 0;

        for (const record of attendanceRecords) {
            // Check if any student in this record references a valid student
            let hasValidStudent = false;

            for (const student of record.students) {
                if (student.studentId && studentIds.includes(student.studentId.toString())) {
                    hasValidStudent = true;
                    break;
                }
            }

            // If no valid students, delete the record
            if (!hasValidStudent) {
                console.log(`Deleting record for date ${record.date} (no valid students)`);
                await Attendance.deleteOne({ _id: record._id });
                deletedCount++;
            }
        }

        console.log(`✅ Deleted ${deletedCount} invalid attendance records`);
        console.log('✅ Database cleaning completed successfully!');
    } catch (error) {
        console.error('❌ Error cleaning database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

cleanInvalidAttendanceRecords();