// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('authMiddleware executed');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token created');


  if (!token) {
    return res.status(401).json({ message: 'No authentication token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Authentication token expired.' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Invalid authentication token.' });
      } else {
        return res.status(403).json({ message: 'Failed to authenticate token.' });
      }
    }

    if (!decoded.userId) {
      return res.status(400).json({ message: 'Invalid token: missing user ID.' });
    }

    req.userId = decoded.userId;

    if (decoded.role) {
      req.userRole = decoded.role; // Add role to request object
    }

    next();
  });
};