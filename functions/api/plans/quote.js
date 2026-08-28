import { getApps } from "../_lib/data.js";
import { error, json, readJson } from "../_lib/json.js";

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const requestedSlugs = Array.isArray(body.appSlugs)
    ? [...new Set(body.appSlugs.filter((slug) => typeof slug === "string"))]
    : [];

  if (!requestedSlugs.length) {
    return error("Selectionnez au moins une application.");
  }

  const catalog = getApps(env).filter(
    (app) => app.isActive && app.isPurchasable && app.status === "active"
  );
  const selectedApps = requestedSlugs
    .map((slug) => catalog.find((app) => app.slug === slug))
    .filter(Boolean);

  if (selectedApps.length !== requestedSlugs.length) {
    return error("Une application selectionnee n'est pas disponible a l'achat.");
  }

  const priceMonthly = selectedApps.reduce(
    (total, app) => total + Number(app.priceMonthly || 0),
    0
  );

  return json({
    currency: "CAD",
    priceMonthly,
    priceYearly: priceMonthly * 12,
    appSlugs: selectedApps.map((app) => app.slug),
    apps: selectedApps.map((app) => ({
      slug: app.slug,
      name: app.name,
      priceMonthly: app.priceMonthly,
    })),
  });
}
