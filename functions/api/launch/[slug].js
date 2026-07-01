import { getApps } from "../_lib/data.js";
import { resolveAppAccess } from "../_lib/access.js";
import { readSession } from "../_lib/session.js";

export async function onRequestGet({ request, env, params }) {
  const url = new URL(request.url);
  const session = await readSession(request, env);

  if (!session?.user) {
    return Response.redirect(`${url.origin}/login?next=${encodeURIComponent(url.pathname)}`, 302);
  }

  const app = getApps(env).find((item) => item.slug === params.slug);
  if (!app) {
    return Response.redirect(`${url.origin}/dashboard`, 302);
  }

  const access = resolveAppAccess(session, app);
  if (!access.allowed) {
    return Response.redirect(`${url.origin}/not-included/${encodeURIComponent(app.slug)}`, 302);
  }

  return Response.redirect(app.url, 302);
}
