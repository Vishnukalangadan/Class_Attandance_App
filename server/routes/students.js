const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/students - Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find({ isActive: true }).sort({ name: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// POST /api/students - Create a new student
router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create student' });
    }
});

// PUT /api/students/:id - Update a student
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update student' });
    }
});

// DELETE /api/students/:id - Soft delete a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete student' });
    }
});

module.exports = router;
