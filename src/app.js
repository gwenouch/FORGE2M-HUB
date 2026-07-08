const state = {
  session: null,
  apps: [],
  plans: [],
  activeSuite: null,
  loading: true,
  error: "",
};

const routes = {
  "/": renderHome,
  "/login": renderLogin,
  "/register": renderRegister,
  "/dashboard": renderDashboard,
  "/plans": renderPlans,
};

const appRoot = document.getElementById("app");

const appSections = [
  {
    id: "industrial",
    title: "Suite industrielle",
    shortTitle: "Industriel",
    description: "Production, coupe, qualite et pilotage atelier.",
    intro: "Applications de production, coupe plasma, atelier et performance industrielle.",
    theme: "industrial",
    apps: ["redkerf"],
    placeholders: [
      { name: "Suivi production", icon: "SP", label: "Plus tard" },
      { name: "Pareto defauts", icon: "PD", label: "Plus tard" },
      { name: "Maintenance", icon: "MT", label: "Plus tard" },
      { name: "Qualite", icon: "QL", label: "Plus tard" },
      { name: "Planning atelier", icon: "PA", label: "Plus tard" },
    ],
  },
  {
    id: "travel",
    title: "Voyages & loisirs",
    shortTitle: "Voyages",
    description: "Guides, itineraires et carnets pour vendre des experiences mieux preparees.",
    intro: "Une suite plus claire pour les outils de voyage, de planification et de loisirs.",
    theme: "travel",
    apps: ["parcours2m"],
    placeholders: [
      { name: "Planificateur sejour", icon: "PS", label: "A venir" },
      { name: "Carnet de route", icon: "CR", label: "A venir" },
      { name: "Goodies voyage", icon: "GV", label: "A venir" },
    ],
  },
  {
    id: "lab",
    title: "Laboratoire Forge2M",
    shortTitle: "Laboratoire",
    description: "Idees et modules qui pourront devenir des produits.",
    intro: "Espace d'essai pour les outils experimentaux et les futures branches produit.",
    theme: "lab",
    apps: [],
    placeholders: [
      { name: "Scan 3D", icon: "3D", label: "Concept" },
      { name: "Estimateur projet", icon: "EP", label: "Concept" },
      { name: "Assistant atelier", icon: "AA", label: "Concept" },
    ],
  },
];

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    const message = body?.error || `Erreur API ${response.status}`;
    throw new Error(message);
  }
  return body;
}

function navigate(path) {
  history.pushState({}, "", path);
  render();
}

function currentPath() {
  return window.location.pathname;
}

function requireSession() {
  if (!state.session?.user) {
    navigate(`/login?next=${encodeURIComponent(currentPath())}`);
    return false;
  }
  return true;
}

async function bootstrap() {
  try {
    const session = await api("/api/auth/session");
    state.session = session;
    if (session.authenticated) {
      const [apps, plans] = await Promise.all([api("/api/apps"), api("/api/plans")]);
      state.apps = apps.apps;
      state.plans = plans.plans;
    }
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
    render();
  }
}

function shell(content, options = {}) {
  const logged = Boolean(state.session?.authenticated);
  const nav = logged
    ? `<button class="nav-link" data-route="/dashboard">Dashboard</button>
       <button class="nav-link" data-route="/plans">Forfaits</button>
       <button class="nav-link ghost" data-action="logout">Deconnexion</button>`
    : `<button class="nav-link" data-route="/login">Connexion</button>`;

  appRoot.innerHTML = `
    <header class="topbar">
      <button class="brand" data-route="${logged ? "/dashboard" : "/"}" aria-label="Accueil Forge2M">
        <span class="brand-logo-wrap">
          <img src="/assets/forge2m-logo.jpg" alt="Forge2M" class="brand-logo" />
        </span>
        <span>
          <strong>Forge2M Apps</strong>
          <small>Portail applicatif</small>
        </span>
      </button>
      <nav>${nav}</nav>
    </header>
    <main class="${options.wide ? "main wide" : "main"}">${content}</main>
  `;

  bindGlobalActions();
}

