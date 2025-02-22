/**
 * Token verification and authentication related logics
 */
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    // Check if token is provided in the Authorization header header. If not, return 401 Unauthorized.
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    // Verify the token using the secret key. If valid, add the user info in the request body, 
    // otherwise return 403 Forbidden.
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;