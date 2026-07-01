import { json, readJson } from "../_lib/json.js";

export async function onRequestPost({ request }) {
  const body = await readJson(request);
  const email = String(body.email || "").trim();

  return json({
    ok: true,
    message: email
      ? "Demande recue. La creation client sera branchee avec Stripe et la base D1."
      : "Demande recue.",
  });
}
