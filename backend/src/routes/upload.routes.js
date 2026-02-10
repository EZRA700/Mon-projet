const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuration de multer pour le stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.'), false);
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

// Route d'upload d'image
router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { message: 'Aucun fichier uploadé', status: 400 }
      });
    }

    // Retourner l'URL de l'image
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
      message: 'Image uploadée avec succès',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error in upload:', error);
    res.status(500).json({
      error: { message: 'Erreur lors de l\'upload de l\'image', status: 500 }
    });
  }
});

// Gestion des erreurs multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: { message: 'Le fichier est trop volumineux (max 5MB)', status: 400 }
      });
    }
    return res.status(400).json({
      error: { message: error.message, status: 400 }
    });
  }
  
  if (error) {
    return res.status(400).json({
      error: { message: error.message, status: 400 }
    });
  }
  
  next();
});

module.exports = router;
