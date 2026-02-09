# 🚀 Guide de Démarrage Rapide

## Méthode 1 : Utiliser les scripts de démarrage (Recommandé)

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

## Méthode 2 : Commandes manuelles

### 1. Cloner et configurer
```bash
# Cloner le projet
git clone <votre-repo>
cd mon-projet

# Copier et modifier les variables d'environnement
cp .env.example .env
# Éditez le fichier .env et changez les secrets
```

### 2. Démarrer avec Docker
```bash
# Démarrer tous les services
docker-compose up --build

# Ou en arrière-plan
docker-compose up --build -d
```

### 3. Accéder à l'application
- **Frontend** : http://localhost:3012
- **Backend API** : http://localhost:5012/api
- **Health Check** : http://localhost:5012/health

## 🎯 Premiers pas

1. Ouvrez http://localhost:3012
2. Cliquez sur "S'inscrire"
3. Créez un compte avec :
   - Nom : Votre nom
   - Email : votre@email.com
   - Mot de passe : minimum 6 caractères
4. Vous serez automatiquement connecté
5. Créez votre premier article !

## 🐛 Dépannage

### Les conteneurs ne démarrent pas
```bash
# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs

# Logs d'un service spécifique
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Erreur "port already in use"
```bash
# Sur Windows
netstat -ano | findstr :3012
netstat -ano | findstr :5012

# Sur Linux/Mac
lsof -i :3012
lsof -i :5012

# Arrêter et nettoyer
docker-compose down
```

### La base de données ne s'initialise pas
```bash
# Supprimer les volumes et redémarrer
docker-compose down -v
docker-compose up --build
```

### Erreur de connexion API
Vérifiez que `VITE_API_URL` dans le fichier `.env` à la racine pointe vers http://localhost:5012/api

## 📝 Tester l'API avec curl

```bash
# Health check
curl http://localhost:5012/health

# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Récupérer tous les articles
curl http://localhost:5000/api/articles

# Créer un article (remplacez <TOKEN> par votre token JWT)
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Mon article","content":"Contenu de mon article..."}'
```

## 🔧 Développement

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Node.js + Express)
```bash
cd backend
npm install
npm run dev
```

### Base de données (Prisma)
```bash
cd backend

# Générer le client Prisma
npx prisma generate

# Créer une migration
npx prisma migrate dev

# Ouvrir Prisma Studio
npx prisma studio
```

## 📚 En savoir plus

Consultez le [README.md](README.md) complet pour plus de détails sur :
- L'architecture du projet
- La documentation API complète
- Les bonnes pratiques de sécurité
- Le déploiement en production
