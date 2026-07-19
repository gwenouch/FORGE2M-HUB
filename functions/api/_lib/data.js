export function getDemoUser(env = {}) {
  return {
    id: "usr_forge2m_admin",
    name: "Forge2M",
    email: "forgedeuxmontagnes@gmail.com",
    login: env.HUB_ADMIN_LOGIN || "forge2m-pro",
    code: env.HUB_ADMIN_CODE || "RkfPro9814",
    organizationId: "org_forge2m",
    organizationName: "Forge2M",
    role: "owner",
    planSlug: "redkerf-pro",
  };
}

export function getApps(env = {}) {
  return [
    {
      id: "app_redkerf",
      name: "RedKerf",
      slug: "redkerf",
      description: "Preparation DXF, imbrication, simulation et generation G-code plasma.",
      longDescription:
        "RedKerf centralise la preparation de coupe plasma : import DXF, optimisation, ordre de coupe, simulation et generation G-code.",
      iconText: "RK",
      image: "/assets/redkerf-logo-square.png?v=1",
      status: "active",
      isActive: true,
      url: env.REDKERF_URL || "https://redkerf.forge2m.com",
      tags: ["Plasma CAM", "DXF", "G-code"],
      benefits: [
        "Transformer un DXF en programme de coupe",
        "Optimiser les placements avant production",
        "Simuler le parcours avant lancement machine",
        "Centraliser les configurations de coupe et machine",
      ],
      createdAt: "2026-06-30",
    },
    {
      id: "app_photo_contour",
      name: "TraceKerf",
      slug: "photo-contour",
      description: "De la photo au trait de coupe : contour DXF pret pour la coupe.",
      longDescription:
        "TraceKerf detecte le contour d'une piece sur une photo (seuil automatique, cadrage de la zone de travail, fermeture des taches de bord, ajustement grossir/retrecir, retouche manuelle) et exporte un DXF ou SVG a l'echelle reelle, avec cotes affichees sur la vue et estimation de la boite englobante en mm, pouces et fractions de pouce.",
      iconText: "TK",
      image: "/assets/tracekerf-logo.png",
      status: "active",
      isActive: true,
      url: env.PHOTO_CONTOUR_URL || "https://redkerf.forge2m.com/photo-contour.html",
      tags: ["Photo", "DXF", "Contour"],
      benefits: [
        "Transformer une photo en contour DXF",
        "Mettre le contour a l'echelle reelle (mm ou pouce)",
        "Estimer la boite englobante en mm, pouces et fractions",
        "Exporter DXF et SVG en un clic",
      ],
      createdAt: "2026-07-16",
    },
    {
      id: "app_viewkerf",
      name: "ViewKerf",
      slug: "viewkerf",
      description: "Lecteur DXF : nettoyage, mesure, vue 3D et ajout de texte.",
      longDescription:
        "ViewKerf ouvre vos DXF pour les verifier avant la coupe : calques, selection, suppression des doublons et micro-contours, jonction et fermeture des contours ouverts, simplification, mesure entre deux points, ajout de texte vectoriel, vue 3D extrudee a l'epaisseur de tole, export DXF nettoye et envoi direct vers RedKerf.",
      iconText: "VK",
      image: "/assets/viewkerf-logo.png",
      status: "active",
      isActive: true,
      url: env.VIEWKERF_URL || "https://redkerf.forge2m.com/viewkerf/",
      tags: ["DXF", "Nettoyage", "3D"],
      benefits: [
        "Verifier et nettoyer un DXF avant la coupe",
        "Mesurer les pieces et coter les dimensions",
        "Visualiser la tole en 3D a l'epaisseur reelle",
        "Ajouter du texte et envoyer direct vers RedKerf",
      ],
      createdAt: "2026-07-18",
    },
    {
      id: "app_pilotage_cnc",
      name: "DriveKerf",
      slug: "pilotage-cnc",
      description: "Pilotage live CNC : jog, manette Xbox, G-code, Wi-Fi et USB.",
      longDescription:
        "DriveKerf pilote la CNC plasma en direct : connexion USB serie ou Wi-Fi, homing, jog au pave et au clavier, manette Xbox (X/Y/Z + torche M3/M5), streaming G-code et profils multi-controleurs (Grbl, FluidNC, grblHAL).",
      iconText: "DK",
      image: "/assets/drivekerf-logo.png?v=2",
      status: "active",
      isActive: true,
      url: env.PILOTAGE_CNC_URL || "https://redkerf.forge2m.com/pilotage-cnc/",
      tags: ["CNC", "Pilotage", "G-code"],
      benefits: [
        "Piloter la machine en live (fleches, clavier, manette)",
        "Connecter en USB serie ou Wi-Fi",
        "Homing, torche M3/M5 et streaming G-code",
        "Architecture multi-controleurs Grbl / FluidNC / grblHAL",
      ],
      createdAt: "2026-07-17",
    },
    {
      id: "app_parcours2m",
      name: "Parcours2M",
      slug: "parcours2m",
      description: "Creation d'itineraires, couts detailles, lieux, activites et guides de voyage.",
      longDescription:
        "Parcours2M preparera des parcours de voyage vendables avec itineraires, budget, lieux, activites et contenus utiles pour partir mieux organise.",
      iconText: "P2M",
      image: "/assets/parcours2m-logo.jpg",
      status: "coming-soon",
      isActive: true,
      url: env.PARCOURS2M_URL || "https://parcours2m.forge2m.com",
      tags: ["Voyage", "Itineraires", "Guides"],
      benefits: [
        "Creer des itineraires clairs",
        "Structurer les couts de voyage",
        "Regrouper lieux et activites",
        "Preparer une offre vendable",
      ],
      createdAt: "2026-07-08",
    },
  ];
}

export function getPlans() {
  return [
    {
      id: "plan_redkerf_pro",
      slug: "redkerf-pro",
      name: "RedKerf Pro",
      description: "Acces complet a RedKerf pour la production plasma.",
      priceMonthly: 79,
      priceYearly: 790,
      isActive: true,
      appSlugs: ["redkerf", "photo-contour", "pilotage-cnc", "viewkerf"],
    },
  ];
}

export function getPromotions() {
  return [
    {
      id: "promo_redkerf_launch",
      title: "Lancement RedKerf",
      description: "Premiere application disponible dans Forge2M Apps.",
      appSlug: "redkerf",
      planSlug: "redkerf-pro",
      badgeText: "Nouveau",
      isActive: true,
    },
  ];
}
