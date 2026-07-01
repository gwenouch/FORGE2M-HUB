import { json } from "../_lib/json.js";
import { readSession, sessionResponse } from "../_lib/session.js";

export async function onRequestGet({ request, env }) {
  const session = await readSession(request, env);
  return json(sessionResponse(session));
}
