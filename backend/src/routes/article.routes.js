const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/article.controller');
const {
  createArticleValidators,
  updateArticleValidators,
  idParamValidator
} = require('../utils/validators');

// GET /api/articles - Récupérer tous les articles (public)
router.get('/', getAllArticles);

// GET /api/articles/:id - Récupérer un article par ID (public)
router.get('/:id', idParamValidator, getArticleById);

// POST /api/articles - Créer un article (protégé)
router.post('/', authMiddleware, createArticleValidators, createArticle);

// PUT /api/articles/:id - Mettre à jour un article (protégé)
router.put('/:id', authMiddleware, updateArticleValidators, updateArticle);

// DELETE /api/articles/:id - Supprimer un article (protégé)
router.delete('/:id', authMiddleware, idParamValidator, deleteArticle);

module.exports = router;
