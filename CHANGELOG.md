# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2026-02-09

### Ajouté
- ✅ Application full-stack complète avec React, Node.js et PostgreSQL
- ✅ Système d'authentification JWT complet (inscription, connexion, déconnexion)
- ✅ CRUD complet pour les articles de blog
- ✅ Interface utilisateur moderne avec Tailwind CSS
- ✅ Routing côté client avec React Router
- ✅ API RESTful avec Express.js
- ✅ ORM Prisma pour la gestion de la base de données
- ✅ Validation des inputs avec express-validator
- ✅ Middlewares d'authentification et de gestion d'erreurs
- ✅ Conteneurisation complète avec Docker et Docker Compose
- ✅ Multi-stage builds pour optimisation des images Docker
- ✅ Configuration Nginx pour le frontend en production
- ✅ Health checks pour les services
- ✅ Volumes Docker pour la persistance des données
- ✅ Scripts de démarrage pour Windows et Linux/Mac
- ✅ Documentation complète (README, QUICKSTART, ARCHITECTURE)
- ✅ Fichiers .env.example pour la configuration
- ✅ Fichiers .gitignore et .dockerignore

### Sécurité
- ✅ Hashage des mots de passe avec bcrypt (10 rounds)
- ✅ Tokens JWT avec expiration de 24h
- ✅ CORS configuré correctement
- ✅ Validation stricte des inputs
- ✅ Protection des routes sensibles avec middleware
- ✅ Utilisateurs non-root dans les conteneurs Docker
- ✅ Pas de secrets hardcodés

### Pages Frontend
- ✅ Page d'inscription (/register)
- ✅ Page de connexion (/login)
- ✅ Tableau de bord (/dashboard)
- ✅ Création d'article (/articles/create)
- ✅ Édition d'article (/articles/edit/:id)

### Endpoints Backend
- ✅ POST /api/auth/register - Inscription
- ✅ POST /api/auth/login - Connexion
- ✅ GET /api/articles - Liste des articles
- ✅ GET /api/articles/:id - Détails d'un article
- ✅ POST /api/articles - Créer un article (protégé)
- ✅ PUT /api/articles/:id - Modifier un article (protégé)
- ✅ DELETE /api/articles/:id - Supprimer un article (protégé)

### Base de données
- ✅ Table User avec email unique
- ✅ Table Article avec relation vers User
- ✅ Migrations Prisma
- ✅ Cascade delete sur les relations

### DevOps
- ✅ Docker Compose avec 3 services (frontend, backend, postgres)
- ✅ Network partagé entre services
- ✅ Health checks sur tous les services
- ✅ Restart policy configurée
- ✅ Variables d'environnement externalisées

## [À venir] - Prochaines versions

### Prévu pour v1.1.0
- [ ] Tests unitaires et d'intégration
- [ ] Pagination sur la liste d'articles
- [ ] Recherche et filtrage d'articles
- [ ] Upload d'images pour les articles
- [ ] Profil utilisateur
- [ ] Avatar utilisateurs
- [ ] TypeScript sur frontend et/ou backend

### Prévu pour v1.2.0
- [ ] CI/CD avec GitHub Actions
- [ ] Toast notifications (react-toastify)
- [ ] Loading skeletons
- [ ] Formulaires avec react-hook-form
- [ ] Validation Zod côté backend
- [ ] Dark mode
- [ ] Internationalisation (i18n)

### Prévu pour v1.3.0
- [ ] Commentaires sur articles
- [ ] Système de likes
- [ ] Partage sur réseaux sociaux
- [ ] Export PDF des articles
- [ ] Dashboard administrateur
- [ ] Statistiques et analytics

### Prévu pour v2.0.0
- [ ] Migration vers TypeScript complet
- [ ] GraphQL API (alternative à REST)
- [ ] WebSocket pour notifications temps réel
- [ ] Cache avec Redis
- [ ] Queue de tâches avec Bull
- [ ] Upload d'images vers S3/Cloudinary
- [ ] Email notifications
- [ ] OAuth (Google, GitHub)
- [ ] Two-factor authentication (2FA)

## Notes de version

### v1.0.0
Première version stable de l'application. Toutes les fonctionnalités de base sont implémentées et testées manuellement. L'application est prête pour le développement et peut être déployée en production après modification des secrets.

**Commandes de démarrage :**
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh && ./start.sh

# Ou manuellement
docker-compose up --build
```

**Accès :**
- Frontend : http://localhost:3000
- Backend : http://localhost:5000
- PostgreSQL : localhost:5432

---

Pour plus d'informations, consultez la [documentation complète](README.md).