function bindGlobalActions() {
  document.querySelectorAll("[data-route]").forEach((element) => {
    element.addEventListener("click", () => navigate(element.dataset.route));
  });

  document.querySelectorAll("[data-action='logout']").forEach((element) => {
    element.addEventListener("click", async () => {
      await api("/api/auth/logout", { method: "POST", body: "{}" });
      state.session = null;
      state.apps = [];
      state.plans = [];
      state.activeSuite = null;
      navigate("/");
    });
  });

  document.querySelectorAll("[data-suite]").forEach((element) => {
    element.addEventListener("click", () => {
      state.activeSuite = element.dataset.suite;
      render();
    });
  });

  document.querySelectorAll("[data-action='change-suite']").forEach((element) => {
    element.addEventListener("click", () => {
      state.activeSuite = null;
      render();
    });
  });
}

function renderHome() {
  shell(`
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Plateforme Forge2M</span>
        <h1>Un seul acces pour vos applications industrielles.</h1>
        <p>
          RedKerf devient la premiere application de la suite Forge2M.
          Le hub reste pret pour ajouter les autres outils quand tu me diras de les brancher.
        </p>
        <div class="hero-actions">
          <button class="primary" data-route="/login">Se connecter</button>
          <button class="secondary" data-route="/plans">Voir le forfait</button>
        </div>
      </div>
      <div class="hero-panel" aria-label="Apercu dashboard">
        <div class="window-bar"><span></span><span></span><span></span></div>
        <div class="preview-grid">
          <article class="mini-card active">
            <span class="mini-icon">RK</span>
            <strong>RedKerf</strong>
            <small>Application active</small>
          </article>
          <article class="mini-card locked">
            <span class="mini-icon">+</span>
            <strong>Prochaine app</strong>
            <small>Ajout plus tard</small>
          </article>
        </div>
      </div>
    </section>
  `);
}

function renderLogin() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") || "/dashboard";
  shell(`
    <section class="auth-card">
      <span class="eyebrow">Acces client</span>
      <h1>Connexion</h1>
      <p>Connectez-vous au hub Forge2M pour ouvrir les applications autorisees.</p>
      <form id="loginForm" class="form-grid">
        <label>
          Login
          <input name="login" autocomplete="username" required />
        </label>
        <label>
          Code
          <input name="code" type="password" autocomplete="current-password" required />
        </label>
        <button class="primary" type="submit">Entrer</button>
        <p id="loginMessage" class="form-message"></p>
      </form>
      <button class="text-button" data-route="/register">Demander un acces</button>
    </section>
  `);

  qs("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = qs("#loginMessage");
    message.textContent = "Verification...";
    try {
      const login = String(form.get("login") || "").trim();
      const code = String(form.get("code") || "");
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ login, code }),
      });
      state.session = result;
      const [apps, plans] = await Promise.all([api("/api/apps"), api("/api/plans")]);
      state.apps = apps.apps;
      state.plans = plans.plans;
      navigate(next.startsWith("/") ? next : "/dashboard");
    } catch (error) {
      message.textContent = error.message;
    }
  });
}

function renderRegister() {
  shell(`
    <section class="auth-card">
      <span class="eyebrow">Nouveau client</span>
      <h1>Demander un acces</h1>
      <p>
        La creation automatique de compte sera branchee avec la base de donnees et Stripe.
        Pour la V1, cette page prepare le parcours commercial.
      </p>
      <form id="registerForm" class="form-grid">
        <label>Nom<input name="name" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Application voulue<input name="app" value="RedKerf" /></label>
        <button class="primary" type="submit">Envoyer la demande</button>
        <p id="registerMessage" class="form-message"></p>
      </form>
    </section>
  `);

  qs("#registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = qs("#registerMessage");
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      message.textContent = result.message;
    } catch (error) {
      message.textContent = error.message;
    }
  });
}

function renderDashboard() {
  if (!requireSession()) return;

  const user = state.session.user;
  const activeSection = appSections.find((section) => section.id === state.activeSuite);
  if (!activeSection) {
    shell(renderSuitePicker(user), { wide: true });
    return;
  }

  const suite = renderSuiteWorkspace(activeSection, state.apps, user);
  shell(`
    ${suite}
  `, { wide: true });
}

function renderSuitePicker(user) {
  return `
    <section class="suite-picker">
      <div class="suite-picker-head">
        <span class="eyebrow">Portail Forge2M</span>
        <h1>Bienvenu ${escapeHtml(user.name)}</h1>
        <p>Choisissez votre suite de travail.</p>
      </div>
      <div class="suite-choice-grid">
        ${appSections.map(renderSuiteChoice).join("")}
      </div>
    </section>
  `;
}

