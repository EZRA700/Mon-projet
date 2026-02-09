const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Récupérer tous les articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      message: 'Articles récupérés avec succès',
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Error in getAllArticles:', error);
    res.status(500).json({
      error: { message: 'Erreur lors de la récupération des articles', status: 500 }
    });
  }
};

// Récupérer un article par ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        error: { message: 'Article non trouvé', status: 404 }
      });
    }

    res.status(200).json({
      message: 'Article récupéré avec succès',
      article
    });
  } catch (error) {
    console.error('Error in getArticleById:', error);
    res.status(500).json({
      error: { message: 'Erreur lors de la récupération de l\'article', status: 500 }
    });
  }
};

// Créer un article
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Article créé avec succès',
      article
    });
  } catch (error) {
    console.error('Error in createArticle:', error);
    res.status(500).json({
      error: { message: 'Erreur lors de la création de l\'article', status: 500 }
    });
  }
};

// Mettre à jour un article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    // Vérifier si l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingArticle) {
      return res.status(404).json({
        error: { message: 'Article non trouvé', status: 404 }
      });
    }

    // Vérifier si l'utilisateur est l'auteur
    if (existingArticle.authorId !== userId) {
      return res.status(403).json({
        error: { message: 'Vous n\'êtes pas autorisé à modifier cet article', status: 403 }
      });
    }

    // Mettre à jour l'article
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(content && { content })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Article mis à jour avec succès',
      article
    });
  } catch (error) {
    console.error('Error in updateArticle:', error);
    res.status(500).json({
      error: { message: 'Erreur lors de la mise à jour de l\'article', status: 500 }
    });
  }
};

// Supprimer un article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier si l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingArticle) {
      return res.status(404).json({
        error: { message: 'Article non trouvé', status: 404 }
      });
    }

    // Vérifier si l'utilisateur est l'auteur
    if (existingArticle.authorId !== userId) {
      return res.status(403).json({
        error: { message: 'Vous n\'êtes pas autorisé à supprimer cet article', status: 403 }
      });
    }

    // Supprimer l'article
    await prisma.article.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      message: 'Article supprimé avec succès'
    });
  } catch (error) {
    console.error('Error in deleteArticle:', error);
    res.status(500).json({
      error: { message: 'Erreur lors de la suppression de l\'article', status: 500 }
    });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
