# 🎤 AIDE-MÉMOIRE PRÉSENTATION ORALE

## 📋 PLAN DE PRÉSENTATION (15-20 minutes)

### 1️⃣ INTRODUCTION (2 min)
**À dire :**
> "Bonjour, je vais vous présenter mon projet de Blog Application Full-Stack. C'est une application web complète qui permet de créer et partager des articles avec images, développée avec les technologies modernes du web."

**Montrer :**
- Ouvrir http://localhost:3012
- Faire une démo rapide : Inscription → Créer article → Affichage

**Points clés :**
- Stack : React + Node.js + PostgreSQL + Docker
- Fonctionnalités : Auth JWT, CRUD, Upload images
- Déploiement : Conteneurisé et prêt pour production

---

### 2️⃣ ARCHITECTURE (3 min)

**À dire :**
> "L'application suit une architecture en 3 couches séparées par des containers Docker."

**Montrer le schéma :**
```
Frontend (Port 3012) ─→ Backend (Port 5012) ─→ PostgreSQL (Port 5432)
```

**Ouvrir le code :**
1. `docker-compose.yml` (lignes 1-80)
   - Montrer les 3 services
   - Expliquer les volumes (persist data)
   - Montrer healthcheck

**Points à souligner :**
- Chaque service est isolé
- Communication par réseau Docker
- Volumes = données persistent après redémarrage

---

### 3️⃣ BACKEND - AUTHENTIFICATION (4 min)

**À dire :**
> "La sécurité est primordiale. J'ai implémenté une authentification JWT avec hashage bcrypt."

**Ouvrir `backend/src/controllers/auth.controller.js`**

**Montrer et expliquer :**

**Ligne 9-16 : Vérification email**
```javascript
const existingUser = await prisma.user.findUnique({
  where: { email }
});
```
> "Empêche les doublons - un email = un compte unique"

**Ligne 18-20 : Hash du mot de passe**
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```
> "Le mot de passe est hashé avec 10 rounds de bcrypt. Impossible à reverser."

**Ligne 34-37 : Génération JWT**
```javascript
const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```
> "Token valide 24h. Pas besoin de cookies ou sessions serveur."

**Démonstration :**
1. Ouvrir DevTools (F12) → Network
2. S'inscrire avec un nouveau compte
3. Montrer la requête POST /api/auth/register
4. Montrer la réponse avec le token

---

### 4️⃣ BACKEND - PROTECTION DES ROUTES (2 min)

**À dire :**
> "Le middleware JWT protège les routes sensibles."

**Ouvrir `backend/src/middlewares/auth.js`**

**Montrer ligne 4-17 :**
```javascript
const authenticateToken = (req, res, next) => {
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  next();
};
```

**Ouvrir `backend/src/routes/article.routes.js` ligne 6**
```javascript
router.post('/', authenticateToken, createArticle);
```
> "Sans token valide → accès refusé. Avec token → req.user contient les infos."

---

### 5️⃣ BACKEND - UPLOAD D'IMAGES (3 min)

**À dire :**
> "J'ai implémenté deux façons d'ajouter des images : upload local ou URL externe."

**Ouvrir `backend/src/routes/upload.routes.js`**

**Montrer ligne 14-21 : Configuration stockage**
```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});
```
> "Nom unique pour éviter conflits. Format : image-1707524859-987654321.jpg"

**Montrer ligne 24-32 : Validation**
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type non autorisé'), false);
  }
};
```
> "Sécurité : uniquement images. Limite 5MB."

**Démonstration live :**
1. Créer un article avec image locale
2. Montrer l'upload dans Network tab
3. Montrer le fichier créé : `docker exec blog_backend ls uploads/`

---

### 6️⃣ FRONTEND - GESTION DE L'UPLOAD (3 min)

**À dire :**
> "Côté frontend, je donne le choix : fichier local OU URL. Avec aperçu instantané."

**Ouvrir `frontend/src/pages/CreateArticle.jsx`**

**Montrer ligne 23-33 : Aperçu image**
```javascript
const handleImageFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Aperçu immédiat
    };
    reader.readAsDataURL(file);
  }
};
```
> "FileReader lit le fichier en base64 → aperçu sans attendre l'upload."

