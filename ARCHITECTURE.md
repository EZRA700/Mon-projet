# Architecture de l'Application Blog Full-Stack

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                              │
│                     (Navigateur Web)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP (Port 3000)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      FRONTEND                                    │
│                  (React + Vite + Nginx)                          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Register   │  │    Login     │  │  Dashboard   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  CreateArticle│  │ EditArticle │  │  Components  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│                    API Service (Axios)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/REST (Port 5000)
                         │ JWT Authentication
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                       BACKEND                                    │
│                  (Node.js + Express.js)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Routes                               │  │
│  │  /api/auth/*  │  /api/articles/*                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────▼──────────────────────────────────┐ │
│  │                   Middlewares                             │ │
│  │  • CORS  • JSON Parser  • Auth JWT  • Validators         │ │
│  └────────────────────────┬──────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼──────────────────────────────────┐ │
│  │                   Controllers                             │ │
│  │  • Auth Controller  • Article Controller                  │ │
│  └────────────────────────┬──────────────────────────────────┘ │
│                           │                                      │
│                           │ Prisma ORM                           │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │ PostgreSQL Protocol (Port 5432)
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                      BASE DE DONNÉES                              │
│                      (PostgreSQL 16)                              │
│                                                                   │
│  ┌─────────────────┐           ┌─────────────────┐              │
│  │   Table: User   │           │ Table: Article  │              │
│  ├─────────────────┤           ├─────────────────┤              │
│  │ • id            │           │ • id            │              │
│  │ • email (unique)│◄─────────┤│ • authorId (FK) │              │
│  │ • password      │           │ • title         │              │
│  │ • name          │           │ • content       │              │
│  │ • createdAt     │           │ • createdAt     │              │
│  └─────────────────┘           │ • updatedAt     │              │
│                                 └─────────────────┘              │
│                                                                   │
│  Volume Docker: postgres_data (Données persistantes)             │
└───────────────────────────────────────────────────────────────────┘
```

## Flux d'authentification

```
┌──────────┐                                                    ┌──────────┐
│  Client  │                                                    │  Server  │
└────┬─────┘                                                    └────┬─────┘
     │                                                               │
     │  1. POST /api/auth/register                                  │
     │  { name, email, password }                                   │
     ├──────────────────────────────────────────────────────────────►
     │                                                               │
     │                           2. Hasher password (bcrypt)         │
     │                           3. Créer User dans DB              │
     │                           4. Générer JWT token               │
     │                                                               │
     │  5. Return { user, token }                                   │
     ◄──────────────────────────────────────────────────────────────┤
     │                                                               │
     │  6. Stocker token dans localStorage                          │
     │                                                               │
     │  7. Toutes les requêtes suivantes                            │
     │  Header: Authorization: Bearer <token>                       │
     ├──────────────────────────────────────────────────────────────►
     │                                                               │
     │                           8. Vérifier & décoder JWT          │
     │                           9. Extraire user.id                │
     │                           10. Exécuter requête               │
     │                                                               │
     │  11. Return data                                             │
     ◄──────────────────────────────────────────────────────────────┤
     │                                                               │
```

## Flux CRUD Article

```
┌──────────┐                                                    ┌──────────┐
│  Client  │                                                    │  Server  │
└────┬─────┘                                                    └────┬─────┘
     │                                                               │
     │  POST /api/articles                                          │
     │  Authorization: Bearer <token>                               │
     │  { title, content }                                          │
     ├──────────────────────────────────────────────────────────────►
     │                                                               │
     │                           1. authMiddleware: Vérifier JWT    │
     │                           2. Extraire user.id du token       │
     │                           3. Valider inputs                  │
     │                           4. Créer article (authorId: user.id)│
     │                                                               │
     │  Return { article }                                          │
     ◄──────────────────────────────────────────────────────────────┤
     │                                                               │
     │                                                               │
     │  PUT /api/articles/:id                                       │
     │  Authorization: Bearer <token>                               │
     │  { title, content }                                          │
     ├──────────────────────────────────────────────────────────────►
     │                                                               │
     │                           1. authMiddleware: Vérifier JWT    │
     │                           2. Vérifier article.authorId == user.id │
     │                           3. Mettre à jour article           │
     │                                                               │
     │  Return { article }                                          │
     ◄──────────────────────────────────────────────────────────────┤
     │                                                               │
```

## Stack Technique Détaillée

### Frontend
- **React 18** : Bibliothèque UI moderne avec hooks
- **Vite** : Build tool ultra-rapide
- **Tailwind CSS** : Framework CSS utility-first
- **React Router v6** : Routing côté client
- **Axios** : Client HTTP avec intercepteurs
- **Nginx** : Serveur web production

### Backend
- **Node.js 20** : Runtime JavaScript
- **Express.js** : Framework web minimaliste
- **Prisma** : ORM moderne type-safe
- **JWT** : Tokens d'authentification
- **bcryptjs** : Hashage de mots de passe
- **express-validator** : Validation d'inputs

### Base de données
- **PostgreSQL 16** : Base de données relationnelle
- **Schéma** : Users + Articles avec relation 1-N

### DevOps
- **Docker** : Conteneurisation
- **Docker Compose** : Orchestration multi-services
- **Multi-stage builds** : Optimisation des images
- **Health checks** : Surveillance des services
- **Volumes** : Persistance des données

## Sécurité

### Authentification
- Passwords hashés avec bcrypt (10 rounds)
- JWT avec expiration 24h
- Tokens stockés dans localStorage
- Refresh automatique si token expiré

### Autorisation
- Middleware vérifie JWT sur routes protégées
- Vérification author === current user pour edit/delete
- CORS configuré

### Validation
- express-validator côté backend
- Validation HTML5 côté frontend
- Sanitization des inputs

### Docker
- Utilisateurs non-root dans conteneurs
- Secrets via variables d'environnement
- Réseau interne isolé

## Performance

### Frontend
- Build optimisé avec Vite
- Code splitting automatique
- Cache assets statiques (1 an)
- Gzip compression via Nginx
- Images optimisées

### Backend
- Connexion pool Prisma
- Pas de N+1 queries (includes)
- Indexes sur colonnes fréquentes
- Health checks pour monitoring

### Base de données
- Index sur User.email (unique)
- Index automatique sur clés primaires
- Cascade delete sur relations
- Volume Docker pour persistance

## Déploiement

```
Development          →    Production
─────────────             ─────────────
npm run dev               docker-compose up
Hot reload               Multi-stage builds
.env.local               .env avec secrets forts
Sans HTTPS               HTTPS (Let's Encrypt)
Localhost                Reverse proxy (nginx/traefik)
```

## Extensions Potentielles

- [ ] Tests (Jest, React Testing Library)
- [ ] CI/CD (GitHub Actions, GitLab CI)
- [ ] Monitoring (Prometheus, Grafana)
- [ ] Logs centralisés (ELK Stack)
- [ ] Cache (Redis)
- [ ] Upload images (S3, Cloudinary)
- [ ] Pagination backend
- [ ] Recherche full-text
- [ ] WebSockets (temps réel)
- [ ] Email notifications
