# Protection Cloudflare Access

Le hub contient deja son login applicatif Forge2M.

Pour ajouter aussi une protection Cloudflare comme RedKerf, il faut le faire dans
Cloudflare Zero Trust.

## Regle conseillee

Application:

- Nom: `Forge2M Hub prive`
- Type: `Self-hosted`
- Domaine: `forge2m.com`

Policy:

- Nom: `Forge2M autorise`
- Action: `Allow`
- Include: ton email ou ton domaine email autorise
- Session duration: `30 minutes` ou `24 hours`

Ensuite Cloudflare demandera un code de verification avant de laisser ouvrir le
hub. Le login Forge2M interne restera ensuite disponible pour gerer les droits
par application.
