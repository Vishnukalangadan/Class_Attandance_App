const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: {
        type: String, // YYYY-MM-DD format
        required: true,
        unique: true
    },
    students: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        // Forenoon attendance status
        fnStatus: {
            type: String,
            enum: ['present', 'absent', 'unmarked'],
            default: 'unmarked'
        },
        // Afternoon attendance status
        anStatus: {
            type: String,
            enum: ['present', 'absent', 'unmarked'],
            default: 'unmarked'
        }
    }],
    totalStudents: {
        type: Number,
        default: 0
    },
    presentCountFN: {
        type: Number,
        default: 0
    },
    absentCountFN: {
        type: Number,
        default: 0
    },
    presentCountAN: {
        type: Number,
        default: 0
    },
    absentCountAN: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Update counts before saving
attendanceSchema.pre('save', function (next) {
    this.totalStudents = this.students.length;
    this.presentCountFN = this.students.filter(s => s.fnStatus === 'present').length;
    this.absentCountFN = this.students.filter(s => s.fnStatus === 'absent').length;
    this.presentCountAN = this.students.filter(s => s.anStatus === 'present').length;
    this.absentCountAN = this.students.filter(s => s.anStatus === 'absent').length;
    next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);