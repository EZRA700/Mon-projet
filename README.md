# 📝 Blog App - Application Full-Stack Conteneurisée

Une application web complète de gestion d'articles de blog construite avec React, Node.js, PostgreSQL et Docker. Cette application démontre une architecture full-stack moderne avec authentification JWT, CRUD complet et conteneurisation complète.

## ⚡ Démarrage Rapide

**Pour les utilisateurs qui veulent juste lancer l'application :**

```bash
# Windows
start.bat

# Linux/Mac
./start.sh

# Ou manuellement
docker-compose up --build -d
```

**Accès :**
- Frontend : http://localhost:3012
- API Backend : http://localhost:5012/api

📖 **Plus de détails ?** Voir [INSTALL.md](INSTALL.md) pour la documentation complète d'installation.

---

## 🚀 Fonctionnalités

- ✅ **Authentification complète** : Inscription, connexion, gestion de session JWT
- ✅ **CRUD Articles** : Créer, lire, modifier et supprimer des articles
- ✅ **Sécurité** : Hashage bcrypt, validation des tokens, protection des routes
- ✅ **Interface moderne** : Design responsive avec Tailwind CSS
- ✅ **Architecture conteneurisée** : Déploiement facile avec Docker Compose
- ✅ **Base de données** : PostgreSQL avec Prisma ORM
- ✅ **Validation** : Validation des inputs côté backend et frontend

## 🛠️ Stack Technique

### Frontend
- **React 18** avec Vite
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **Axios** pour les appels API
- **Nginx** pour le serveur de production

### Backend
- **Node.js** avec Express.js
- **Prisma ORM** pour la base de données
- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe
- **express-validator** pour la validation

### Base de données
- **PostgreSQL 16** (conteneurisée)

### DevOps
- **Docker** & **Docker Compose**
- Multi-stage builds pour l'optimisation

## 📋 Prérequis

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)

C'est tout ! Pas besoin de Node.js, PostgreSQL ou autre outil localement.

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd mon-projet
```

### 2. Configurer les variables d'environnement
```bash
cp .env.example .env
```

Éditez le fichier `.env` et modifiez les valeurs selon vos besoins :
```env
# Variables PostgreSQL
POSTGRES_USER=user
POSTGRES_PASSWORD=mot_de_passe_securise
POSTGRES_DB=mydb

# Variables Backend
DATABASE_URL=postgresql://user:mot_de_passe_securise@postgres:5432/mydb
JWT_SECRET=votre_secret_jwt_ultra_securise_123456789
PORT=5000
NODE_ENV=production

# Variables Frontend
VITE_API_URL=http://localhost:5012/api
```

⚠️ **Important** : Changez absolument `JWT_SECRET` et `POSTGRES_PASSWORD` en production !

### 3. Lancer l'application
```bash
docker-compose up --build
```

L'application sera accessible à :
- **Frontend** : http://localhost:3012
- **Backend API** : http://localhost:5012/api
- **PostgreSQL** : localhost:5432

## 📚 Documentation API

### Authentication

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur.

**Body :**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201) :**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-09T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`
Connexion d'un utilisateur existant.

**Body :**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200) :**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Articles

#### GET `/api/articles`
Récupère tous les articles (public).

**Response (200) :**
```json
{
  "message": "Articles récupérés avec succès",
  "count": 2,
  "articles": [
    {
      "id": 1,
      "title": "Mon premier article",
      "content": "Contenu de l'article...",
      "authorId": 1,
      "author": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-02-09T10:00:00.000Z",
      "updatedAt": "2026-02-09T10:00:00.000Z"
    }
  ]
}
```

#### GET `/api/articles/:id`
Récupère un article spécifique (public).

**Response (200) :**
```json
{
  "message": "Article récupéré avec succès",
  "article": {
    "id": 1,
    "title": "Mon premier article",
    "content": "Contenu de l'article...",
    "authorId": 1,
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-09T10:00:00.000Z",
    "updatedAt": "2026-02-09T10:00:00.000Z"
  }
}
```

#### POST `/api/articles`
Crée un nouvel article (authentification requise).

**Headers :**
```
Authorization: Bearer <token>
```

**Body :**
```json
{
  "title": "Mon nouvel article",
  "content": "Le contenu de mon article..."
}
```

**Response (201) :**
```json
{
  "message": "Article créé avec succès",
  "article": {
    "id": 2,
    "title": "Mon nouvel article",
    "content": "Le contenu de mon article...",
    "authorId": 1,
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-09T11:00:00.000Z",
    "updatedAt": "2026-02-09T11:00:00.000Z"
  }
}
```

