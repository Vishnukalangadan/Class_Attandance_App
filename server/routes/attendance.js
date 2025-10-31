const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Helper function to check database connection
const checkDatabaseConnection = (req, res, next) => {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            error: 'Database not connected',
            message: 'The database is currently unavailable. Please try again later.'
        });
    }
    next();
};

// GET /api/attendance - Get all attendance records
router.get('/', checkDatabaseConnection, async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find()
            .populate('students.studentId', 'name email rollNumber')
            .sort({ date: -1 });

        // Transform data to match frontend format
        const formattedData = {};
        attendanceRecords.forEach(record => {
            formattedData[record.date] = {
                date: record.date,
                students: record.students
                    .filter(s => s.studentId) // Filter out null student references
                    .map(s => ({
                        id: s.studentId._id.toString(),
                        name: s.studentId.name,
                        fnStatus: s.fnStatus,
                        anStatus: s.anStatus
                    }))
            };
        });

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Failed to fetch attendance data', details: error.message });
    }
});

// GET /api/attendance/:date - Get attendance for specific date
router.get('/:date', checkDatabaseConnection, async (req, res) => {
    try {
        const attendance = await Attendance.findOne({ date: req.params.date })
            .populate('students.studentId', 'name email rollNumber');

        if (!attendance) {
            // Return default attendance with all students unmarked
            const students = await Student.find({ isActive: true }).sort({ name: 1 });
            const defaultAttendance = {
                date: req.params.date,
                students: students.map(student => ({
                    id: student._id.toString(),
                    name: student.name,
                    fnStatus: 'unmarked',
                    anStatus: 'unmarked'
                }))
            };
            return res.json(defaultAttendance);
        }

        const formattedAttendance = {
            date: attendance.date,
            students: attendance.students
                .filter(s => s.studentId) // Filter out null student references
                .map(s => ({
                    id: s.studentId._id.toString(),
                    name: s.studentId.name,
                    fnStatus: s.fnStatus,
                    anStatus: s.anStatus
                }))
        };

        res.json(formattedAttendance);
    } catch (error) {
        console.error('Error fetching attendance for date:', error);
        res.status(500).json({ error: 'Failed to fetch attendance for date', details: error.message });
    }
});

// POST /api/attendance - Create or update attendance for a date
router.post('/', checkDatabaseConnection, async (req, res) => {
    try {
        const { date, students } = req.body;

        // Validate that all students exist
        const studentIds = students.map(s => s.id);
        const existingStudents = await Student.find({
            _id: { $in: studentIds },
            isActive: true
        });

        if (existingStudents.length !== studentIds.length) {
            return res.status(400).json({ error: 'Some students not found' });
        }

        // Prepare attendance data
        const attendanceData = {
            date,
            students: students.map(s => ({
                studentId: s.id,
                fnStatus: s.fnStatus || 'unmarked',
                anStatus: s.anStatus || 'unmarked'
            }))
        };

        // Upsert attendance record
        const attendance = await Attendance.findOneAndUpdate(
            { date },
            attendanceData,
            { upsert: true, new: true, runValidators: true }
        ).populate('students.studentId', 'name email rollNumber');

        const formattedAttendance = {
            date: attendance.date,
            students: attendance.students
                .filter(s => s.studentId) // Filter out null student references
                .map(s => ({
                    id: s.studentId._id.toString(),
                    name: s.studentId.name,
                    fnStatus: s.fnStatus,
                    anStatus: s.anStatus
                }))
        };

        res.json(formattedAttendance);
    } catch (error) {
        res.status(400).json({ error: 'Failed to save attendance data' });
    }
});

// PUT /api/attendance/:date - Update attendance for specific date
router.put('/:date', checkDatabaseConnection, async (req, res) => {
    try {
        const { students } = req.body;

        // Validate that all students exist
        const studentIds = students.map(s => s.id);
        const existingStudents = await Student.find({
            _id: { $in: studentIds },
            isActive: true
        });

        if (existingStudents.length !== studentIds.length) {
            return res.status(400).json({ error: 'Some students not found' });
        }

        // Prepare attendance data
        const attendanceData = {
            students: students.map(s => ({
                studentId: s.id,
                fnStatus: s.fnStatus || 'unmarked',
                anStatus: s.anStatus || 'unmarked'
            }))
        };

        const attendance = await Attendance.findOneAndUpdate(
            { date: req.params.date },
            attendanceData,
            { new: true, runValidators: true }
        ).populate('students.studentId', 'name email rollNumber');

        if (!attendance) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        const formattedAttendance = {
            date: attendance.date,
            students: attendance.students
                .filter(s => s.studentId) // Filter out null student references
                .map(s => ({
                    id: s.studentId._id.toString(),
                    name: s.studentId.name,
                    fnStatus: s.fnStatus,
                    anStatus: s.anStatus
                }))
        };

        res.json(formattedAttendance);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update attendance data' });
    }
});

// GET /api/attendance/stats/:date - Get attendance statistics for a date
router.get('/stats/:date', checkDatabaseConnection, async (req, res) => {
    try {
        const attendance = await Attendance.findOne({ date: req.params.date });

        if (!attendance) {
            const totalStudents = await Student.countDocuments({ isActive: true });
            return res.json({
                total: totalStudents,
                presentFN: 0,
                absentFN: 0,
                presentAN: 0,
                absentAN: 0
            });
        }

        res.json({
            total: attendance.totalStudents,
            presentFN: attendance.presentCountFN,
            absentFN: attendance.absentCountFN,
            presentAN: attendance.presentCountAN,
            absentAN: attendance.absentCountAN
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch attendance statistics' });
    }
});

module.exports = router;