# Troubleshooting Guide - Guide de Dépannage

Ce guide vous aide à résoudre les problèmes courants rencontrés avec l'application.

## Table des matières

- [Problèmes de Démarrage](#problèmes-de-démarrage)
- [Problèmes de Connexion](#problèmes-de-connexion)
- [Problèmes de Base de Données](#problèmes-de-base-de-données)
- [Problèmes Frontend](#problèmes-frontend)
- [Problèmes Backend](#problèmes-backend)
- [Problèmes Docker](#problèmes-docker)

## Problèmes de Démarrage

### ❌ "Docker n'est pas installé"

**Solution :**
1. Installez Docker Desktop : https://www.docker.com/products/docker-desktop
2. Vérifiez l'installation : `docker --version`

### ❌ "Port already in use" (Port déjà utilisé)

**Symptôme :**
```
Error: bind: address already in use
```

**Solution :**

**Windows :**
```powershell
# Trouver le processus utilisant le port 3000
netstat -ano | findstr :3000

# Tuer le processus (remplacez PID par le numéro)
taskkill /PID <PID> /F

# Idem pour le port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Linux/Mac :**
```bash
# Trouver et tuer le processus
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

**Ou changez les ports dans [docker-compose.yml](docker-compose.yml) :**
```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Au lieu de 3000:80
  backend:
    ports:
      - "8000:5000"  # Au lieu de 5000:5000
```

### ❌ Les conteneurs ne démarrent pas

**Solution :**
```bash
# Arrêter et nettoyer complètement
docker-compose down -v
docker system prune -a

# Rebuild complet
docker-compose up --build
```

## Problèmes de Connexion

### ❌ "Token invalide" ou "Token expiré"

**Solution :**
1. Déconnectez-vous
2. Effacez le localStorage du navigateur :
   ```javascript
   // Console du navigateur (F12)
   localStorage.clear()
   ```
3. Reconnectez-vous

### ❌ "Email ou mot de passe incorrect" alors que c'est correct

**Vérifications :**
1. Vérifiez les espaces avant/après l'email
2. Vérifiez la casse du mot de passe
3. Assurez-vous d'avoir bien créé le compte d'abord

**Solution :**
```bash
# Réinitialiser la base de données
docker-compose down -v
docker-compose up --build
```

### ❌ Impossible de s'inscrire - "Email déjà utilisé"

**Solution :**
1. Utilisez un autre email
2. Ou réinitialisez la base de données (voir ci-dessus)

## Problèmes de Base de Données

### ❌ "Can't reach database server"

**Solution :**
```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps

# Voir les logs PostgreSQL
docker-compose logs postgres

# Redémarrer PostgreSQL
docker-compose restart postgres

# Si le problème persiste
docker-compose down -v
docker-compose up --build
```

### ❌ Erreur de migration Prisma

**Symptôme :**
```
P3005: The database schema is not in sync
```

**Solution :**
```bash
# Accéder au conteneur backend
docker-compose exec backend sh

# Régénérer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Sortir du conteneur
exit

# Redémarrer le backend
docker-compose restart backend
```

### ❌ Les données disparaissent au redémarrage

**Cause :** Le volume Docker n'est pas configuré correctement.

**Vérification :**
```bash
# Vérifier les volumes
docker volume ls

# Devrait afficher : mon-projet_postgres_data
```

**Solution :**
Assurez-vous que [docker-compose.yml](docker-compose.yml) contient :
```yaml
volumes:
  postgres_data:
    driver: local
```

## Problèmes Frontend

### ❌ Page blanche après build

**Solution :**
```bash
# Vérifier les logs du frontend
docker-compose logs frontend

# Reconstruire le frontend
docker-compose up --build frontend
```

### ❌ "Failed to fetch" ou erreurs CORS

**Symptôme :**
```
Access to fetch has been blocked by CORS policy
```

**Solution :**
1. Vérifiez que `VITE_API_URL` dans [frontend/.env](frontend/.env) est correct :
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. Vérifiez que le backend autorise CORS dans [backend/src/server.js](backend/src/server.js) :
   ```javascript
   app.use(cors());
   ```

3. Redémarrez les services :
   ```bash
   docker-compose restart
   ```

### ❌ Les styles Tailwind ne s'appliquent pas

**Solution :**
```bash
# Reconstruire le frontend avec --no-cache
docker-compose build --no-cache frontend
docker-compose up frontend
```

### ❌ React Router - 404 sur refresh

**Symptôme :** La page fonctionne en navigation mais donne 404 au refresh.

**Vérification :** Assurez-vous que [frontend/nginx.conf](frontend/nginx.conf) contient :
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Problèmes Backend

### ❌ "Cannot find module"

**Solution :**
```bash
# Reconstruire avec --no-cache
docker-compose build --no-cache backend
docker-compose up backend
```

### ❌ JWT_SECRET non défini

**Symptôme :**
```
Error: secretOrPrivateKey must have a value
```

**Solution :**
Vérifiez que [backend/.env](backend/.env) contient :
```
JWT_SECRET=votre_secret_super_securise_changez_moi
```

### ❌ Erreur 500 sur toutes les requêtes

**Diagnostic :**
```bash
# Voir les logs détaillés
docker-compose logs -f backend
```

**Solutions courantes :**
1. Problème de connexion DB → Voir section Base de Données
2. Erreur dans le code → Vérifier les logs
3. Variable d'environnement manquante → Vérifier [.env](.env)

## Problèmes Docker

### ❌ "No space left on device"

**Solution :**
```bash
# Nettoyer Docker
docker system prune -a --volumes

# Libérer de l'espace
docker volume prune
docker image prune -a
```

### ❌ Build très lent

**Solutions :**
1. Utilisez le cache Docker :
   ```bash
   docker-compose up --build
   # Au lieu de --no-cache
   ```

2. Vérifiez [.dockerignore](backend/.dockerignore) :
   ```
   node_modules/
   .git/
   ```

3. Sur Windows, utilisez WSL 2 pour de meilleures performances

### ❌ "Cannot connect to Docker daemon"

**Windows :**
1. Démarrez Docker Desktop
2. Vérifiez dans la barre des tâches

**Linux :**
```bash
# Démarrer Docker
sudo systemctl start docker

# Ajouter votre user au groupe docker
sudo usermod -aG docker $USER
# Puis reconnectez-vous
```

### ❌ Images Docker trop volumineuses

**Solution :**
Les multi-stage builds sont déjà configurés. Pour optimiser davantage :

```bash
# Vérifier la taille des images
docker images

# Nettoyer les layers inutilisés
docker image prune -a
```

## Commandes de Debug Utiles

### Logs en temps réel
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### État des conteneurs
```bash
# Voir les conteneurs en cours
docker-compose ps

# Détails d'un conteneur
docker inspect <container_name>
```

### Accéder à un conteneur
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# PostgreSQL
docker-compose exec postgres psql -U user -d mydb
```

### Tester la connectivité

```bash
# Health check manuel
curl http://localhost:5000/health

# Tester une route protégée (remplacez TOKEN)
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/articles
```

## Problèmes Spécifiques Windows

### ❌ Ligne endings (CRLF vs LF)

Si vous voyez `/bin/sh^M: bad interpreter` :

```bash
# Convertir en LF
git config --global core.autocrlf false
git rm --cached -r .
git reset --hard
```

### ❌ Chemins Windows vs Linux

Dans les scripts, utilisez toujours `/` :
```bash
# ✅ Bon
WORKDIR /app

# ❌ Mauvais
WORKDIR C:\app
```

## Aide Supplémentaire

Si le problème persiste :

1. **Vérifiez les Issues** : https://github.com/votre-repo/issues
2. **Ouvrez une nouvelle Issue** avec :
   - Description du problème
   - Logs complets (`docker-compose logs`)
   - Votre environnement (OS, version Docker)
   - Étapes pour reproduire

3. **Réinitialisation complète** (dernier recours) :
   ```bash
   # Attention : supprime TOUTES les données
   docker-compose down -v
   docker system prune -a --volumes
   docker-compose up --build
   ```

---

**Conseil :** Gardez vos logs (`docker-compose logs`) lors du débogage !