**Montrer ligne 35-45 : Upload puis création**
```javascript
const handleSubmit = async (e) => {
  let finalImageUrl = formData.imageUrl;
  
  if (imageFile) {
    finalImageUrl = await uploadImage(); // Upload d'abord
  }
  
  await articlesAPI.create({ 
    ...formData, 
    imageUrl: finalImageUrl 
  });
};
```
> "Workflow : Upload → URL → Création article avec l'URL."

**Démonstration :**
- Montrer l'interface avec les 2 options
- Upload une image → voir aperçu
- Créer l'article

---

### 7️⃣ BASE DE DONNÉES - SCHÉMA PRISMA (2 min)

**À dire :**
> "Prisma ORM simplifie les requêtes et gère les migrations."

**Ouvrir `backend/prisma/schema.prisma`**

**Montrer ligne 13-20 : Modèle User**
```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  articles  Article[] // Relation
  createdAt DateTime  @default(now())
}
```

**Montrer ligne 22-30 : Modèle Article**
```prisma
model Article {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  imageUrl  String?  // Optionnel
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```
> "Relation One-to-Many. Si User supprimé → ses articles aussi (Cascade)."

**Montrer les migrations :**
```bash
ls backend/prisma/migrations/
```
> "Chaque changement de schéma = nouvelle migration. Historique complet."

---

### 8️⃣ DOCKER & DÉPLOIEMENT (2 min)

**À dire :**
> "Docker simplifie le déploiement. Une seule commande lance tout."

**Montrer dans le terminal :**
```bash
docker-compose ps
```
> "3 containers : frontend, backend, database. Tous UP."

**Ouvrir `backend/Dockerfile` ligne 1-17**
```dockerfile
# Stage 1: Build avec toutes les dépendances
FROM node:20-alpine AS builder
RUN npm install

# Stage 2: Production léger
FROM node:20-alpine AS runner
COPY --from=builder /app/node_modules ./node_modules
```
> "Multi-stage build → image finale légère. Seulement ce qui est nécessaire."

**Montrer docker-compose.yml ligne 68-71 : Volumes**
```yaml
volumes:
  postgres_data:    # Données DB
  uploads_data:     # Images uploadées
```
> "Volumes Docker = persistance. Redémarrage = données conservées."

---

### 9️⃣ DÉMONSTRATION COMPLÈTE (3 min)

**Workflow complet en live :**

1. **Inscription**
   - Créer compte : `demo@test.com` / `password123`
   - Montrer le token dans DevTools

2. **Créer un article avec image**
   - Titre : "Mon Premier Article"
   - Upload une image locale
   - Voir l'aperçu
   - Publier

3. **Voir le Dashboard**
   - Article affiché avec image
   - Montrer les infos auteur + date

4. **Modifier l'article**
   - Changer l'image (URL cette fois)
   - Enregistrer

5. **Tester la sécurité**
   - Se déconnecter
   - Voir les articles (lecture OK)
   - Essayer de modifier → boutons disparus
   - Se reconnecter → boutons réapparaissent

---

### 🔟 CONCLUSION & QUESTIONS (2 min)

**À dire :**
> "En résumé, j'ai développé une application production-ready avec :
> - ✅ Architecture moderne et scalable
> - ✅ Sécurité : JWT, hash, validation
> - ✅ Fonctionnalités complètes : Auth, CRUD, Upload
> - ✅ Déploiement simplifié avec Docker
> - ✅ Base de données relationnelle avec migrations
> 
> Ce projet démontre ma capacité à concevoir et développer une application complète de A à Z."

**Anticiper les questions :**

**Q: Pourquoi JWT plutôt que sessions ?**
> "Stateless = pas de stockage serveur. Scalable horizontalement. Token contient tout."

**Q: Et la sécurité des tokens ?**
> "HTTPS obligatoire en prod. Token expire 24h. Refresh token possible."

**Q: Pourquoi Docker ?**
> "Dev = Prod (même environnement). Déploiement simple. Isolation des services."

**Q: Et les tests ?**
> "Amélioration possible : Jest pour backend, Vitest pour frontend. TDD à intégrer."

**Q: Combien de temps pour développer ?**
> "Architecture pensée, puis développement itératif. Environ X jours/semaines."

**Q: Prêt pour production ?**
> "Base solide. À ajouter : HTTPS, CDN pour images, monitoring, CI/CD, backups."

---

## 🎯 CHECKLIST AVANT PRÉSENTATION