function renderSuiteChoice(section) {
  return `
    <button class="suite-choice suite-choice-${escapeHtml(section.theme)}" data-suite="${escapeHtml(section.id)}" type="button">
      <span class="suite-choice-kicker">${escapeHtml(section.shortTitle)}</span>
      <strong>${escapeHtml(section.title)}</strong>
      <small>${escapeHtml(section.intro)}</small>
    </button>
  `;
}

function renderSuiteWorkspace(section, apps, user) {
  const appBySlug = new Map(apps.map((app) => [app.slug, app]));
  const realApps = section.apps
    .map((slug) => appBySlug.get(slug))
    .filter(Boolean)
    .map(renderAppTile)
    .join("");
  const placeholders = section.placeholders.map(renderEmptyTile).join("");

  return `
    <section class="suite-workspace suite-${escapeHtml(section.theme)}">
      <div class="suite-topline">
        <div>
          <span class="eyebrow">Application principale</span>
          <strong>RedKerf Pro</strong>
        </div>
        <button class="secondary" data-action="change-suite" type="button">Changer de suite</button>
      </div>
      <div class="suite-hero">
        <div>
          <span class="eyebrow">${escapeHtml(section.title)}</span>
          <h1>${escapeHtml(section.title)}</h1>
          <p>${escapeHtml(section.intro)}</p>
        </div>
        <div class="suite-actions">
          <div class="plan-pill">
            <span>Forfait actif</span>
            <strong>${escapeHtml(state.session.organization.planName)}</strong>
          </div>
        </div>
      </div>
      <div class="suite-board">
        <div class="section-title-row">
          <div>
            <span class="eyebrow">${escapeHtml(section.shortTitle)}</span>
            <p>${escapeHtml(section.description)}</p>
          </div>
        </div>
        <div class="launcher-grid">
          ${realApps}
          ${placeholders}
        </div>
      </div>
    </section>
  `;
}

