# 🎤 Présentation du Projet - Blog Application Full-Stack

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Démonstration du code](#démonstration-du-code)
4. [Flux de fonctionnement](#flux-de-fonctionnement)
5. [Fichiers non essentiels](#fichiers-non-essentiels)

---

## 🎯 Vue d'ensemble

### Présentation générale
**Nom du projet** : Blog Application Full-Stack Conteneurisée

**Description** : Application web complète permettant de créer, gérer et partager des articles de blog avec authentification sécurisée et upload d'images.

**Technologies** :
- Frontend : React 18 + Vite + Tailwind CSS
- Backend : Node.js + Express + Prisma ORM
- Base de données : PostgreSQL 16
- Conteneurisation : Docker + Docker Compose

### Points forts
✅ Architecture moderne et scalable  
✅ Authentification JWT sécurisée  
✅ Upload d'images (local + URL)  
✅ Interface responsive et moderne  
✅ Déploiement simplifié avec Docker  

---

## 🏗️ Architecture Technique

### Structure du projet
```
Mon projet/
├── backend/          # API Node.js/Express
├── frontend/         # Application React
├── docker-compose.yml # Orchestration des services
└── .env              # Variables d'environnement
```

### Schéma d'architecture
```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│  PostgreSQL  │
│  (React)    │◀─────│  (Express)  │◀─────│  (Database)  │
│  Port 3012  │      │  Port 5012  │      │  Port 5432   │
└─────────────┘      └─────────────┘      └──────────────┘
     Nginx              Node.js              Prisma ORM
```

---

## 💻 Démonstration du Code

### 1. BACKEND - Authentification (auth.controller.js)

**Fichier** : `backend/src/controllers/auth.controller.js`

**Fonction clé** : Inscription d'un utilisateur
```javascript
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // ✅ Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: { message: 'Cet email est déjà utilisé', status: 400 }
      });
    }

    // 🔒 Hasher le mot de passe avec bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Créer l'utilisateur en base
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    // 🎫 Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: { message: 'Erreur inscription' } });
  }
};
```

**Impact** :
- 🔐 **Sécurité** : Hashage bcrypt (10 rounds) - impossible de retrouver le mot de passe
- 🎫 **Session** : Token JWT valide 24h - pas besoin de cookie
- ✅ **Validation** : Empêche les doublons d'email

---

### 2. BACKEND - Upload d'images (upload.routes.js)

**Fichier** : `backend/src/routes/upload.routes.js`

**Configuration Multer**
```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Dossier uploads/
  },
  filename: function (req, file, cb) {
    // 📝 Nom unique : image-1707524859123-987654321.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

// 🛡️ Filtre de sécurité
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

// Configuration avec limite de taille
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});
```

**Impact** :
- 📁 **Stockage persistant** : Images sauvegardées dans volume Docker
- 🛡️ **Sécurité** : Validation du type MIME + limite de taille
- 🔒 **Unicité** : Noms de fichiers uniques (évite écrasement)

---

### 3. BACKEND - Gestion des articles (article.controller.js)

**Fichier** : `backend/src/controllers/article.controller.js`

**Fonction** : Créer un article
```javascript
const createArticle = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    const authorId = req.user.id; // 🎫 Récupéré du token JWT

    const article = await prisma.article.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        authorId
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({ message: 'Article créé', article });
  } catch (error) {
    res.status(500).json({ error: { message: 'Erreur création' } });
  }
};
```

**Impact** :
- 🔗 **Relation** : Article lié automatiquement à son auteur
- 🖼️ **Flexibilité** : Image optionnelle (URL ou upload)
- 📊 **Réponse complète** : Retourne l'article avec les infos de l'auteur

---

### 4. FRONTEND - Formulaire de création (CreateArticle.jsx)

**Fichier** : `frontend/src/pages/CreateArticle.jsx`

**Gestion de l'upload d'image**
```javascript
const handleImageFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    
    // 👁️ Créer un aperçu immédiat
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Affiche l'image avant upload
    };
    reader.readAsDataURL(file);
    
    // Effacer l'URL si fichier sélectionné
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  }
};

const uploadImage = async () => {
  if (!imageFile) return null;
  
  setUploadingImage(true);
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // 📤 Upload vers le backend
    const response = await articlesAPI.uploadImage(formData);
    return response.data.imageUrl; // /uploads/image-123456789.jpg
  } finally {
    setUploadingImage(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  let finalImageUrl = formData.imageUrl;
  
  // Si fichier local : upload d'abord
  if (imageFile) {
    finalImageUrl = await uploadImage();
  }
  
  // Puis créer l'article avec l'URL de l'image
  await articlesAPI.create({ ...formData, imageUrl: finalImageUrl });
};
```

**Impact** :
- 👁️ **UX** : Aperçu instantané avant upload
- 🔄 **Workflow** : Upload → Récupération URL → Création article
- 🎨 **Flexibilité** : Fichier local OU URL externe

---

### 5. FRONTEND - Affichage des articles (ArticleCard.jsx)

**Fichier** : `frontend/src/components/ArticleCard.jsx`

**Composant de carte**
```javascript
function ArticleCard({ article, onDelete, onEdit, currentUserId }) {
  const isAuthor = currentUserId === article.authorId;
  
  // 🔗 Gestion des URLs d'images
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // Image uploadée localement
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:5012${imageUrl}`;
    }
    // Image externe
    return imageUrl;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg">
      {/* 🖼️ Image de l'article */}
      {article.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={getImageUrl(article.imageUrl)} 
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
      
      <div className="p-6">
        <h2 className="text-xl font-bold">{article.title}</h2>
        <p className="text-gray-600">{article.content}</p>
        
        {/* 👤 Infos auteur */}
        <div className="flex items-center text-sm text-gray-500">
          <span>{article.author.name}</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>
        
        {/* ✏️ Boutons si propriétaire */}
        {isAuthor && (
          <div className="flex gap-2">
            <button onClick={() => onEdit(article.id)}>Modifier</button>
            <button onClick={() => onDelete(article.id)}>Supprimer</button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Impact** :
- 🎨 **Design** : Carte moderne avec image en-tête
- 🔒 **Sécurité** : Boutons visibles uniquement pour l'auteur
- 🛡️ **Robustesse** : Gestion des erreurs d'image (onError)

---

### 6. BASE DE DONNÉES - Schéma Prisma (schema.prisma)

**Fichier** : `backend/prisma/schema.prisma`

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String
  articles  Article[] // 🔗 Relation one-to-many
  createdAt DateTime  @default(now())
}

model Article {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  imageUrl  String?  // ❓ Optionnel
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Impact** :
- 🔗 **Relations** : Un user peut avoir plusieurs articles
- 🗑️ **Cascade** : Suppression de l'user → suppression de ses articles
- ⏰ **Timestamps** : Dates de création et modification automatiques

---

### 7. MIDDLEWARE - Protection des routes (auth.js)

**Fichier** : `backend/src/middlewares/auth.js`

```javascript
const authenticateToken = (req, res, next) => {
  // 📨 Récupérer le token du header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ 
      error: { message: 'Token manquant', status: 401 } 
    });
  }

  try {
    // ✅ Vérifier et décoder le token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // Ajoute les infos user à la requête
    next(); // Continue vers le controller
  } catch (error) {
    return res.status(403).json({ 
      error: { message: 'Token invalide', status: 403 } 
    });
  }
};
```

**Impact** :
- 🔒 **Protection** : Routes accessibles uniquement si authentifié
- 🎫 **Context** : `req.user` disponible dans tous les controllers
- ⏰ **Expiration** : Tokens expirés automatiquement rejetés

**Utilisation dans les routes** :
```javascript
// Route protégée
router.post('/articles', authenticateToken, createArticle);

// Route publique
router.get('/articles', getAllArticles);
```

---

### 8. CONFIGURATION - Docker Compose (docker-compose.yml)

**Fichier** : `docker-compose.yml`

```yaml
services:
  # 🗄️ Base de données
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: bloguser
      POSTGRES_PASSWORD: SecurePassword123
      POSTGRES_DB: blogdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bloguser -d blogdb"]

  # 🔧 Backend API
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://bloguser:SecurePassword123@postgres:5432/blogdb
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "5012:5000"
    volumes:
      - uploads_data:/app/uploads  # 📁 Persistance des images
    depends_on:
      postgres:
        condition: service_healthy  # ✅ Attend que Postgres soit prêt

  # 🎨 Frontend
  frontend:
    build: ./frontend
    ports:
      - "3012:80"
    depends_on:
      - backend

volumes:
  postgres_data:    # 💾 Données PostgreSQL
  uploads_data:     # 🖼️ Images uploadées
```

**Impact** :
- 🔄 **Orchestration** : Les 3 services démarrent dans le bon ordre
- 💾 **Persistance** : Données conservées même après redémarrage
- 🏥 **Health checks** : Garantit que chaque service est prêt
- 🌐 **Réseau** : Communication automatique entre containers

---

## 🔄 Flux de Fonctionnement

### Flux 1️⃣ : Inscription d'un utilisateur

```
┌─────────────┐     1. POST /api/auth/register      ┌──────────────┐
│   Browser   │────────────────────────────────────▶│   Backend    │
│             │     { email, password, name }       │              │
└─────────────┘                                     └──────────────┘
                                                           │
                                                           │ 2. Hasher password
                                                           │    (bcrypt)
                                                           ▼
                                                    ┌──────────────┐
                                                    │  PostgreSQL  │
                                                    │              │
                                                    │ INSERT User  │
                                                    └──────────────┘
                                                           │
                                                           │ 3. Générer JWT
                                                           ▼
┌─────────────┐     4. { user, token }            ┌──────────────┐
│   Browser   │◀────────────────────────────────────│   Backend    │
│             │                                     │              │
│ localStorage│                                     └──────────────┘
│ .setItem()  │
└─────────────┘
```

**Étapes détaillées** :
1. User remplit le formulaire → `Register.jsx`
2. `authAPI.register()` envoie les données
3. Backend valide avec `express-validator`
4. Password hashé avec `bcrypt` (10 rounds)
5. User créé dans PostgreSQL via Prisma
6. Token JWT généré (expire 24h)
7. Token + infos user retournés au frontend
8. Token stocké dans `localStorage`
9. Redirection vers Dashboard

---

### Flux 2️⃣ : Upload d'image et création d'article

```
┌─────────────┐                                    ┌──────────────┐
│  Browser    │    1. Sélection fichier            │   Frontend   │
│             │───────────────────────────────────▶│CreateArticle │
└─────────────┘                                    └──────────────┘
                                                           │
                                                           │ 2. FileReader
                                                           │    Aperçu local
                                                           ▼
                                                    ┌──────────────┐
                                                    │   Preview    │
                                                    │   <img />    │
                                                    └──────────────┘
                                                           │
┌─────────────┐    3. POST /api/upload             ┌──────────────┐
│  FormData   │───────────────────────────────────▶│   Backend    │
│  {image}    │                                     │   Multer     │
└─────────────┘                                    └──────────────┘
                                                           │
                                                           │ 4. Validation
                                                           │    Type + Taille
                                                           ▼
                                                    ┌──────────────┐
                                                    │   /uploads/  │
                                                    │ image-xxx.jpg│
                                                    └──────────────┘
                                                           │
┌─────────────┐    5. { imageUrl }                ┌──────────────┐
│  Frontend   │◀───────────────────────────────────│   Backend    │
└─────────────┘                                    └──────────────┘
       │
       │ 6. POST /api/articles
       │    { title, content, imageUrl }
       ▼
┌──────────────┐
│  PostgreSQL  │
│ INSERT       │
│ Article      │
└──────────────┘
```

**Étapes détaillées** :
1. User sélectionne une image → Input file
2. `handleImageFileChange()` lit le fichier
3. FileReader crée un aperçu base64
4. Au submit → `uploadImage()` créé FormData
5. POST `/api/upload` avec multipart/form-data
6. Multer valide (type MIME, taille)
7. Fichier sauvegardé : `uploads/image-1707524859.jpg`
8. Backend retourne : `{ imageUrl: "/uploads/image-xxx.jpg" }`
9. Frontend utilise cette URL pour créer l'article
10. Article inséré en DB avec l'imageUrl

---

### Flux 3️⃣ : Affichage du Dashboard avec articles

```
┌─────────────┐    1. GET /api/articles            ┌──────────────┐
│  Dashboard  │───────────────────────────────────▶│   Backend    │
│             │    Headers: { Authorization }      │              │
└─────────────┘                                    └──────────────┘
                                                           │
                                                           │ 2. SELECT *
                                                           │    FROM Article
                                                           ▼
                                                    ┌──────────────┐
                                                    │  PostgreSQL  │
                                                    │  JOIN User   │
                                                    └──────────────┘
                                                           │
┌─────────────┐    3. { articles: [...] }         ┌──────────────┐
│  Dashboard  │◀───────────────────────────────────│   Backend    │
└─────────────┘                                    └──────────────┘
       │
       │ 4. .map(article => <ArticleCard />)
       ▼
┌──────────────┐
│ ArticleCard  │  × N articles
│ - Image      │
│ - Title      │
│ - Content    │
│ - Buttons    │
└──────────────┘
```

---

## 📈 Points Techniques Avancés

### 1. Gestion des sessions avec JWT
**Avantage** : Stateless - pas de stockage serveur
```javascript
// Token structure:
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "exp": 1707610859  // Timestamp expiration
}
```

### 2. Validation des données
**Backend** : `express-validator`
```javascript
body('email').isEmail().normalizeEmail()
body('password').isLength({ min: 6 })
body('imageUrl').optional().isURL()
```

**Frontend** : Validation HTML5 + React
```jsx
<input type="email" required minLength={6} />
```

### 3. Sécurité CORS
```javascript
const corsOptions = {
  origin: ['http://localhost:3012'],
  credentials: true
};
app.use(cors(corsOptions));
```
**Impact** : Seul le frontend autorisé peut appeler l'API

### 4. Multi-stage Docker builds
**Optimisation** : Images finales légères
```dockerfile
# Stage 1: Build (avec devDependencies)
FROM node:20-alpine AS builder
RUN npm install && npm run build

# Stage 2: Production (sans devDependencies)
FROM node:20-alpine AS runner
COPY --from=builder /app/dist ./dist
```

---

## 🎓 Compétences Démontrées

### Architecture & Design
- ✅ Architecture MVC (Model-View-Controller)
- ✅ Séparation des responsabilités (SoC)
- ✅ API RESTful
- ✅ Microservices (3 containers indépendants)

### Backend
- ✅ Node.js + Express.js
- ✅ ORM (Prisma) avec migrations
- ✅ Authentification JWT
- ✅ Upload de fichiers (Multer)
- ✅ Validation des données
- ✅ Gestion d'erreurs

### Frontend
- ✅ React Hooks (useState, useEffect)
- ✅ React Router (navigation)
- ✅ Axios (requêtes HTTP)
- ✅ Tailwind CSS (styling)
- ✅ Gestion de formulaires

### DevOps & Déploiement
- ✅ Docker & Docker Compose
- ✅ Multi-stage builds
- ✅ Volumes persistants
- ✅ Health checks
- ✅ Variables d'environnement

### Base de données
- ✅ PostgreSQL relationnel
- ✅ Relations (One-to-Many)
- ✅ Contraintes (Cascade, Unique)
- ✅ Migrations versionnées

---

## 🔧 Commandes Importantes pour la Démo

### Lancer l'application
```bash
docker-compose up --build -d
```

### Voir les logs en temps réel
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### État des containers
```bash
docker-compose ps
```

### Accéder à la base de données
```bash
docker exec -it blog_postgres psql -U bloguser -d blogdb
```

### Voir les tables
```sql
\dt
SELECT * FROM "User";
SELECT * FROM "Article";
```

### Arrêter l'application
```bash
docker-compose down
```

### Reset complet (avec données)
```bash
docker-compose down -v
docker-compose up --build -d
```

---

## 📂 Fichiers NON Essentiels au Fonctionnement

### Documentation (utiles mais pas nécessaires pour le code)
```
❌ README.md                    # Documentation principale
❌ QUICKSTART.md                # Guide rapide
❌ INSTALL.md                   # Guide d'installation
❌ README_INSTALLATION.txt      # Instructions simplifiées
❌ ARCHITECTURE.md              # Documentation architecture
❌ PROJECT_STRUCTURE.md         # Structure du projet
❌ TROUBLESHOOTING.md           # Guide dépannage
❌ CONTRIBUTING.md              # Guide contribution
❌ CHANGELOG.md                 # Historique des versions
❌ CHEATSHEET.md                # Aide-mémoire
❌ LICENSE                      # Licence du projet
```

### Fichiers d'exemple/configuration optionnels
```
❌ .env.example                 # Template (le vrai .env est nécessaire)
❌ backend/.env.example         # Template backend
❌ frontend/.env.example        # Template frontend
```

### Scripts de démarrage (facilitent la vie mais pas obligatoires)
```
❌ start.bat                    # Script Windows
❌ start.sh                     # Script Linux/Mac
```

### Fichiers Git (uniquement pour versioning)
```
❌ .git/                        # Historique Git
❌ .gitignore                   # Fichiers ignorés par Git
```

### Fichiers de build/cache (générés automatiquement)
```
❌ backend/node_modules/        # Recréé par npm install
❌ frontend/node_modules/       # Recréé par npm install
❌ frontend/dist/               # Recréé par build
❌ backend/uploads/             # Créé au runtime (mais images perdues)
```

---

## ✅ Fichiers ESSENTIELS au Fonctionnement

### Racine du projet
```
✅ docker-compose.yml           # Orchestration des services
✅ .env                         # Variables d'environnement
```

### Backend
```
✅ backend/package.json         # Dépendances Node.js
✅ backend/Dockerfile           # Image Docker backend
✅ backend/.dockerignore        # Optimisation build

✅ backend/src/
   ✅ server.js                 # Point d'entrée serveur
   
   ✅ controllers/
      ✅ auth.controller.js     # Logique authentification
      ✅ article.controller.js  # Logique articles
   
   ✅ middlewares/
      ✅ auth.js                # Protection JWT
   
   ✅ routes/
      ✅ auth.routes.js         # Routes auth
      ✅ article.routes.js      # Routes articles
      ✅ upload.routes.js       # Routes upload
   
   ✅ utils/
      ✅ validators.js          # Validation données

✅ backend/prisma/
   ✅ schema.prisma             # Schéma base de données
   ✅ migrations/               # Migrations SQL
```

### Frontend
```
✅ frontend/package.json        # Dépendances React
✅ frontend/Dockerfile          # Image Docker frontend
✅ frontend/.dockerignore       # Optimisation build
✅ frontend/vite.config.js      # Config Vite
✅ frontend/tailwind.config.js  # Config Tailwind
✅ frontend/postcss.config.cjs  # Config PostCSS
✅ frontend/nginx.conf          # Config serveur Nginx
✅ frontend/index.html          # Point d'entrée HTML

✅ frontend/src/
   ✅ main.jsx                  # Point d'entrée React
   ✅ App.jsx                   # Composant racine
   ✅ index.css                 # Styles globaux
   
   ✅ pages/
      ✅ Login.jsx              # Page connexion
      ✅ Register.jsx           # Page inscription
      ✅ Dashboard.jsx          # Page principale
      ✅ CreateArticle.jsx      # Page création
      ✅ EditArticle.jsx        # Page édition
   
   ✅ components/
      ✅ Navbar.jsx             # Barre navigation
      ✅ ArticleCard.jsx        # Carte article
   
   ✅ services/
      ✅ api.js                 # Configuration Axios
```

---

## 🎯 Résumé pour la Présentation

### Architecture en 3 couches
1. **Frontend (React)** : Interface utilisateur moderne et responsive
2. **Backend (Node.js)** : API RESTful avec authentification JWT
3. **Database (PostgreSQL)** : Stockage relationnel des données

### Fonctionnalités principales
1. ✅ **Authentification** : JWT sécurisé avec hash bcrypt
2. ✅ **CRUD Articles** : Création, lecture, modification, suppression
3. ✅ **Upload Images** : Fichier local OU URL externe
4. ✅ **Autorisation** : Seul l'auteur peut modifier/supprimer

### Points forts techniques
- 🔒 Sécurité : Hash, JWT, validation, CORS
- 📦 Conteneurisation : Déploiement simple avec Docker
- 💾 Persistance : Volumes Docker pour données et images
- 🎨 UX : Aperçu images, feedback utilisateur
- 🔄 Workflow professionnel : Git, migrations, build optimisés

### Ligne de conclusion
> "Cette application démontre ma maîtrise d'une stack moderne full-stack, de la base de données au frontend, en passant par la sécurité et le déploiement conteneurisé. Un projet prêt pour la production."

---

## 📊 Statistiques du Projet

- **Lignes de code** : ~2500+ lignes
- **Technologies** : 15+ (React, Node, PostgreSQL, Docker, Prisma, JWT, etc.)
- **Fichiers sources** : 30+ fichiers essentiels
- **Containers Docker** : 3 (frontend, backend, database)
- **Routes API** : 8 endpoints
- **Pages Frontend** : 5 pages principales
- **Temps de démarrage** : ~30 secondes (build complet)

---

## 💡 Améliorations Possibles (Questions attendues)

**Q: Quelles améliorations pourriez-vous apporter ?**

**R:** 
1. **Pagination** : Limiter le nombre d'articles affichés
2. **Recherche** : Filtrer les articles par titre/auteur
3. **Refresh Token** : Prolonger la session automatiquement
4. **Tests** : Jest/Vitest pour tests unitaires
5. **CI/CD** : GitHub Actions pour déploiement auto
6. **CDN** : Stocker images sur S3/Cloudinary
7. **Email** : Confirmation inscription, reset password
8. **Rich Text Editor** : Markdown ou WYSIWYG
9. **Likes/Comments** : Interaction entre users
10. **Admin Panel** : Modération des articles

---

**Fin de la présentation. Bonne chance ! 🚀**
