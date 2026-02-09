const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { registerValidators, loginValidators } = require('../utils/validators');

// POST /api/auth/register - Inscription
router.post('/register', registerValidators, register);

// POST /api/auth/login - Connexion
router.post('/login', loginValidators, login);

module.exports = router;
