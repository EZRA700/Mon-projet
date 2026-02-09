# 📦 Installation et Démarrage

## Prérequis

- Docker Desktop installé et démarré
- Git (pour cloner le projet)

## Installation en 3 étapes

### 1️⃣ Cloner le projet
```bash
git clone <url-du-repo>
cd "Mon projet"
```

### 2️⃣ Vérifier que le fichier `.env` existe
Le fichier `.env` doit être présent à la racine du projet. Si ce n'est pas le cas :
```bash
# Copier le fichier d'exemple
cp .env.example .env
```

Le fichier `.env` par défaut fonctionne pour un environnement de développement local.

### 3️⃣ Démarrer l'application

**Option A : Utiliser le script (Recommandé)**
```bash
# Sur Windows
start.bat

# Sur Linux/Mac
chmod +x start.sh
./start.sh
```

**Option B : Commande manuelle**
```bash
docker-compose up --build -d
```

**Option C : Premier démarrage propre (Recommandé)**
```bash
# Nettoyer tout et redémarrer
docker-compose down -v
docker-compose up --build -d
```

## 🎉 C'est tout !

L'application sera accessible sur :
- **Frontend** : http://localhost:3012
- **Backend API** : http://localhost:5012/api

## 📝 Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend

# Arrêter l'application
docker-compose down

# Arrêter et supprimer les données
docker-compose down -v

# Redémarrer un service
docker-compose restart backend
```

## ⚠️ Problèmes courants

### Le backend redémarre en boucle
```bash
# Vérifier les logs
docker-compose logs backend

# Solution : Nettoyer et redémarrer
docker-compose down -v
docker-compose up --build -d
```

### Erreur "port already in use"
Un autre processus utilise les ports 3012 ou 5012.
```bash
# Windows : Trouver le processus
netstat -ano | findstr :3012
netstat -ano | findstr :5012

# Arrêter les containers
docker-compose down
```

### Le frontend ne peut pas contacter l'API
Vérifiez que le fichier `.env` contient :
```
VITE_API_URL=http://localhost:5012/api
```

## 🔄 Mise à jour du code

Après avoir modifié le code :
```bash
# Reconstruire et redémarrer
docker-compose up --build -d

# Ou reconstruire un seul service
docker-compose up --build -d backend
```

## 🧹 Nettoyage complet

Pour tout supprimer (containers, images, volumes) :
```bash
docker-compose down -v
docker system prune -a
```
