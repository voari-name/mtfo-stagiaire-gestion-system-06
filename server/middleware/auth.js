
const jwt = require('jsonwebtoken');

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Veuillez vous connecter.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
    
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
