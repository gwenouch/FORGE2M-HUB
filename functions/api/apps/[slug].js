import { getApps } from "../_lib/data.js";
import { publicApp } from "../_lib/access.js";
import { error, json } from "../_lib/json.js";
import { readSession } from "../_lib/session.js";

export async function onRequestGet({ request, env, params }) {
  const session = await readSession(request, env);
  const app = getApps(env).find((item) => item.slug === params.slug);
  if (!app) return error("Application introuvable.", 404);
  return json({ app: publicApp(app, session) });
}