### Préparation technique
- [ ] `docker-compose up -d` lancé
- [ ] Application accessible sur http://localhost:3012
- [ ] VS Code ouvert avec les fichiers marqués
- [ ] DevTools (F12) ouvert sur onglet Network
- [ ] Terminal prêt pour commandes Docker

### Fichiers à avoir ouverts dans VS Code
- [ ] `docker-compose.yml`
- [ ] `backend/src/controllers/auth.controller.js`
- [ ] `backend/src/middlewares/auth.js`
- [ ] `backend/src/routes/upload.routes.js`
- [ ] `frontend/src/pages/CreateArticle.jsx`
- [ ] `backend/prisma/schema.prisma`

### Démo à préparer
- [ ] Testez une inscription avant
- [ ] Préparez 1-2 images à uploader
- [ ] Notez des URLs d'images de test
- [ ] Créez un compte test déjà connecté (backup)

### Matériel
- [ ] Laptop chargé
- [ ] Souris (si présentation sur grand écran)
- [ ] Câble HDMI/adaptateur
- [ ] Notes imprimées (ce document)

---

## 💡 CONSEILS POUR LA PRÉSENTATION

### Pendant la démo
1. **Parlez en même temps que vous codez/naviguez**
   - Ne laissez pas de silences
   - Expliquez ce que vous faites

2. **Montrez le code ET le résultat**
   - Split screen : Code | Browser
   - Fait le lien entre les deux

3. **Gardez un rythme soutenu**
   - Ne vous perdez pas dans les détails
   - Allez à l'essentiel

4. **Gérez les erreurs avec calme**
   - Si bug : "C'est l'occasion de montrer le debugging"
   - Utilisez le compte de backup si blocage

5. **Regardez l'audience**
   - Pas seulement l'écran
   - Vérifiez qu'ils suivent

### Langage corporel
- ✅ Debout (si possible)
- ✅ Gestes pour souligner les points
- ✅ Sourire et enthousiasme
- ❌ Tourner le dos
- ❌ Regarder uniquement l'écran

### Si question difficile
> "Excellente question ! Je n'ai pas implémenté [fonctionnalité] mais voici comment je le ferais..." 
> Puis proposez une solution réfléchie.

---

## 📊 TEMPS PAR SECTION

| Section | Temps | Cumul |
|---------|-------|-------|
| Introduction | 2 min | 2 min |
| Architecture | 3 min | 5 min |
| Auth Backend | 4 min | 9 min |
| Protection routes | 2 min | 11 min |
| Upload Backend | 3 min | 14 min |
| Upload Frontend | 3 min | 17 min |
| Base de données | 2 min | 19 min |
| Docker | 2 min | 21 min |
| Démo complète | 3 min | 24 min |
| Conclusion | 2 min | 26 min |

**Total : ~25 minutes** (ajustable selon le temps disponible)

---

## 🚀 COMMANDES RAPIDES (en cas de problème)

### Redémarrer rapidement
```bash
docker-compose restart
```

### Voir les logs si erreur
```bash
docker-compose logs backend --tail 50
```

### Reset complet (DERNIER RECOURS)
```bash
docker-compose down -v
docker-compose up -d
# Attendre 30 sec
```

### Accès direct PostgreSQL (impressionnant à montrer)
```bash
docker exec -it blog_postgres psql -U bloguser -d blogdb
\dt
SELECT * FROM "User";
SELECT * FROM "Article";
\q
```

---

## 🎓 OUVERTURES POUR QUESTIONS

Si on vous demande des améliorations :

1. **Performance**
   - Cache Redis pour sessions
   - CDN pour images
   - Compression Gzip
   - Lazy loading

2. **Sécurité**
   - Rate limiting (anti-bruteforce)
   - CSRF protection
   - Content Security Policy
   - Helmet.js

3. **Fonctionnalités**
   - Pagination
   - Recherche full-text
   - Catégories/Tags
   - Likes/Comments
   - Notifications

4. **Qualité**
   - Tests unitaires (Jest)
   - Tests E2E (Playwright)
   - CI/CD (GitHub Actions)
   - Linting (ESLint)
   - Monitoring (Sentry)

5. **Scalabilité**
   - Load balancer
   - Réplication PostgreSQL
   - Sharding
   - Message queue (RabbitMQ)

---

**Bonne chance pour votre présentation ! 🎉**

*Vous avez tout ce qu'il faut. Respirez, souriez, et montrez votre travail avec fierté !*
