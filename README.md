# Lop-Market

Salut ! Bienvenue sur mon projet de boutique en ligne. C'est une application full-stack que j'ai développé avec React, Node.js et PostgreSQL. Tout est conteneurisé avec Docker pour faciliter le déploiement.

## Comment lancer le projet ?

C'est super simple, juste besoin de Docker sur ta machine :

```bash
# Si t'es sur Windows
start.bat

# Si t'es sur Linux/Mac
./start.sh

# Ou directement avec docker-compose
docker-compose up --build -d
```

Une fois lancé, tu peux accéder à :
- L'application : http://localhost:3012
- L'API : http://localhost:5012/api

C'est prêt ! 🚀

---

## Ce que fait l'application

Bon alors en gros c'est une application de gestion d'articles de boutique. Voici ce qu'on peut faire :

- S'inscrire et se connecter (avec JWT pour la sécurité)
- Créer des articles avec des images
- Modifier et supprimer ses propres articles
- Voir tous les articles des autres utilisateurs
- Upload d'images depuis son ordinateur ou via URL

J'ai mis pas mal de travail sur la sécurité : les mots de passe sont hashés avec bcrypt, y'a de la validation partout, et seul l'auteur d'un article peut le modifier.

## Technologies utilisées

### Côté Frontend
- React 18 (avec Vite parce que c'est rapide)
- Tailwind CSS pour le design
- React Router pour la navigation
- Axios pour les requêtes HTTP
- Nginx pour servir en production

### Côté Backend  
- Node.js + Express (classique mais efficace)
- Prisma comme ORM (super pratique pour gérer la DB)
- JWT pour l'authentification
- bcryptjs pour hasher les passwords
- Multer pour gérer l'upload de fichiers

### Base de données
- PostgreSQL 16 dans un container Docker

### DevOps
- Docker & Docker Compose
- Multi-stage builds pour optimiser les images

## Installation

### Ce dont tu as besoin

Juste Docker Desktop installé sur ta machine, c'est tout. Pas besoin d'installer Node.js ou PostgreSQL.

### Les étapes

1. Clone le repo
```bash
git clone <ton-repo>
cd "Mon projet"
```

2. Normalement le fichier .env existe déjà à la racine. Si jamais il manque :
```bash
cp .env.example .env
```

Le fichier .env contient les configs importantes :
```env
# Config PostgreSQL
POSTGRES_USER=bloguser
POSTGRES_PASSWORD=SecurePassword123
POSTGRES_DB=blogdb

# Config Backend
DATABASE_URL=postgresql://bloguser:SecurePassword123@postgres:5432/blogdb
JWT_SECRET=ton_super_secret_ultra_long
PORT=5000
NODE_ENV=production

# Config Frontend
VITE_API_URL=http://localhost:5012/api
```

**IMPORTANT** : Change le JWT_SECRET et le password en prod !

3. Lance tout avec Docker
```bash
docker-compose up --build -d
```

Ça va prendre quelques minutes la première fois (téléchargement des images Docker, installation des dépendances, etc.)

L'app sera disponible sur http://localhost:3012

## Comment utiliser l'API

### Inscription

**POST** `/api/auth/register`

Envoie ça :
```json
{
  "name": "Ton Nom",
  "email": "ton@email.com",
  "password": "motdepasse123"
}
```

Tu reçois un token JWT en retour pour t'authentifier.

### Connexion

**POST** `/api/auth/login`

```json
{
  "email": "ton@email.com",
  "password": "motdepasse123"
}
```

Pareil, tu récupères ton token.

### Récupérer tous les articles

**GET** `/api/articles`

Pas besoin d'être connecté pour ça, c'est public.

### Créer un article  

**POST** `/api/articles`

Ajoute ton token dans les headers :
```
Authorization: Bearer ton_token_ici
```

Et envoie :
```json
{
  "title": "Mon article",
  "content": "Le contenu...",
  "imageUrl": "https://exemple.com/image.jpg"
}
```

L'imageUrl est optionnel.

### Modifier un article

**PUT** `/api/articles/:id`

Faut être l'auteur de l'article, sinon ça renvoie une erreur 403.

### Supprimer un article  

**DELETE** `/api/articles/:id`

Pareil, faut être l'auteur.

### Upload d'image

**POST** `/api/upload`

Utilise FormData pour envoyer ton fichier. L'API accepte JPG, PNG, GIF et WebP jusqu'à 5MB.

## Structure des dossiers

```
Mon projet/
├── frontend/                # App React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Les pages (Login, Dashboard, etc.)
│   │   └── services/       # Config API avec Axios
│   └── Dockerfile
│
├── backend/                 # API Express
│   ├── src/
│   │   ├── controllers/    # Logique métier
│   │   ├── routes/         # Routes de l'API
│   │   ├── middlewares/    # Auth et autres middlewares
│   │   └── utils/          # Validators
│   ├── prisma/             # Schéma DB + migrations
│   └── Dockerfile
│
└── docker-compose.yml      # Config Docker
```

## Sécurité

J'ai fait attention à la sécu :
- Mots de passe hashés avec bcrypt (10 rounds)
- Tokens JWT qui expirent après 24h
- Validation des inputs côté backend
- CORS configuré correctement
- Containers qui tournent avec des users non-root
- Jamais de secrets dans le code (tout en variables d'env)

## Tester l'application

1. Va sur http://localhost:3012
2. Inscris-toi avec un email et un mot de passe
3. Connecte-toi
4. Crée ton premier article (avec ou sans image)
5. Teste la modification et la suppression

## Commandes Docker utiles

```bash
# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Arrêter tout
docker-compose down

# Tout supprimer (y compris les données)
docker-compose down -v

# Redémarrer un service
docker-compose restart backend

# Ouvrir un shell dans le container
docker-compose exec backend sh
```

## Trucs à savoir sur Prisma

Les migrations se lancent automatiquement au démarrage. Si tu veux créer une nouvelle migration :

```bash
docker-compose exec backend sh
npx prisma migrate dev --name ma_migration
```

Pour voir la DB avec Prisma Studio :
```bash
docker-compose exec backend sh
npx prisma studio
```

## Pour la prod

Si tu veux le mettre en production :
1. Change tous les secrets dans le .env
2. Configure un reverse proxy (nginx ou traefik)
3. Active HTTPS avec Let's Encrypt
4. Mets en place des backups de la DB
5. Surveille les logs

## Améliorations possibles

Y'a plein de trucs que je pourrais ajouter :
- Pagination des articles
- Recherche et filtres
- Système de likes/commentaires
- Reset de password par email
- Tests unitaires et E2E
- CI/CD avec GitHub Actions
- Stockage des images sur un CDN type S3

---

Voilà c'est tout ! Si t'as des questions ou des suggestions, hésite pas.

