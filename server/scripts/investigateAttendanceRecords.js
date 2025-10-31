const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_app';

async function investigateAttendanceRecords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Find all attendance records
        const attendanceRecords = await Attendance.find({}).populate('students.studentId', 'name');
        console.log(`Found ${attendanceRecords.length} attendance records`);

        for (const record of attendanceRecords) {
            console.log(`\nDate: ${record.date}`);
            console.log(`Total students in record: ${record.students.length}`);

            let nullCount = 0;
            for (const student of record.students) {
                if (student.studentId === null) {
                    nullCount++;
                    console.log(`  - NULL student reference`);
                } else {
                    console.log(`  - ${student.studentId.name} (${student.studentId._id})`);
                }
            }

            if (nullCount > 0) {
                console.log(`  NULL references: ${nullCount}`);
            }
        }

        console.log('\n✅ Investigation completed!');
    } catch (error) {
        console.error('❌ Error investigating database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

investigateAttendanceRecords();