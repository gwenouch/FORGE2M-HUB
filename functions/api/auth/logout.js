import { json } from "../_lib/json.js";
import { buildClearCookie } from "../_lib/session.js";

export async function onRequestPost({ request }) {
  return json(
    { ok: true },
    {
      headers: {
        "set-cookie": buildClearCookie(request),
      },
    }
  );
}
