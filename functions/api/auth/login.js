import { getDemoUser } from "../_lib/data.js";
import { error, json, readJson } from "../_lib/json.js";
import { buildSessionCookie, createSessionToken, sessionResponse } from "../_lib/session.js";

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const login = String(body.login || "").trim();
  const code = String(body.code || "");
  const user = getDemoUser(env);

  if (!login || !code) {
    return error("Login et code requis.", 400);
  }

  if (login !== user.login || code !== user.code) {
    return error("Login ou code invalide.", 401);
  }

  const token = await createSessionToken(user, env);
  const session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    organization: {
      id: user.organizationId,
      name: user.organizationName,
      planSlug: user.planSlug,
      planName: "RedKerf Pro",
    },
  };

  return json(sessionResponse(session), {
    headers: {
      "set-cookie": buildSessionCookie(token, request),
    },
  });
}
