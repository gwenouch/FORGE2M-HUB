# Forge2M Hub

Plateforme centrale pour les applications web Forge2M.

V1:

- accueil marketing
- connexion
- dashboard applicatif
- RedKerf comme premiere application
- verification serveur avant lancement
- structure prete pour D1 et Stripe

## Deploiement Cloudflare Pages

Projet conseille: `forge2m-hub`

Parametres Pages:

- Framework: None
- Build command: laisser vide
- Build output directory: `/`
- Production branch: `main`

Variables a ajouter plus tard dans Cloudflare:

- `HUB_SESSION_SECRET`
- `HUB_ADMIN_LOGIN`
- `HUB_ADMIN_CODE`
- `REDKERF_URL`

Sans variables, la V1 utilise les valeurs de demonstration presentes cote serveur.
