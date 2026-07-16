import { getPlans, getPromotions } from "./data.js";

export function findPlan(slug) {
  return getPlans().find((plan) => plan.slug === slug && plan.isActive);
}

export function promotionForApp(slug) {
  return getPromotions().find((promotion) => promotion.isActive && promotion.appSlug === slug) || null;
}

export function resolveAppAccess(session, app) {
  if (!session?.user) {
    return {
      allowed: false,
      reason: "Connexion requise.",
    };
  }

  if (!app?.isActive) {
    return {
      allowed: false,
      reason: "Application inactive.",
    };
  }

  const plan = findPlan(session.organization.planSlug);
  if (!plan) {
    return {
      allowed: false,
      reason: "Aucun forfait actif.",
    };
  }

  if (!plan.appSlugs.includes(app.slug)) {
    return {
      allowed: false,
      reason: "Cette application n'est pas incluse dans le forfait actuel.",
    };
  }

  return {
    allowed: true,
    reason: "Application incluse dans le forfait actif.",
  };
}

export function publicApp(app, session) {
  return {
    id: app.id,
    name: app.name,
    slug: app.slug,
    description: app.description,
    longDescription: app.longDescription,
    iconText: app.iconText,
    image: app.image || "",
    status: app.status,
    isActive: app.isActive,
    tags: app.tags,
    benefits: app.benefits,
    promotion: promotionForApp(app.slug),
    access: resolveAppAccess(session, app),
    launchPath: `/api/launch/${app.slug}`,
  };
}

export function publicPlan(plan, session) {
  const appNames = {
    redkerf: "RedKerf",
    "photo-contour": "Photo vers DXF",
    parcours2m: "Parcours2M",
  };

  return {
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    description: plan.description,
    priceMonthly: plan.priceMonthly,
    priceYearly: plan.priceYearly,
    isActive: plan.isActive,
    isCurrent: session?.organization?.planSlug === plan.slug,
    apps: plan.appSlugs.map((slug) => appNames[slug] || slug),
  };
}
