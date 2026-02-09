@echo off
echo ========================================
echo  Blog App - Demarrage de l'application
echo ========================================
echo.

REM Verifier si Docker est installe
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Docker n'est pas installe. Veuillez installer Docker Desktop.
    pause
    exit /b 1
)

REM Verifier si le fichier .env existe
if not exist .env (
    echo [INFO] Creation du fichier .env a partir de .env.example...
    copy .env.example .env
    echo [ATTENTION] N'oubliez pas de modifier les secrets dans le fichier .env !
    echo.
)

REM Arreter les conteneurs existants
echo [INFO] Arret des conteneurs existants...
docker-compose down

REM Construire et demarrer les conteneurs
echo [INFO] Construction et demarrage des conteneurs...
docker-compose up --build -d

REM Attendre que les services soient prets
echo [INFO] Attente du demarrage des services...
timeout /t 10 /nobreak >nul

REM Afficher les informations
echo.
echo ========================================
echo  Application demarree avec succes !
echo ========================================
echo.
echo Acces a l'application :
echo   - Frontend  : http://localhost:3000
echo   - Backend   : http://localhost:5000
echo   - PostgreSQL: localhost:5432
echo.
echo Commandes utiles :
echo   - Voir les logs : docker-compose logs -f
echo   - Arreter      : docker-compose down
echo   - Redemarrer   : docker-compose restart
echo.
echo Astuce : Creez un compte sur http://localhost:3000/register pour commencer
echo.
pause
