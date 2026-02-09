const { body, param, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Erreurs de validation',
        status: 400,
        details: errors.array()
      }
    });
  }
  next();
};

// Validateurs pour l'authentification
const registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2 })
    .withMessage('Le nom doit contenir au moins 2 caractères'),
  handleValidationErrors
];

const loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  handleValidationErrors
];

// Validateurs pour les articles
const createArticleValidators = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 3, max: 200 })
    .withMessage('Le titre doit contenir entre 3 et 200 caractères'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Le contenu est requis')
    .isLength({ min: 10 })
    .withMessage('Le contenu doit contenir au moins 10 caractères'),
  handleValidationErrors
];

const updateArticleValidators = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID invalide'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Le titre doit contenir entre 3 et 200 caractères'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Le contenu doit contenir au moins 10 caractères'),
  handleValidationErrors
];

const idParamValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID invalide'),
  handleValidationErrors
];

module.exports = {
  registerValidators,
  loginValidators,
  createArticleValidators,
  updateArticleValidators,
  idParamValidator
};
