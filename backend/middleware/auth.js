const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set BOTH so all controllers work regardless of which they use
    req.user = decoded;
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
