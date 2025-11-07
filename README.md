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

## Déploiement LWS (.htaccess, sans apache.conf)

Si vous n’avez pas accès à `apache.conf` chez LWS, vous pouvez déployer via `.htaccess` et l’arborescence des dossiers.

### Option A — Sous-domaines séparés (recommandé)
- Créez deux sous-domaines dans le manager LWS:
  - `api.votre-domaine.fr` vers `soussou-api/public`
  - `app.votre-domaine.fr` vers `soussou-game/dist`
- Côté Laravel, le `.htaccess` par défaut dans `soussou-api/public` gère la réécriture vers `public/index.php`.
- Côté SPA (React), ajoutez un `.htaccess` dans `soussou-game/dist` pour le fallback en mode history:
  ```htaccess
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
  ```
- Variables `.env` Laravel typiques:
  ```env
  APP_ENV=production
  APP_URL=https://api.votre-domaine.fr
  SESSION_DRIVER=file
  SESSION_DOMAIN=.votre-domaine.fr
  SESSION_SECURE_COOKIE=true
  SESSION_SAME_SITE=lax
  SANCTUM_STATEFUL_DOMAINS=app.votre-domaine.fr,api.votre-domaine.fr,www.votre-domaine.fr
  ```

### Option B — Un seul domaine avec l’API sous `/api`
- Placez le build SPA dans la racine web `public_html/`.
- Créez le pont vers Laravel sans vhost dédié:
  - `public_html/api/index.php`:
    ```php
    <?php require __DIR__ . '/../soussou-api/public/index.php'; ?>
    ```
  - `public_html/api/.htaccess`:
    ```htaccess
    RewriteEngine On
    RewriteBase /api
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
    ```
  - `.htaccess` dans `public_html/` (SPA fallback, hors `/api`):
    ```htaccess
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]
    RewriteRule ^ index.html [L]
    ```
- Variables `.env` Laravel typiques:
  ```env
  APP_ENV=production
  APP_URL=https://www.votre-domaine.fr
  SESSION_DRIVER=file
  SESSION_DOMAIN=.votre-domaine.fr
  SESSION_SECURE_COOKIE=true
  SESSION_SAME_SITE=lax
  SANCTUM_STATEFUL_DOMAINS=www.votre-domaine.fr,votre-domaine.fr
  ```

### Notes LWS et sécurité
- Activez le SSL et utilisez `https` partout; gardez `SESSION_SECURE_COOKIE=true`.
- Donnez droits d’écriture à `storage/` et `bootstrap/cache` pour `SESSION_DRIVER=file`.
- Si des redirections `http` apparaissent derrière proxy, forcez `https` en prod:
  ```php
  // App\Providers\AppServiceProvider::boot()
  if (app()->environment('production')) {
      \Illuminate\Support\Facades\URL::forceScheme('https');
  }
  ```
- Frontend: utilisez `withCredentials`/`credentials: 'include'` pour les cookies Sanctum.

### Exemple concret — dev.2adt-consulting.com (arborescence LWS `htdocs`)

Arborescence LWS fournie: `htdocs/dev.2adt-consulting.com/` est la racine web du sous‑domaine.

1) Déployer le SPA (frontend)
- Copiez le contenu de `soussou-game/dist` dans `htdocs/dev.2adt-consulting.com/`.
- Ajoutez le fallback React en mode history:
  ```htaccess
  # htdocs/dev.2adt-consulting.com/.htaccess
  RewriteEngine On
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
  ```

2) Exposer l’API Laravel sous `/api` (sans vhost)
- Uploadez le backend dans `htdocs/dev.2adt-consulting.com/soussou-api/` (avec `vendor/` installé ou via Composer chez LWS).
- Créez le pont vers `public/index.php`:
  ```php
  // htdocs/dev.2adt-consulting.com/api/index.php
  <?php require __DIR__ . '/../soussou-api/public/index.php'; ?>
  ```
- Réécriture pour les routes API:
  ```htaccess
  # htdocs/dev.2adt-consulting.com/api/.htaccess
  RewriteEngine On
  RewriteBase /api
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^ index.php [L]
  ```

3) Configuration frontend — base URL de l’API
- Utilisez `https://dev.2adt-consulting.com/api`.
- Pensez à `credentials: 'include'` (fetch) ou `axios.defaults.withCredentials = true`.

4) Configuration `.env` Laravel pour ce domaine
```env
APP_ENV=production
APP_URL=https://dev.2adt-consulting.com
SESSION_DRIVER=file
SESSION_DOMAIN=.2adt-consulting.com
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
SANCTUM_STATEFUL_DOMAINS=dev.2adt-consulting.com,www.2adt-consulting.com
```
- CORS (`config/cors.php`):
  - `allowed_origins=['https://dev.2adt-consulting.com']`
  - `supports_credentials=true`
  - `paths` inclure `api/*` et `sanctum/csrf-cookie`

5) Vérifications
- Ouvrez `https://dev.2adt-consulting.com` et testez la connexion (cookies Sanctum présents: `XSRF-TOKEN`, `laravel_session`).
- Testez `https://dev.2adt-consulting.com/api/me` et `.../api/progress` authentifié.