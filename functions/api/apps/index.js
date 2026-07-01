import { getApps } from "../_lib/data.js";
import { publicApp } from "../_lib/access.js";
import { json } from "../_lib/json.js";
import { readSession } from "../_lib/session.js";

export async function onRequestGet({ request, env }) {
  const session = await readSession(request, env);
  const apps = getApps(env).map((app) => publicApp(app, session));
  return json({ apps });
}
