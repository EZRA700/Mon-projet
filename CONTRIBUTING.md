# Guide de Contribution

Merci de votre intérêt pour contribuer à ce projet ! 🎉

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Standards de code](#standards-de-code)
- [Workflow Git](#workflow-git)
- [Tests](#tests)
- [Documentation](#documentation)

## Code de conduite

Ce projet adhère à un code de conduite. En participant, vous vous engagez à respecter ce code. Soyez respectueux et professionnel.

## Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les **Issues**
2. Créez une nouvelle issue avec :
   - Un titre descriptif
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs obtenu
   - Votre environnement (OS, version Docker, etc.)
   - Des captures d'écran si pertinent

### Suggérer une fonctionnalité

1. Vérifiez que la fonctionnalité n'est pas déjà suggérée
2. Créez une issue avec :
   - Un titre clair
   - Une description détaillée de la fonctionnalité
   - Des cas d'usage
   - Des mockups/wireframes si applicable

### Soumettre un Pull Request

1. **Forkez** le projet
2. **Créez** une branche pour votre fonctionnalité
3. **Committez** vos changements
4. **Pushez** vers votre fork
5. **Ouvrez** un Pull Request

## Standards de code

### JavaScript/React

```javascript
// ✅ Bon
const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ Mauvais
const getUser = (id) => {
  return prisma.user.findUnique({ where: { id } });
};
```

### Conventions de nommage

- **Variables/Fonctions** : camelCase (`getUserById`, `articleData`)
- **Composants React** : PascalCase (`ArticleCard`, `LoginForm`)
- **Constantes** : UPPER_SNAKE_CASE (`API_URL`, `MAX_LOGIN_ATTEMPTS`)
- **Fichiers** : camelCase pour JS, PascalCase pour composants React
- **Routes API** : kebab-case (`/api/auth/reset-password`)

### Structure des fichiers

```
frontend/src/
├── components/       # Composants réutilisables
├── pages/           # Pages/vues de l'application
├── services/        # Services API, utils
├── hooks/           # Custom React hooks (à venir)
└── contexts/        # React contexts (à venir)

backend/src/
├── controllers/     # Logique métier
├── routes/          # Définition des routes
├── middlewares/     # Middlewares Express
├── utils/           # Fonctions utilitaires
└── services/        # Services métier (à venir)
```

### Code Style

#### React/Frontend

```javascript
// ✅ Bon - Composant fonctionnel avec hooks
import { useState, useEffect } from 'react';

function ArticleCard({ article, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(article.id);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="article-card">
      <h2>{article.title}</h2>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Suppression...' : 'Supprimer'}
      </button>
    </div>
  );
}

export default ArticleCard;
```

#### Backend/API

```javascript
// ✅ Bon - Controller avec gestion d'erreurs
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const article = await prisma.article.create({
      data: { title, content, authorId },
      include: { author: { select: { id: true, name: true } } }
    });

    res.status(201).json({
      message: 'Article créé avec succès',
      article
    });
  } catch (error) {
    console.error('Error in createArticle:', error);
    res.status(500).json({
      error: { message: 'Erreur lors de la création', status: 500 }
    });
  }
};
```

### Validation

Toujours valider les inputs :

```javascript
// Backend
const createArticleValidators = [
  body('title').trim().notEmpty().isLength({ min: 3, max: 200 }),
  body('content').trim().notEmpty().isLength({ min: 10 }),
  handleValidationErrors
];

// Frontend
<input
  type="text"
  required
  minLength={3}
  maxLength={200}
  value={title}
  onChange={handleChange}
/>
```

## Workflow Git

### Branches

- `main` : Production, toujours stable
- `develop` : Développement actif
- `feature/nom-feature` : Nouvelles fonctionnalités
- `bugfix/nom-bug` : Corrections de bugs
- `hotfix/nom-hotfix` : Corrections urgentes en production

### Commits

Suivez la convention **Conventional Commits** :

```bash
# Format
<type>(<scope>): <description>

# Types
feat:     Nouvelle fonctionnalité
fix:      Correction de bug
docs:     Documentation
style:    Formatage, point-virgules manquants, etc.
refactor: Refactoring de code
test:     Ajout de tests
chore:    Maintenance, dépendances

# Exemples
feat(auth): ajouter la connexion avec Google
fix(articles): corriger la pagination
docs(readme): mettre à jour les instructions d'installation
refactor(api): simplifier le controller des articles
```

### Pull Requests

**Template de PR :**

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests effectués
- [ ] Tests manuels
- [ ] Tests unitaires
- [ ] Tests d'intégration

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai commenté le code complexe
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai testé localement avec Docker
```

## Tests

### Tests manuels

Avant chaque PR, testez :

```bash
# 1. Build et démarrage
docker-compose down -v
docker-compose up --build

# 2. Tester les fonctionnalités
# - Inscription
# - Connexion
# - Création article
# - Modification article
# - Suppression article
# - Déconnexion

# 3. Vérifier les logs
docker-compose logs backend
docker-compose logs frontend
```

### Tests automatisés (à venir)

```bash
# Frontend
cd frontend
npm test
npm run test:coverage

# Backend
cd backend
npm test
npm run test:e2e
```

## Documentation

### Documenter les fonctions

```javascript
/**
 * Crée un nouvel article
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 */
const createArticle = async (req, res) => {
  // ...
};
```

### Documenter les composants

```javascript
/**
 * Carte affichant un article avec actions CRUD
 * @param {Object} props
 * @param {Object} props.article - Données de l'article
 * @param {Function} props.onDelete - Callback de suppression
 * @param {Function} props.onEdit - Callback d'édition
 * @param {number} props.currentUserId - ID de l'utilisateur connecté
 */
function ArticleCard({ article, onDelete, onEdit, currentUserId }) {
  // ...
}
```

### Mettre à jour le README

Si vous ajoutez :
- Une nouvelle fonctionnalité → Mettre à jour la section Features
- Un nouvel endpoint → Mettre à jour la section API Documentation
- Une nouvelle dépendance → Mettre à jour la section Stack Technique

## Questions ?

N'hésitez pas à :
- Ouvrir une **Issue** pour discuter
- Demander de l'aide dans les **Discussions**
- Contacter les mainteneurs

Merci pour votre contribution ! 🚀
