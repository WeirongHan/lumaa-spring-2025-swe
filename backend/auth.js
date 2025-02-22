/**
 * Register and Login related logics 
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('./dbConfig');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

/**
 * POST /auth/register - Register a new user
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user already exists
        const existUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into Database
        const newUser = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * POST /auth/login - Login and return JWT token
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user using username in Database
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        // If not found/incorreect password return unauthorized error 401
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username' });
        }
        
        const user = userResult.rows[0];

        // Compare input password with encrypted password stored in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token with 1 hour expiration time
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;