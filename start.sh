#!/bin/bash

echo "🚀 Démarrage de l'application Blog Full-Stack..."
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker Desktop."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose."
    exit 1
fi

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env à partir de .env.example..."
    cp .env.example .env
    echo "⚠️  N'oubliez pas de modifier les secrets dans le fichier .env !"
    echo ""
fi

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Construire et démarrer les conteneurs
echo "🔨 Construction et démarrage des conteneurs..."
docker-compose up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier le statut
echo ""
echo "✅ Application démarrée avec succès !"
echo ""
echo "📍 Accès à l'application :"
echo "   - Frontend : http://localhost:3000"
echo "   - Backend  : http://localhost:5000"
echo "   - PostgreSQL : localhost:5432"
echo ""
echo "📋 Commandes utiles :"
echo "   - Voir les logs : docker-compose logs -f"
echo "   - Arrêter : docker-compose down"
echo "   - Redémarrer : docker-compose restart"
echo ""
echo "💡 Astuce : Créez un compte sur http://localhost:3000/register pour commencer"
