const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const Users = require('./auth-model');

router.post('/register', checkBody, async (req, res) => {
  let credentials = req.user;

  const hash = bcryptjs.hashSync(credentials.password, 10);
  credentials.password = hash;

  try {
    const newUser = await Users.add(credentials);
    res.status(201).send(newUser)
  } catch (err) {
    res.status(500).json({ message: "username taken" })
  }
});

router.post('/login', checkBody, async (req, res) => {
  try {
    const user = await Users.findBy({ username: req.user.username });
    if (user && bcryptjs.compareSync(req.user.password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: `welcome ${user.username}`, token });
    } else {
      res.status(400).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "invalid credentials" });
  }
});

function checkBody(req, res, next) {
  const user = req.body;
  if (!user || !user.username || !user.password) {
    res.status(400).json({ message: "username and password required" });
  } else {
    req.user = user;
    next();
  }
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, secret.jwtSecret, options);
}

module.exports = router;
