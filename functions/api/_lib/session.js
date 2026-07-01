export const SESSION_COOKIE = "forge2m_hub_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secret(env = {}) {
  return env.HUB_SESSION_SECRET || "forge2m-hub-dev-secret-change-me";
}

function base64UrlEncode(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sign(value, env) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret(env)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function parseCookies(request) {
  const header = request.headers.get("cookie") || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const index = entry.indexOf("=");
        return [entry.slice(0, index), decodeURIComponent(entry.slice(index + 1))];
      })
  );
}

function secureCookieSuffix(request) {
  const isHttps = new URL(request.url).protocol === "https:";
  return isHttps ? "; Secure" : "";
}

export async function createSessionToken(user, env) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
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
      planName: user.planSlug === "redkerf-pro" ? "RedKerf Pro" : user.planSlug,
    },
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${await sign(encoded, env)}`;
}

export async function readSession(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token || !token.includes(".")) return null;

  const [encoded, signature] = token.split(".");
  const expected = await sign(encoded, env);
  if (signature !== expected) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encoded));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_error) {
    return null;
  }
}

export function buildSessionCookie(token, request) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secureCookieSuffix(request)}`;
}

export function buildClearCookie(request) {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureCookieSuffix(request)}`;
}

export function sessionResponse(session) {
  return {
    authenticated: Boolean(session),
    user: session?.user || null,
    organization: session?.organization || null,
  };
}
