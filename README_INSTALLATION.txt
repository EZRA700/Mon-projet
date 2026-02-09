========================================
  INSTALLATION - BLOG APPLICATION
========================================

PREREQUIS :
- Docker Desktop installé et démarré

INSTALLATION EN 1 COMMANDE :
----------------------------

Windows :
  Double-cliquez sur start.bat
  
  OU dans le terminal :
  docker-compose up --build -d

Linux/Mac :
  ./start.sh
  
  OU dans le terminal :
  docker-compose up --build -d

PREMIERE INSTALLATION (RECOMMANDE) :
------------------------------------
  docker-compose down -v
  docker-compose up --build -d

ACCES A L'APPLICATION :
-----------------------
  Frontend : http://localhost:3012
  API : http://localhost:5012/api

COMMANDES UTILES :
------------------
  Voir les logs :
    docker-compose logs -f

  Arrêter l'application :
    docker-compose down

  Redémarrer proprement :
    docker-compose down -v
    docker-compose up --build -d

PROBLEMES ?
-----------
  1. Vérifier que Docker Desktop est démarré
  2. Vérifier qu'aucun autre programme n'utilise les ports 3012, 5012 ou 5432
  3. Essayer : docker-compose down -v puis docker-compose up --build -d
  4. Voir les logs : docker-compose logs backend

========================================