#### PUT `/api/articles/:id`
Modifie un article existant (authentification requise + être l'auteur).

**Headers :**
```
Authorization: Bearer <token>
```

**Body :**
```json
{
  "title": "Titre modifié",
  "content": "Contenu modifié..."
}
```

**Response (200) :**
```json
{
  "message": "Article mis à jour avec succès",
  "article": {
    "id": 1,
    "title": "Titre modifié",
    "content": "Contenu modifié...",
    "authorId": 1,
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-09T10:00:00.000Z",
    "updatedAt": "2026-02-09T12:00:00.000Z"
  }
}
```

#### DELETE `/api/articles/:id`
Supprime un article (authentification requise + être l'auteur).

**Headers :**
```
Authorization: Bearer <token>
```

**Response (200) :**
```json
{
  "message": "Article supprimé avec succès"
}
```

### Codes d'erreur

- **400** : Erreur de validation
- **401** : Non authentifié ou token invalide
- **403** : Non autorisé (pas l'auteur)
- **404** : Ressource non trouvée
- **500** : Erreur serveur

## 📁 Structure du Projet

```
mon-projet/
├── frontend/                    # Application React
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── Navbar.jsx
│   │   │   └── ArticleCard.jsx
│   │   ├── pages/               # Pages de l'application
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateArticle.jsx
│   │   │   └── EditArticle.jsx
│   │   ├── services/            # Services API
│   │   │   └── api.js
│   │   ├── App.jsx              # Composant principal
│   │   ├── main.jsx             # Point d'entrée
│   │   └── index.css            # Styles globaux
│   ├── Dockerfile               # Configuration Docker
│   ├── nginx.conf               # Configuration Nginx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                     # API Node.js
│   ├── src/
│   │   ├── controllers/         # Logique métier
│   │   │   ├── auth.controller.js
│   │   │   └── article.controller.js
│   │   ├── routes/              # Routes API
│   │   │   ├── auth.routes.js
│   │   │   └── article.routes.js
│   │   ├── middlewares/         # Middlewares
│   │   │   └── auth.js
│   │   ├── utils/               # Utilitaires
│   │   │   └── validators.js
│   │   └── server.js            # Point d'entrée
│   ├── prisma/
│   │   └── schema.prisma        # Schéma de base de données
│   ├── Dockerfile               # Configuration Docker
│   └── package.json
│
├── docker-compose.yml           # Orchestration Docker
├── .env.example                 # Variables d'environnement exemple
├── .gitignore
└── README.md
```

## 🔐 Sécurité

- **Hashage des mots de passe** : bcrypt avec 10 rounds
- **JWT** : Tokens avec expiration de 24h
- **CORS** : Configuré pour accepter les requêtes cross-origin
- **Validation** : Inputs validés côté backend avec express-validator
- **Protection des routes** : Middleware d'authentification sur routes sensibles
- **Users non-root** : Containers exécutés avec utilisateurs non-root
- **Secrets** : Jamais hardcodés, toujours via variables d'environnement

## 🧪 Tester l'application

1. Accédez à http://localhost:3000
2. Créez un compte via la page d'inscription
3. Connectez-vous avec vos identifiants
4. Créez, modifiez et supprimez des articles

## 🐳 Commandes Docker utiles

```bash
# Démarrer les conteneurs
docker-compose up

# Démarrer en mode détaché
docker-compose up -d

# Rebuild les images
docker-compose up --build

# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend

# Accéder au shell d'un conteneur
docker-compose exec backend sh
docker-compose exec postgres psql -U user -d mydb
```

## 🔄 Migrations Prisma

Les migrations sont automatiquement exécutées au démarrage du backend. Pour créer une nouvelle migration :

```bash
# Accéder au conteneur backend
docker-compose exec backend sh

# Créer une migration
npx prisma migrate dev --name nom_migration

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio
npx prisma studio
```

## 🚀 Déploiement en Production

1. Modifiez les variables d'environnement dans `.env`
2. Utilisez des secrets forts pour `JWT_SECRET` et `POSTGRES_PASSWORD`
3. Configurez un reverse proxy (nginx, traefik) si nécessaire
4. Activez HTTPS avec Let's Encrypt
5. Configurez les backups de la base de données
6. Surveillez les logs et performances

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📝 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Développé avec ❤️ par un développeur full-stack junior passionné.

---

**Note** : Ce projet est un exemple éducatif. Pour une utilisation en production, ajoutez des tests, de la surveillance, et renforcez la sécurité.