function renderDashboardSections(apps) {
  const appBySlug = new Map(apps.map((app) => [app.slug, app]));

  return appSections
    .map((section) => {
      const realApps = section.apps
        .map((slug) => appBySlug.get(slug))
        .filter(Boolean)
        .map(renderAppTile)
        .join("");
      const placeholders = section.placeholders.map(renderEmptyTile).join("");

      return `
        <section class="launcher-section">
          <div class="section-title-row">
            <div>
              <span class="eyebrow">${escapeHtml(section.title)}</span>
              <p>${escapeHtml(section.description)}</p>
            </div>
          </div>
          <div class="launcher-grid">
            ${realApps}
            ${placeholders}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderAppTile(app) {
  const statusClass = app.access.allowed ? "available" : "locked";
  const action = app.access.allowed
    ? `<a class="primary" href="/api/launch/${encodeURIComponent(app.slug)}">Ouvrir</a>`
    : `<button class="secondary unlock" data-route="/apps/${escapeHtml(app.slug)}">S'abonner</button>`;
  const promoBadge = app.promotion
    ? `<span class="badge promo">${escapeHtml(app.promotion.badgeText)}</span>`
    : "";
  const badge = `
    ${promoBadge}
    <span class="badge ${statusClass}">
      ${app.access.allowed ? "Inclus forfait" : "A debloquer"}
    </span>
  `;
  const media = app.image
    ? `<img src="${escapeHtml(app.image)}" alt="${escapeHtml(app.name)}" />`
    : `<span>${escapeHtml(app.iconText)}</span>`;

  return `
    <article class="app-tile ${statusClass}">
      <div class="tile-image">${media}</div>
      <div class="tile-content">
        <div class="app-card-top">${badge}</div>
        <h2>${escapeHtml(app.name)}</h2>
        <p>${escapeHtml(app.description)}</p>
      </div>
      <div class="tile-actions">
        ${action}
        <button class="secondary" data-route="/apps/${escapeHtml(app.slug)}">Details</button>
      </div>
    </article>
  `;
}

function renderEmptyTile(tile) {
  return `
    <article class="app-tile empty-slot">
      <div class="tile-image placeholder-art">
        <span>${escapeHtml(tile.icon)}</span>
      </div>
      <div class="tile-content">
        <span class="badge locked">${escapeHtml(tile.label)}</span>
        <h2>${escapeHtml(tile.name)}</h2>
        <p>Emplacement reserve pour une future application Forge2M.</p>
      </div>
      <div class="tile-actions">
        <button class="secondary unlock" data-route="/plans" type="button">Voir packs</button>
      </div>
    </article>
  `;
}

async function renderAppDetail(slug) {
  if (!requireSession()) return;
  try {
    const { app } = await api(`/api/apps/${encodeURIComponent(slug)}`);
    shell(`
      <section class="detail-layout">
        <div class="detail-main">
          <span class="eyebrow">Application</span>
          <h1>${escapeHtml(app.name)}</h1>
          <p>${escapeHtml(app.longDescription)}</p>
          <div class="benefits">
            ${app.benefits.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
          </div>
          <div class="hero-actions">
            ${
              app.access.allowed
                ? `<a class="primary" href="/api/launch/${encodeURIComponent(app.slug)}">Ouvrir ${escapeHtml(app.name)}</a>`
                : `<button class="primary" data-route="/plans">Changer de forfait</button>`
            }
            <button class="secondary" data-route="/dashboard">Retour dashboard</button>
          </div>
        </div>
        <aside class="detail-side">
          <span class="app-icon large">${escapeHtml(app.iconText)}</span>
          <strong>${app.access.allowed ? "Acces autorise" : "Acces bloque"}</strong>
          <p>${escapeHtml(app.access.reason)}</p>
        </aside>
      </section>
    `, { wide: true });
  } catch (error) {
    shell(`<section class="empty-state"><h1>Application introuvable</h1><p>${escapeHtml(error.message)}</p></section>`);
  }
}

function renderPlans() {
  if (!state.session?.authenticated) {
    shell(`
      <section class="plans-head">
        <span class="eyebrow">Forfaits</span>
        <h1>Des packs pour construire la suite Forge2M.</h1>
        <p>Connectez-vous pour voir votre forfait actif.</p>
      </section>
      ${renderPlanGrid()}
    `, { wide: true });
    return;
  }

  shell(`
    <section class="plans-head">
      <span class="eyebrow">Abonnements</span>
      <h1>Forfait actuel : ${escapeHtml(state.session.organization.planName)}</h1>
      <p>Stripe sera branche ici pour acheter, changer ou gerer un abonnement.</p>
    </section>
    ${renderPlanGrid()}
  `, { wide: true });
}

function renderPlanGrid() {
  const plans = state.plans.length
    ? state.plans
    : [
        {
          name: "RedKerf Pro",
          description: "Acces complet a RedKerf.",
          priceMonthly: 79,
          apps: ["RedKerf"],
          isCurrent: false,
        },
      ];

  return `
    <section class="plan-grid">
      ${plans
        .map(
          (plan) => `
            <article class="plan-card ${plan.isCurrent ? "current" : ""}">
              <span class="badge ${plan.isCurrent ? "available" : ""}">
                ${plan.isCurrent ? "Actuel" : "Disponible"}
              </span>
              <h2>${escapeHtml(plan.name)}</h2>
              <p>${escapeHtml(plan.description)}</p>
              <strong>${plan.priceMonthly === 0 ? "Gratuit" : `${plan.priceMonthly} CAD / mois`}</strong>
              <div class="tag-row">${plan.apps.map((app) => `<span>${escapeHtml(app)}</span>`).join("")}</div>
              <button class="secondary" type="button">Stripe plus tard</button>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderNotIncluded(slug) {
  const app = state.apps.find((item) => item.slug === slug);
  shell(`
    <section class="detail-layout">
      <div class="detail-main">
        <span class="eyebrow">Acces non inclus</span>
        <h1>${escapeHtml(app?.name || "Application")}</h1>
        <p>Cette application n'est pas incluse dans le forfait actuel.</p>
        <div class="hero-actions">
          <button class="primary" data-route="/plans">Voir les forfaits</button>
          <button class="secondary" data-route="/dashboard">Retour</button>
        </div>
      </div>
    </section>
  `);
}

function render() {
  if (state.loading) {
    appRoot.innerHTML = `
      <div class="boot-screen">
        <div class="brand-mark">F2M</div>
        <p>Chargement Forge2M Apps...</p>
      </div>
    `;
    return;
  }

  const path = currentPath();
  if (path.startsWith("/apps/")) {
    renderAppDetail(decodeURIComponent(path.slice("/apps/".length)));
    return;
  }
  if (path.startsWith("/not-included/")) {
    renderNotIncluded(decodeURIComponent(path.slice("/not-included/".length)));
    return;
  }

  const renderer = routes[path] || renderHome;
  renderer();
}

window.addEventListener("popstate", render);
bootstrap();
