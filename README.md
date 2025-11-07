# Soussou Game & API — Déploiement sans Docker

Ce projet regroupe:
- `soussou-game`: Frontend React (Vite + Tailwind)
- `soussou-api`: Backend Laravel (API + Auth Sanctum)

L’objectif est de déployer sur un serveur avec MySQL et phpMyAdmin, sans Docker.

## Prérequis
- Node.js 18+ et npm
- PHP 8.2+ et Composer
- MySQL 8+ (ou MariaDB compatible) et phpMyAdmin
- Apache ou Nginx (avec PHP-FPM si Nginx)

## Configuration backend (Laravel)
1. Copier l’environnement:
   - Dans `soussou-api`, dupliquer `.env.example` en `.env`.
2. Paramétrer la base de données dans `.env`:
   ```env
   APP_ENV=production
   APP_KEY=
   APP_URL=http://api.example.com

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=soussou
   DB_USERNAME=soussou_user
   DB_PASSWORD=mot_de_passe_secure

   # Cookies et SPA
   SESSION_DRIVER=file
   SESSION_DOMAIN=.example.com           # Mettre le domaine racine si frontend et api sont sur des sous-domaines
   SANCTUM_STATEFUL_DOMAINS=app.example.com,api.example.com
   
   # Optionnel: si vous utilisez une IP
   # SESSION_DOMAIN=
   # SANCTUM_STATEFUL_DOMAINS=app.ip.serveur,ip.serveur
   ```
3. Installer et initialiser:
   - `cd soussou-api`
   - `composer install`
   - `php artisan key:generate`
   - Créer la base dans MySQL (via phpMyAdmin ou CLI), puis:
     - `php artisan migrate`
     - (Optionnel) `php artisan db:seed`
4. CORS et cookies:
   - Dans `soussou-api/config/cors.php`, ajouter votre domaine frontend à `allowed_origins`.
   - Laisser `supports_credentials` à `true`.
   - Vérifier `config/sanctum.php` et la variable `.env` `SANCTUM_STATEFUL_DOMAINS`.
5. Server web:
   - DocumentRoot doit pointer sur `soussou-api/public`.
   - Des exemples sont fournis dans `deploy/apache.conf` et `deploy/nginx.conf`.

## Configuration frontend (React)
1. Installer:
   - `cd soussou-game`
   - `npm install`
2. Mettre les bonnes URLs d’API:
   - `soussou-game/src/services/api.js`: changer `API_BASE_URL` vers `http://api.example.com/api`.
   - `soussou-game/src/contexts/AuthContext.jsx`: changer `baseURL` de `authApi` vers `http://api.example.com`.
3. Démarrer en dev: `npm run dev`.
4. Build de production:
   - `npm run build`
   - Déployer le contenu de `soussou-game/dist` derrière votre serveur web (Nginx/Apache).

## phpMyAdmin
- Installer phpMyAdmin et le configurer pour se connecter à votre MySQL.
- Créer la base `soussou` et l’utilisateur `soussou_user` avec les droits nécessaires (SELECT/INSERT/UPDATE/DELETE/CREATE/ALTER).

## Vérification
- Frontend: vérifier la connexion, le menu utilisateur (avatar), profil, tableau de bord.
- Backend: vérifier `/api/me`, `/api/progress`, `/api/stats`.

## Dépannage
- CORS: si le frontend ne peut pas appeler l’API, ajuster `allowed_origins` dans `config/cors.php`.
- Cookies Sanctum: vérifier `SESSION_DOMAIN` et `SANCTUM_STATEFUL_DOMAINS` pour correspondre aux domaines utilisés.
- URLs: mettre à jour toutes les URLs côté frontend pour pointer vers votre domaine/API.

## Scripts utiles
- Frontend:
  - `npm run dev` (dev)
  - `npm run build` (production)
  - `npm run preview` (prévisualisation du build)
- Backend:
  - `php artisan migrate`
  - `php artisan config:cache && php artisan route:cache`

---
Consultez `deploy/apache.conf` et `deploy/nginx.conf` pour des modèles de vhosts.