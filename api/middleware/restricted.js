const jwt = require('jsonwebtoken');
const secrets = require('../config/secret');

module.exports = (req, res, next) => {
  const token = req.headers?.authorization;

  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "token invalid" });
      } else {
        req.decodedJWT = decodedToken;
        next();
      }
    })
  } else {
    res.status(401).json({ message: "Token required"})
  }
}
