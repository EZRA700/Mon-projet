# 🚀 Cheat Sheet - Blog App

## Commandes Essentielles

### Démarrage
```bash
# Windows
start.bat

# Linux/Mac
./start.sh

# Ou manuel
docker-compose up --build
```

### Arrêt
```bash
# Arrêter
docker-compose down

# Arrêter + supprimer volumes (⚠️ supprime les données)
docker-compose down -v
```

### Logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Redémarrage
```bash
# Tout redémarrer
docker-compose restart

# Un service spécifique
docker-compose restart backend
```

## URLs d'Accès

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Interface React |
| Backend | http://localhost:5000 | API REST |
| Health Check | http://localhost:5000/health | Vérification serveur |
| PostgreSQL | localhost:5432 | Base de données |

## Endpoints API

### Auth
```bash
# Inscription
POST /api/auth/register
Body: { "name": "...", "email": "...", "password": "..." }

# Connexion
POST /api/auth/login
Body: { "email": "...", "password": "..." }
```

### Articles (Public)
```bash
# Liste
GET /api/articles

# Détails
GET /api/articles/:id
```

### Articles (Authentifié)
```bash
# Créer (header: Authorization: Bearer TOKEN)
POST /api/articles
Body: { "title": "...", "content": "..." }

# Modifier
PUT /api/articles/:id
Body: { "title": "...", "content": "..." }

# Supprimer
DELETE /api/articles/:id
```

## Variables d'Environnement

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@postgres:5432/mydb
JWT_SECRET=votre_secret_super_securise
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Commandes Docker Utiles

```bash
# État des conteneurs
docker-compose ps

# Entrer dans un conteneur
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U user -d mydb

# Rebuild sans cache
docker-compose build --no-cache
docker-compose up

# Nettoyer Docker
docker system prune -a
docker volume prune
```

## Commandes Prisma

```bash
# Entrer dans le conteneur backend
docker-compose exec backend sh

# Générer le client
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Créer une migration
npx prisma migrate dev --name nom_migration

# Ouvrir Prisma Studio
npx prisma studio
```

## Structure des Fichiers

```
mon-projet/
├── backend/              # API Node.js
│   ├── src/
│   │   ├── controllers/  # Logique métier
│   │   ├── routes/       # Routes API
│   │   ├── middlewares/  # Middlewares
│   │   └── server.js     # Entry point
│   └── prisma/           # DB Schema
├── frontend/             # App React
│   └── src/
│       ├── components/   # Composants
│       ├── pages/        # Pages
│       └── services/     # API calls
└── docker-compose.yml    # Orchestration
```

## Tests Rapides avec curl

```bash
# Health check
curl http://localhost:5000/health

# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Connexion (récupérer le token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Liste des articles
curl http://localhost:5000/api/articles

# Créer un article (remplacer TOKEN)
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test","content":"Contenu test..."}'
```

## Troubleshooting Rapide

| Problème | Solution |
|----------|----------|
| Port déjà utilisé | Changer les ports dans docker-compose.yml |
| Conteneur ne démarre pas | `docker-compose down -v && docker-compose up --build` |
| Erreur CORS | Vérifier VITE_API_URL dans frontend/.env |
| Token invalide | Effacer localStorage et se reconnecter |
| DB non accessible | `docker-compose restart postgres` |
| Build lent | Vérifier .dockerignore, utiliser le cache |

## Codes HTTP

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Erreur de validation |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Non autorisé |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

## Conventions de Code

### Nommage
```javascript
// Variables/Fonctions: camelCase
const userName = "John";
const getUserById = () => {};

// Composants React: PascalCase
function ArticleCard() {}

// Constantes: UPPER_SNAKE_CASE
const API_URL = "...";
const MAX_ATTEMPTS = 3;
```

### Commits
```bash
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: tests
chore: maintenance
```

## Raccourcis Utiles

### Développement Local (sans Docker)

**Backend :**
```bash
cd backend
npm install
npm run dev
```

**Frontend :**
```bash
cd frontend
npm install
npm run dev
```

### Production
```bash
# Build
docker-compose build

# Démarrer en détaché
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

## Ressources

- [README.md](README.md) - Documentation complète
- [QUICKSTART.md](QUICKSTART.md) - Démarrage rapide
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Dépannage
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution

---

**💡 Astuce :** Gardez cette cheat sheet sous la main pour référence rapide !
