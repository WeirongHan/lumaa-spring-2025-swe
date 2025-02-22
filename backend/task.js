/**
 * Tasks related logics
 */
const express = require('express');
const { pool } = require('./dbConfig');
// Authenticate token
const authMiddleware = require('./authMiddleware');
const router = express.Router();

/**
 * GET /tasks - Retrieve tasks created by the logged in user
 */
router.get('/tasks', authMiddleware, async (req, res) => {
    // Fetch tasks created by the logged in user from Database and return
    try {
        const tasks = await pool.query('SELECT * FROM tasks WHERE userId = $1', [req.user.id]);
        
        res.status(200).json(tasks.rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error: Failed to fetch tasks' });
    }
});

/**
 * POST /tasks - Create a new task
 */
router.post('/tasks', authMiddleware, async (req, res) => {
    const { title, description, isComplete } = req.body;
    // Check if task title is empty.
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    // Create a new task in the database and return the newly created task with status code 201
    try {
        const newTask = await pool.query(
            'INSERT INTO tasks (title, description, isComplete, userId) VALUES ($1, $2, $3, $4) RETURNING *',
            // Set default isComplete to false
            [title, description, isComplete || false, req.user.id]
        );

        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error: Failed to create task' });
    }
});

/**
 * PUT /tasks/:id - Update selected task with given id
 */
router.put('/tasks/:id', authMiddleware, async (req, res) => {
    const { title, description, isComplete } = req.body;
    const taskId = req.params.id;

    try {
        const task = await pool.query('SELECT * FROM tasks WHERE id = $1 AND userId = $2', [taskId, req.user.id]);
        // return error if task cannot be found
        if (task.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update task and return success with status code 200
        const updatedTask = await pool.query(
            'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), isComplete = COALESCE($3, isComplete) WHERE id = $4 RETURNING *',
            [title, description, isComplete, taskId]
        );

        res.status(200).json(updatedTask.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * DELETE /tasks/:id - Delete selected task with given id
 */
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    const taskId = req.params.id;

    try {
        // return error if task cannot be found
        const task = await pool.query('SELECT * FROM tasks WHERE id = $1 AND userId = $2', [taskId, req.user.id]);

        if (task.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Delete task from the database and return a success message
        await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);

        res.status(204).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;