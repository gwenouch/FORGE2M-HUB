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
      image: "/assets/redkerf-logo.jpg",
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
      appSlugs: ["redkerf"],
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
