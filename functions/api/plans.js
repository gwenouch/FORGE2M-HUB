import { getPlans } from "./_lib/data.js";
import { publicPlan } from "./_lib/access.js";
import { json } from "./_lib/json.js";
import { readSession } from "./_lib/session.js";

export async function onRequestGet({ request, env }) {
  const session = await readSession(request, env);
  const plans = getPlans().map((plan) => publicPlan(plan, session));
  return json({ plans });
}
