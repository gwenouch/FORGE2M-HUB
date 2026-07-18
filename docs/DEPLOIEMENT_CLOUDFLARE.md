# Deploiement Cloudflare

1. Creer un depot GitHub prive `FORGE2M-HUB`.
2. Pousser ce dossier sur `main`.
3. Dans Cloudflare, creer un projet Pages depuis GitHub.
4. Selectionner `FORGE2M-HUB`.
5. Mettre:
   - Framework preset: `None`
   - Build command: vide
   - Build output directory: `/`
6. Ajouter le domaine custom `forge2m.com`.
7. Garder RedKerf sur `redkerf.forge2m.com`.

## Variables recommandees

Dans Cloudflare Pages > Settings > Environment variables:

- `HUB_SESSION_SECRET`: longue phrase secrete aleatoire.
- `HUB_ADMIN_LOGIN`: login du compte principal.
- `HUB_ADMIN_CODE`: code du compte principal.
- `REDKERF_URL`: `https://redkerf.forge2m.com`.
- `PHOTO_CONTOUR_URL`: `https://redkerf.forge2m.com/photo-contour.html`.
- `PILOTAGE_CNC_URL`: `https://redkerf.forge2m.com/pilotage-cnc/`.

## Suite prevue

- Brancher Cloudflare D1 avec `database/schema.sql`.
- Remplacer les comptes de demonstration par les comptes D1.
- Ajouter Stripe Checkout et le portail client.
- Faire verifier RedKerf directement par le Hub.
