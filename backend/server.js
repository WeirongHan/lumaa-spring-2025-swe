/**
 * Server setup
 */
const express = require('express');
// Login and Register Routes
const authRoutes = require('./auth');
// Task Routes
const taskRoutes = require('./task');
const cors = require('cors');

// Parse Request into JSON
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

// Mount Authentication and Task Routes
app.use('/auth', authRoutes);
app.use('/', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});