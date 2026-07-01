import { json } from "./_lib/json.js";

export async function onRequestGet() {
  return json({
    ok: true,
    app: "forge2m-hub",
    version: "0.1.0",
  });
}
