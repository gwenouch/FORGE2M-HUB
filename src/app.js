const PLAN_SELECTION_KEY = "forge2m-custom-plan-selection";

const state = {
  session: null,
  apps: [],
  plans: [],
  planSelection: new Set(loadPlanSelection()),
  activeSuite: null,
  loading: true,
  error: "",
};

const FORGE2M_SLOGAN_TAGLINE =
  "un marteau arrivant du ciel, un coup sur les monts et ce portail deviendra ton chemin.";
const FORGE2M_SLOGAN_HIGHLIGHT =
  "un coup sur les monts et ce portail deviendra ton chemin";

const routes = {
  "/": renderHome,
  "/login": renderLogin,
  "/register": renderRegister,
  "/dashboard": renderDashboard,
  "/plans": renderPlans,
  "/a-propos": () => renderStaticSitePage("about"),
  "/contact": () => renderStaticSitePage("contact"),
  "/faq": () => renderStaticSitePage("faq"),
  "/support": () => renderStaticSitePage("support"),
  "/mentions-legales": () => renderStaticSitePage("legal"),
  "/confidentialite": () => renderStaticSitePage("privacy"),
  "/conditions": () => renderStaticSitePage("terms"),
};

const sitePageContent = {
  about: {
    title: "A propos de Forge2M",
    eyebrow: "Entreprise",
    intro:
      "Forge2M developpe des applications pour l'industrie, les voyages et les outils utilitaires du quotidien.",
    blocks: [
      {
        title: "Notre mission",
        text: "Centraliser l'acces aux applications Forge2M et simplifier la gestion des forfaits pour nos clients.",
      },
      {
        title: "Nos applications",
        text: "RedKerf pour la coupe plasma et Parcours2M pour les voyages. D'autres outils seront ajoutes progressivement.",
      },
      {
        title: "Forge de Montagnes",
        text: "Informations societe, historique et equipe a completer prochainement.",
      },
    ],
  },
  contact: {
    title: "Contactez-nous",
    eyebrow: "Contact",
    intro: "Une question sur RedKerf, Parcours2M ou votre forfait ? Ecrivez-nous.",
    blocks: [
      { title: "Courriel", text: "contact@forge2m.com (a confirmer)" },
      { title: "Telephone", text: "A completer" },
      { title: "Adresse", text: "Quebec, Canada — adresse complete a venir" },
      { title: "Heures", text: "Lun–ven, 9 h–17 h (HNE) — a confirmer" },
    ],
    extra: `
      <form class="contact-form" id="contactForm">
        <h2>Envoyer un message</h2>
        <p class="contact-form-note">Formulaire en preparation. Les champs seront branches prochainement.</p>
        <div class="contact-form-grid">
          <label>Nom<input name="name" placeholder="Votre nom" disabled /></label>
          <label>Courriel<input name="email" type="email" placeholder="vous@exemple.com" disabled /></label>
          <label class="contact-form-full">Sujet<input name="subject" placeholder="Sujet de votre message" disabled /></label>
          <label class="contact-form-full">Message<textarea name="message" rows="5" placeholder="Votre message..." disabled></textarea></label>
        </div>
        <button class="primary" type="button" disabled>Bientot disponible</button>
      </form>
    `,
  },
  faq: {
    title: "Foire aux questions",
    eyebrow: "Aide",
    intro: "Reponses aux questions frequentes sur Forge2M Apps.",
    blocks: [
      {
        title: "Comment acceder aux applications ?",
        text: "Connectez-vous avec votre login et code, puis cliquez sur le logo de l'application dans le dashboard.",
      },
      {
        title: "Quels forfaits sont disponibles ?",
        text: "Le forfait Forge2M se compose a la carte. Cochez les applications souhaitees et le prix mensuel s'ajuste automatiquement.",
      },
      {
        title: "Comment changer de forfait ?",
        text: "Ouvrez la page Forfaits, modifiez votre selection puis enregistrez-la. Le paiement Stripe sera ajoute lors de la mise en vente.",
      },
      {
        title: "Probleme technique ?",
        text: "Consultez la page Support ou contactez-nous via le formulaire de contact.",
      },
    ],
  },
  support: {
    title: "Support & aide",
    eyebrow: "Support",
    intro: "Ressources pour utiliser le portail et les applications Forge2M.",
    blocks: [
      { title: "Demarrage rapide", text: "Connectez-vous, ouvrez le dashboard et lancez RedKerf ou Parcours2M." },
      { title: "Documentation", text: "Guides detailles par application — a publier prochainement." },
      { title: "Statut des services", text: "Page de statut en ligne — a ajouter." },
      { title: "Signaler un bug", text: "Utilisez la page Contactez-nous en decrivant le probleme rencontre." },
    ],
  },
  legal: {
    title: "Mentions legales",
    eyebrow: "Legal",
    intro: "Informations legales relatives au site forge2m.com et a Forge2M Apps.",
    blocks: [
      { title: "Editeur du site", text: "Raison sociale, NEQ et adresse — a completer." },
      { title: "Hebergeur", text: "Cloudflare Pages — details a completer." },
      { title: "Propriete intellectuelle", text: "Contenus, marques et logos Forge2M — texte legal a completer." },
      { title: "Responsable de publication", text: "Nom et coordonnees — a completer." },
    ],
  },
  privacy: {
    title: "Politique de confidentialite",
    eyebrow: "Legal",
    intro: "Comment Forge2M traite vos donnees personnelles.",
    blocks: [
      { title: "Donnees collectees", text: "Login, usage du portail et donnees de facturation — details a completer." },
      { title: "Finalite", text: "Authentification, gestion des forfaits et support client." },
      { title: "Conservation", text: "Durees de conservation — a definir." },
      { title: "Vos droits", text: "Acces, rectification et suppression — procedure a completer (Loi 25 / RGPD)." },
    ],
  },
  terms: {
    title: "Conditions d'utilisation",
    eyebrow: "Legal",
    intro: "Conditions generales d'utilisation de Forge2M Apps et des applications associees.",
    blocks: [
      { title: "Acceptation", text: "En utilisant le portail, vous acceptez ces conditions — texte complet a rediger." },
      { title: "Comptes et acces", text: "Chaque compte est personnel. Ne partagez pas vos identifiants." },
      { title: "Forfaits et paiement", text: "Modalites d'abonnement, renouvellement et remboursement — a completer." },
      { title: "Limitation de responsabilite", text: "Clauses juridiques a valider avec conseil legal." },
    ],
  },
};

const footerSections = [
  {
    title: "Forge2M",
    links: [
      { label: "A propos", route: "/a-propos" },
      { label: "Forfaits", route: "/plans" },
      { label: "Contactez-nous", route: "/contact" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "FAQ", route: "/faq" },
      { label: "Support", route: "/support" },
      { label: "Demander un acces", route: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Mentions legales", route: "/mentions-legales" },
      { label: "Confidentialite", route: "/confidentialite" },
      { label: "Conditions", route: "/conditions" },
    ],
  },
];

const appRoot = document.getElementById("app");

const appSections = [
  {
    id: "industrial",
    title: "Suite industrielle",
    shortTitle: "Industriel",
    description: "Production, coupe, qualite et pilotage atelier.",
    intro: "Applications de production, coupe plasma, atelier et performance industrielle.",
    theme: "industrial",
    apps: ["photo-contour", "viewkerf", "redkerf", "pilotage-cnc", "pulse"],
    placeholders: [],
  },
  {
    id: "travel",
    title: "Suite loisirs",
    shortTitle: "Loisirs",
    description: "Sport, voyages, guides et experiences pour apprendre, progresser et decouvrir.",
    intro: "Les applications Forge2M consacrees au sport, aux voyages et aux loisirs.",
    theme: "travel",
    apps: ["judoka", "parcours2m"],
    placeholders: [],
  },
  {
    id: "utility",
    title: "Suite Utilitaire",
    shortTitle: "Utilitaire",
    description: "Outils pratiques pour simplifier les taches du quotidien.",
    intro: "Les utilitaires Forge2M reunis dans un espace simple et rapide.",
    theme: "utility",
    apps: [],
    placeholders: ["Premier utilitaire en preparation"],
  },
];

function getLiveAppSections() {
  return appSections.filter((section) => section.apps.length > 0 || section.placeholders.length > 0);
}

function loadPlanSelection() {
  try {
    const stored = JSON.parse(localStorage.getItem(PLAN_SELECTION_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter((slug) => typeof slug === "string") : [];
  } catch (error) {
    return [];
  }
}

function savePlanSelection() {
  try {
    localStorage.setItem(PLAN_SELECTION_KEY, JSON.stringify([...state.planSelection]));
  } catch (error) {
    // The configurator remains usable when browser storage is unavailable.
  }
}

function formatCad(value) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

const tickerAds = [
  {
    slug: "redkerf",
    name: "RedKerf",
    logo: "/assets/redkerf-logo-square.png?v=2",
    icon: "RK",
    price: "79 $/mois",
    pitch: "Gagnez des heures sur chaque programme plasma : DXF, imbrication, simulation et G-code pret machine.",
    theme: "industrial",
    route: "/apps/redkerf",
  },
  {
    slug: "photo-contour",
    name: "TraceKerf",
    logo: "/assets/tracekerf-logo-square.png?v=2",
    icon: "TK",
    price: "Nouveau - Inclus RedKerf Pro",
    pitch: "De la photo au trait de coupe : detourez une piece en photo et exportez un DXF a l'echelle, pret a decouper.",
    theme: "industrial",
    route: "/apps/photo-contour",
  },
  {
    slug: "viewkerf",
    name: "ViewKerf",
    logo: "/assets/viewkerf-logo.png?v=2",
    icon: "VK",
    price: "Inclus RedKerf Pro",
    pitch: "Ouvrez, nettoyez et mesurez vos DXF, visualisez la tole en 3D, ajoutez du texte et envoyez vers RedKerf.",
    theme: "industrial",
    route: "/apps/viewkerf",
  },
  {
    slug: "pilotage-cnc",
    name: "DriveKerf",
    logo: "/assets/drivekerf-logo.png?v=3",
    icon: "DK",
    price: "Inclus RedKerf Pro",
    pitch: "Pilotez la CNC en direct : jog, manette Xbox, torche M3/M5, G-code, USB et Wi-Fi.",
    theme: "industrial",
    route: "/apps/pilotage-cnc",
  },
  {
    slug: "pulse",
    name: "Pulse",
    logo: "/assets/pulse-logo.png?v=1",
    icon: "PL",
    price: "Inclus RedKerf Pro",
    pitch: "Gestion de projet industrielle : Project Pulse, Command Center et pratiques PMP pour savoir ou agir.",
    theme: "industrial",
    route: "/apps/pulse",
  },
  {
    slug: "judoka",
    name: "Judoka",
    logo: "",
    icon: "柔",
    price: "Inclus a votre acces",
    pitch: "Apprenez les techniques essentielles du judo et suivez votre progression, ceinture apres ceinture.",
    theme: "travel",
    route: "/apps/judoka",
  },
  {
    slug: "parcours2m",
    name: "Parcours2M",
    logo: "/assets/parcours2m-logo.jpg",
    icon: "P2M",
    price: "Lancement prochain",
    pitch: "Vendez des voyages mieux prepares : itineraires, budgets, lieux et guides prets a partager.",
    theme: "travel",
    route: "/apps/parcours2m",
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
    const [session, apps, plans] = await Promise.all([
      api("/api/auth/session"),
      api("/api/apps"),
      api("/api/plans"),
    ]);
    state.session = session;
    state.apps = apps.apps;
    state.plans = plans.plans;
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
    render();
  }
}

function renderTopbarSlogan(className = "topbar-slogan") {
  const tagline = FORGE2M_SLOGAN_TAGLINE.replace(
    FORGE2M_SLOGAN_HIGHLIGHT,
    `<em>${FORGE2M_SLOGAN_HIGHLIGHT}</em>`
  );

  return `
    <p class="${className}" aria-label="Slogan Forge2M">
      <span class="topbar-slogan-brand">Forge2M</span>
      <span class="topbar-slogan-text"> — ${tagline}</span>
    </p>
  `;
}

function renderTopbarBrand({ logged, compact }) {
  const route = logged ? "/dashboard" : "/";
  const copy = compact
    ? ""
    : `
      <span class="brand-copy">
        <strong>Forge2M Apps</strong>
        <small>Portail applicatif</small>
      </span>
    `;

  return `
    <button class="brand brand-gif-brand${compact ? " brand-gif-brand-compact" : ""}" data-route="${route}" aria-label="Accueil Forge2M">
      <span class="brand-logo-wrap brand-gif-wrap">
        <img src="/assets/forge2m.gif?v=hub32" alt="Forge2M" class="brand-logo brand-gif" loading="eager" decoding="async" />
      </span>
      ${copy}
    </button>
  `;
}

function shell(content, options = {}) {
  const logged = Boolean(state.session?.authenticated);
  const path = currentPath();
  const user = state.session?.user;
  const brand = renderTopbarBrand({ logged, compact: true });

  let header;
  if (options.dashboardUser) {
    const planName = state.session?.organization?.planName || "Forfait actif";
    header = `
      <header class="topbar topbar-slim topbar-dashboard">
        <div class="topbar-row topbar-row-slim">
          ${brand}
          ${renderTopbarSlogan("topbar-slogan topbar-slogan-dashboard")}
          <nav class="topbar-nav-unified">
            <span class="nav-chip" title="Forfait actif">${escapeHtml(planName)}</span>
            <button class="nav-link is-active" data-route="/dashboard" type="button">Dashboard</button>
            <button class="nav-link${path === "/plans" ? " is-active" : ""}" data-route="/plans" type="button">Forfaits</button>
            <button class="nav-link ghost" data-action="logout" type="button">Deconnexion</button>
          </nav>
        </div>
      </header>
    `;
  } else {
    const nav = logged
      ? `<div class="user-pill" aria-label="Compte connecte">
           <span class="user-pill-avatar">${escapeHtml((user?.name || "F2M").slice(0, 2).toUpperCase())}</span>
           <span>
             <strong>${escapeHtml(user?.name || "Forge2M")}</strong>
             <small>${escapeHtml(state.session?.organization?.planName || "Forfait actif")}</small>
           </span>
         </div>
         <button class="nav-link${path === "/dashboard" ? " is-active" : ""}" data-route="/dashboard" type="button">Dashboard</button>
         <button class="nav-link${path === "/plans" ? " is-active" : ""}" data-route="/plans" type="button">Forfaits</button>
         <button class="nav-link ghost" data-action="logout" type="button">Deconnexion</button>`
      : `<button class="nav-link${path === "/login" ? " is-active" : ""}" data-route="/login" type="button">Connexion</button>`;

    header = `
      <header class="topbar topbar-slim">
        <div class="topbar-row topbar-row-slim">
          ${brand}
          ${renderTopbarSlogan()}
          <nav>${nav}</nav>
        </div>
      </header>
    `;
  }

  appRoot.innerHTML = `
    ${header}
    <main class="${options.wide ? "main wide" : "main"}">${content}</main>
    ${renderSiteFooter()}
    ${renderPromoTicker()}
  `;

  bindGlobalActions();
}

function renderSiteFooter() {
  const year = new Date().getFullYear();
  const columns = footerSections
    .map(
      (section) => `
        <div class="site-footer-col">
          <strong>${escapeHtml(section.title)}</strong>
          <ul>
            ${section.links
              .map(
                (link) =>
                  `<li><button class="site-footer-link" type="button" data-route="${escapeHtml(link.route)}">${escapeHtml(link.label)}</button></li>`
              )
              .join("")}
          </ul>
        </div>
      `
    )
    .join("");

  return `
    <footer class="site-footer" aria-label="Pied de page Forge2M">
      <div class="site-footer-inner">
        <div class="site-footer-brand">
          <strong>Forge2M Apps</strong>
          <p>Portail applicatif — industrie, voyages et outils numeriques.</p>
          <button class="site-footer-link" type="button" data-route="/">Accueil</button>
        </div>
        <div class="site-footer-cols">${columns}</div>
      </div>
      <div class="site-footer-bottom">
        <span>&copy; ${year} Forge2M. Tous droits reserves.</span>
        <span class="site-footer-bottom-links">
          <button class="site-footer-link" type="button" data-route="/mentions-legales">Mentions legales</button>
          <button class="site-footer-link" type="button" data-route="/confidentialite">Confidentialite</button>
          <button class="site-footer-link" type="button" data-route="/conditions">Conditions</button>
        </span>
      </div>
    </footer>
  `;
}

function renderStaticSitePage(pageKey) {
  const page = sitePageContent[pageKey];
  if (!page) {
    shell(`<section class="empty-state"><h1>Page introuvable</h1></section>`);
    return;
  }

  const blocks = (page.blocks || [])
    .map(
      (block) => `
        <article class="site-info-card">
          <h2>${escapeHtml(block.title)}</h2>
          <p>${escapeHtml(block.text)}</p>
        </article>
      `
    )
    .join("");

  shell(`
    <section class="site-page">
      <header class="site-page-head">
        <span class="eyebrow">${escapeHtml(page.eyebrow)}</span>
        <h1>${escapeHtml(page.title)}</h1>
        <p>${escapeHtml(page.intro)}</p>
      </header>
      <div class="site-page-grid">${blocks}</div>
      ${page.extra || ""}
      <div class="site-page-actions hero-actions">
        <button class="secondary" type="button" data-route="/contact">Contactez-nous</button>
        <button class="ghost" type="button" data-route="/">Retour a l'accueil</button>
      </div>
    </section>
  `);
}

function renderPromoTickerItem(ad) {
  return `
    <a class="promo-ticker-item promo-ticker-item-${escapeHtml(ad.theme)}" href="${escapeHtml(ad.route)}" data-route="${escapeHtml(ad.route)}">
      <span class="promo-ticker-logo">
        ${ad.logo
          ? `<img src="${escapeHtml(ad.logo)}" alt="" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false" /><span class="promo-ticker-fallback" hidden>${escapeHtml(ad.icon)}</span>`
          : `<span class="promo-ticker-fallback">${escapeHtml(ad.icon)}</span>`}
      </span>
      <span class="promo-ticker-copy">
        <strong>${escapeHtml(ad.name)}</strong>
        <span>${escapeHtml(ad.pitch)}</span>
      </span>
      <span class="promo-ticker-price">${escapeHtml(ad.price)}</span>
    </a>
    <span class="promo-ticker-sep" aria-hidden="true">◆</span>
  `;
}

function renderPromoTicker() {
  const items = tickerAds.map(renderPromoTickerItem).join("");
  const loop = `${items}${items}`;
  return `
    <aside class="promo-ticker" aria-label="Annonces applications Forge2M">
      <div class="promo-ticker-badge">
        <div class="promo-ticker-badge-stack">
          <img src="/assets/forge2m-logo.jpg" alt="Forge2M" class="promo-ticker-badge-logo" />
          <p class="promo-ticker-breaking" aria-label="Breaking news">
            <span class="promo-ticker-breaking-label">Breaking News</span>
          </p>
        </div>
      </div>
      <div class="promo-ticker-viewport">
        <div class="promo-ticker-track">${loop}</div>
      </div>
    </aside>
  `;
}

function bindGlobalActions() {
  document.querySelectorAll("[data-route]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (element.tagName === "A") {
        event.preventDefault();
      }
      navigate(element.dataset.route);
    });
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

  document.querySelectorAll("[data-plan-app]").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.planSelection.add(input.dataset.planApp);
      } else {
        state.planSelection.delete(input.dataset.planApp);
      }
      savePlanSelection();
      updatePlanBuilderUi();
    });
  });

  document.querySelectorAll("[data-plan-suite]").forEach((input) => {
    input.addEventListener("change", () => {
      const slugs = String(input.dataset.planSuiteApps || "").split(",").filter(Boolean);
      slugs.forEach((slug) => {
        if (input.checked) {
          state.planSelection.add(slug);
        } else {
          state.planSelection.delete(slug);
        }
      });
      savePlanSelection();
      updatePlanBuilderUi();
    });
  });

  document.querySelectorAll("[data-action='reset-custom-plan']").forEach((element) => {
    element.addEventListener("click", () => {
      state.planSelection.clear();
      savePlanSelection();
      updatePlanBuilderUi();
    });
  });

  document.querySelectorAll("[data-action='save-custom-plan']").forEach((element) => {
    element.addEventListener("click", async () => {
      savePlanSelection();
      const message = qs("[data-plan-message]");
      element.disabled = true;
      if (message) message.textContent = "Verification du tarif...";

      try {
        const quote = await api("/api/plans/quote", {
          method: "POST",
          body: JSON.stringify({ appSlugs: [...state.planSelection] }),
        });
        const totalNode = qs("[data-plan-total]");
        const annualNode = qs("[data-plan-annual]");
        if (totalNode) totalNode.textContent = formatCad(quote.priceMonthly);
        if (annualNode) annualNode.textContent = formatCad(quote.priceYearly);
        if (message) {
          message.textContent = `Selection enregistree et tarif confirme : ${formatCad(quote.priceMonthly)} par mois.`;
        }
      } catch (error) {
        if (message) message.textContent = error.message;
      } finally {
        element.disabled = state.planSelection.size === 0;
      }
    });
  });
}

function selectedPlanApps() {
  return state.apps.filter(
    (app) => app.isPurchasable && state.planSelection.has(app.slug)
  );
}

function renderPlanSelectionList(apps) {
  if (!apps.length) {
    return `<p class="plan-summary-empty">Cochez les applications dont vous avez besoin.</p>`;
  }

  return `
    <ul class="plan-summary-list">
      ${apps
        .map(
          (app) => `
            <li>
              <span>${escapeHtml(app.name)}</span>
              <strong>${escapeHtml(formatCad(app.priceMonthly))}</strong>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function updatePlanBuilderUi() {
  const apps = selectedPlanApps();
  const total = apps.reduce((sum, app) => sum + Number(app.priceMonthly || 0), 0);
  const count = apps.length;

  document.querySelectorAll("[data-plan-app]").forEach((input) => {
    const selected = state.planSelection.has(input.dataset.planApp);
    input.checked = selected;
    input.closest(".plan-app-option")?.classList.toggle("selected", selected);
  });

  document.querySelectorAll("[data-plan-suite]").forEach((input) => {
    const slugs = String(input.dataset.planSuiteApps || "").split(",").filter(Boolean);
    const selectedCount = slugs.filter((slug) => state.planSelection.has(slug)).length;
    input.checked = slugs.length > 0 && selectedCount === slugs.length;
    input.indeterminate = selectedCount > 0 && selectedCount < slugs.length;
  });

  const countNode = qs("[data-plan-count]");
  const totalNode = qs("[data-plan-total]");
  const annualNode = qs("[data-plan-annual]");
  const listNode = qs("[data-plan-selected-list]");
  const saveButton = qs("[data-action='save-custom-plan']");
  const resetButton = qs("[data-action='reset-custom-plan']");
  const message = qs("[data-plan-message]");

  if (countNode) countNode.textContent = `${count} application${count > 1 ? "s" : ""}`;
  if (totalNode) totalNode.textContent = formatCad(total);
  if (annualNode) annualNode.textContent = formatCad(total * 12);
  if (listNode) listNode.innerHTML = renderPlanSelectionList(apps);
  if (saveButton) saveButton.disabled = count === 0;
  if (resetButton) resetButton.disabled = count === 0;
  if (message) message.textContent = "";
}

function renderHome() {
  shell(`
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Plateforme Forge2M</span>
        <h1>Toutes vos applications, un seul portail.</h1>
        <p>
          Lancez RedKerf, Parcours2M et les futurs utilitaires Forge2M depuis un hub unique.
          Gerez vos forfaits et ouvrez chaque application en un clic.
        </p>
        <div class="hero-actions">
          <button class="primary" data-route="/login">Se connecter</button>
          <button class="secondary" data-route="/plans">Voir les forfaits</button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <strong>2</strong>
            <span>Applications en catalogue</span>
          </div>
          <div class="hero-stat">
            <strong>3</strong>
            <span>Suites actives</span>
          </div>
          <div class="hero-stat">
            <strong>1</strong>
            <span>Forfait disponible</span>
          </div>
        </div>
      </div>
      <div class="hero-panel" aria-label="Apercu dashboard">
        <div class="window-bar"><span></span><span></span><span></span></div>
        <div class="preview-grid">
          <article class="mini-card active">
            <span class="mini-icon">RK</span>
            <strong>RedKerf</strong>
            <small>Coupe plasma &amp; G-code</small>
          </article>
          <article class="mini-card active">
            <span class="mini-icon">P2</span>
            <strong>Parcours2M</strong>
            <small>Voyages &amp; itineraires</small>
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
    <section class="auth-layout">
      <div class="auth-showcase">
        <span class="eyebrow">Forge2M Apps</span>
        <h2>Votre espace client pour lancer les applications autorisees.</h2>
        <p>Un seul login pour acceder a RedKerf, Parcours2M et les prochains outils de la suite.</p>
        <ul>
          <li>Lancement direct des applications incluses dans votre forfait</li>
          <li>Gestion centralisee des abonnements</li>
          <li>Portail pret pour de nouvelles suites produit</li>
        </ul>
      </div>
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
  state.activeSuite = null;
  shell(renderDirectDashboard(), { wide: true, dashboardUser: state.session.user });
}

function renderDirectDashboard() {
  const appBySlug = new Map(state.apps.map((app) => [app.slug, app]));
  const sections = getLiveAppSections()
    .map((section) => {
      const tiles = section.apps
        .map((slug) => appBySlug.get(slug))
        .filter(Boolean)
        .map(renderAppTile)
        .join("");
      const placeholders = section.placeholders
        .map(
          (label) => `
            <article class="suite-reserved-slot" aria-label="${escapeHtml(label)}">
              <span class="suite-reserved-mark">U</span>
              <div>
                <span class="suite-reserved-kicker">A venir</span>
                <strong>${escapeHtml(label)}</strong>
                <p>Une nouvelle application trouvera sa place ici.</p>
              </div>
            </article>
          `
        )
        .join("");
      return `
        <section class="dashboard-suite-block suite-${escapeHtml(section.theme)}">
          <div class="section-title-row">
            <div>
              <span class="eyebrow">${escapeHtml(section.title)}</span>
              <p>${escapeHtml(section.description)}</p>
            </div>
          </div>
          <div class="launcher-grid dashboard-launcher-grid">${tiles}${placeholders}</div>
        </section>
      `;
    })
    .join("");

  return `
    <section class="dashboard-direct">
      <div class="dashboard-suite-grid">${sections}</div>
    </section>
  `;
}

function renderAppTile(app) {
  const statusClass = app.access.allowed ? "available" : "locked";
  const launchHref = app.access.allowed
    ? `/api/launch/${encodeURIComponent(app.slug)}`
    : `/apps/${encodeURIComponent(app.slug)}`;
  const launchHint = app.access.allowed ? "Cliquer pour lancer" : "Voir les forfaits";
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
    ? `<img src="${escapeHtml(app.image)}" alt="${escapeHtml(app.name)}" loading="lazy" />`
    : `<span class="tile-fallback">${escapeHtml(app.iconText)}</span>`;

  const launchAttrs = app.access.allowed
    ? `href="${escapeHtml(launchHref)}" target="_blank" rel="noopener noreferrer" aria-label="Lancer ${escapeHtml(app.name)} (nouvel onglet)"`
    : `href="/apps/${escapeHtml(app.slug)}" data-route="/apps/${escapeHtml(app.slug)}" aria-label="Voir ${escapeHtml(app.name)}"`;

  return `
    <article class="app-tile pad-3d ${statusClass}">
      <div class="tile-content">
        <div class="app-card-top">${badge}</div>
        <h2>${escapeHtml(app.name)}</h2>
        <p>${escapeHtml(app.description)}</p>
      </div>
      <a class="tile-launch${app.access.allowed ? "" : " tile-launch-locked"}" ${launchAttrs}>
        <span class="tile-logo-stage">
          <span class="tile-image">${media}</span>
          <span class="tile-launch-hint">${launchHint}</span>
        </span>
      </a>
      <button class="tile-details-link" data-route="/apps/${escapeHtml(app.slug)}" type="button">Plus d infos</button>
    </article>
  `;
}

function getTickerAdForSlug(slug) {
  return tickerAds.find((ad) => ad.slug === slug) || null;
}

function renderAppLogoMedia(app) {
  if (app.image) {
    return `<img src="${escapeHtml(app.image)}" alt="${escapeHtml(app.name)}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false" /><span class="tile-fallback" hidden>${escapeHtml(app.iconText || "")}</span>`;
  }
  return `<span class="tile-fallback">${escapeHtml(app.iconText || "?")}</span>`;
}

function renderAppDetailPage(app, options = {}) {
  const promo = getTickerAdForSlug(app.slug);
  const theme = promo?.theme || "industrial";
  const pitch = promo?.pitch || app.description || app.longDescription;
  const price = promo?.price || "";
  const allowed = options.allowed ?? app.access?.allowed ?? false;
  const accessReason = options.accessReason || app.access?.reason || "";
  const blocked = options.blocked === true;
  const promoBadge = app.promotion
    ? `<span class="badge promo">${escapeHtml(app.promotion.badgeText)}</span>`
    : "";
  const statusBadge = blocked
    ? `<span class="badge locked">Forfait requis</span>`
    : `<span class="badge ${allowed ? "available" : "locked"}">${allowed ? "Inclus forfait" : "A debloquer"}</span>`;
  const tags = (app.tags || [])
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");
  const benefits = (app.benefits || [])
    .map((item) => `<article class="app-detail-benefit"><span>${escapeHtml(item)}</span></article>`)
    .join("");
  const launchHref = allowed ? `/api/launch/${encodeURIComponent(app.slug)}` : "/plans";
  const launchLabel = allowed ? `Lancer ${app.name}` : "Voir les forfaits";
  const launchClass = allowed ? "primary app-detail-cta-launch" : "primary";
  const launchAttrs = allowed
    ? `href="${escapeHtml(launchHref)}" target="_blank" rel="noopener noreferrer"`
    : `href="/plans" data-route="/plans"`;

  return `
    <section class="app-detail-page app-detail-page-${escapeHtml(theme)}">
      <div class="app-detail-hero">
        <div class="app-detail-hero-copy">
          <div class="app-card-top">${promoBadge}${statusBadge}</div>
          <span class="eyebrow">Application Forge2M</span>
          <h1>${escapeHtml(app.name)}</h1>
          <p class="app-detail-pitch">${escapeHtml(pitch)}</p>
          ${price ? `<div class="app-detail-price">${escapeHtml(price)}</div>` : ""}
          ${tags ? `<div class="tag-row app-detail-tags">${tags}</div>` : ""}
        </div>
        <div class="app-detail-hero-visual">
          <a class="app-detail-launch tile-launch${allowed ? "" : " tile-launch-locked"}" ${launchAttrs} aria-label="${escapeHtml(launchLabel)}">
            <span class="tile-logo-stage app-detail-logo-stage">
              <span class="tile-image app-detail-logo">${renderAppLogoMedia(app)}</span>
              <span class="tile-launch-hint">${allowed ? "Cliquer pour lancer" : "Voir les forfaits"}</span>
            </span>
          </a>
          <div class="app-detail-access-card">
            <strong>${allowed ? "Acces autorise" : blocked ? "Acces non inclus" : "Acces bloque"}</strong>
            <p>${escapeHtml(accessReason || app.longDescription || "")}</p>
          </div>
        </div>
      </div>

      <div class="app-detail-body">
        <section class="app-detail-about">
          <span class="eyebrow">Presentation</span>
          <h2>Ce que fait ${escapeHtml(app.name)}</h2>
          <p>${escapeHtml(app.longDescription || app.description || "")}</p>
        </section>

        ${
          benefits
            ? `<section class="app-detail-benefits-wrap">
                <span class="eyebrow">Avantages</span>
                <h2>Ce que vous gagnez</h2>
                <div class="app-detail-benefits">${benefits}</div>
              </section>`
            : ""
        }

        <div class="app-detail-actions hero-actions">
          <a class="${launchClass}" ${launchAttrs}>${escapeHtml(launchLabel)}</a>
          <button class="secondary" data-route="/dashboard" type="button">Retour dashboard</button>
        </div>
      </div>
    </section>
  `;
}

async function renderAppDetail(slug) {
  if (!requireSession()) return;
  try {
    const { app } = await api(`/api/apps/${encodeURIComponent(slug)}`);
    shell(renderAppDetailPage(app), { wide: true });
  } catch (error) {
    shell(`<section class="empty-state"><h1>Application introuvable</h1><p>${escapeHtml(error.message)}</p></section>`);
  }
}

function renderPlans() {
  const validSlugs = new Set(state.apps.filter((app) => app.isPurchasable).map((app) => app.slug));
  state.planSelection = new Set([...state.planSelection].filter((slug) => validSlugs.has(slug)));

  const selectedApps = selectedPlanApps();
  const total = selectedApps.reduce((sum, app) => sum + Number(app.priceMonthly || 0), 0);
  const currentPlan = state.session?.organization?.planName || "Aucun forfait actif";

  const suiteMarkup = appSections
    .map((section) => {
      const apps = state.apps.filter(
        (app) => app.suiteId === section.id || section.apps.includes(app.slug)
      );
      const selectableApps = apps.filter((app) => app.isPurchasable && app.status === "active");
      const selectableSlugs = selectableApps.map((app) => app.slug);
      const allSelected =
        selectableSlugs.length > 0 && selectableSlugs.every((slug) => state.planSelection.has(slug));

      return `
        <section class="plan-suite plan-suite-${escapeHtml(section.theme)}">
          <header class="plan-suite-head">
            <div>
              <span class="plan-suite-kicker">${escapeHtml(section.shortTitle)}</span>
              <h2>${escapeHtml(section.title)}</h2>
              <p>${escapeHtml(section.description)}</p>
            </div>
            ${
              selectableSlugs.length
                ? `<label class="plan-suite-toggle">
                    <input
                      type="checkbox"
                      data-plan-suite="${escapeHtml(section.id)}"
                      data-plan-suite-apps="${escapeHtml(selectableSlugs.join(","))}"
                      ${allSelected ? "checked" : ""}
                    />
                    <span>Choisir toute la suite</span>
                  </label>`
                : `<span class="badge locked">Applications a venir</span>`
            }
          </header>
          <div class="plan-app-list">
            ${
              apps.length
                ? apps.map((app) => renderPlanAppOption(app)).join("")
                : `<div class="plan-suite-empty">La premiere application Utilitaire sera ajoutee ici.</div>`
            }
          </div>
        </section>
      `;
    })
    .join("");

  shell(
    `
      <section class="plans-head plans-head-builder">
        <div>
          <span class="eyebrow">Forfait sur mesure</span>
          <h1>Composez votre forfait, application par application.</h1>
          <p>Cochez uniquement les outils dont vous avez besoin. Les prix s'additionnent automatiquement.</p>
        </div>
        <div class="current-plan-chip">
          <span>Acces actuel</span>
          <strong>${escapeHtml(currentPlan)}</strong>
        </div>
      </section>
      <section class="plan-builder-layout">
        <div class="plan-builder-catalog">${suiteMarkup}</div>
        <aside class="plan-builder-summary" aria-label="Resume du forfait">
          <span class="eyebrow">Votre forfait</span>
          <h2>Selection personnalisee</h2>
          <div class="plan-summary-count" data-plan-count>
            ${selectedApps.length} application${selectedApps.length > 1 ? "s" : ""}
          </div>
          <div data-plan-selected-list>${renderPlanSelectionList(selectedApps)}</div>
          <div class="plan-summary-total">
            <span>Total mensuel</span>
            <strong data-plan-total>${escapeHtml(formatCad(total))}</strong>
            <small>CAD / mois, avant taxes</small>
          </div>
          <div class="plan-summary-annual">
            <span>Equivalent annuel</span>
            <strong data-plan-annual>${escapeHtml(formatCad(total * 12))}</strong>
          </div>
          ${
            state.session?.authenticated
              ? `<button class="primary plan-summary-action" type="button" data-action="save-custom-plan" ${selectedApps.length ? "" : "disabled"}>Enregistrer ma selection</button>`
              : `<button class="primary plan-summary-action" type="button" data-route="/login?next=%2Fplans">Se connecter pour continuer</button>`
          }
          <button class="secondary" type="button" data-action="reset-custom-plan" ${selectedApps.length ? "" : "disabled"}>Effacer la selection</button>
          <p class="plan-summary-message" data-plan-message></p>
          <p class="plan-summary-note">Le prix final sera controle cote serveur avant le futur paiement Stripe.</p>
        </aside>
      </section>
    `,
    { wide: true }
  );
  updatePlanBuilderUi();
}

function renderPlanAppOption(app) {
  const selectable = Boolean(app.isPurchasable && app.status === "active");
  const selected = selectable && state.planSelection.has(app.slug);
  const included = Boolean(app.access?.allowed);
  const statusLabel = app.status === "coming-soon" ? "Bientot disponible" : included ? "Inclus actuellement" : "Disponible";
  const icon = app.image
    ? `<img src="${escapeHtml(app.image)}" alt="" loading="lazy" />`
    : `<span>${escapeHtml(app.iconText || app.name.slice(0, 2))}</span>`;

  return `
    <label class="plan-app-option${selected ? " selected" : ""}${selectable ? "" : " unavailable"}">
      <input
        type="checkbox"
        data-plan-app="${escapeHtml(app.slug)}"
        ${selected ? "checked" : ""}
        ${selectable ? "" : "disabled"}
      />
      <span class="plan-app-check" aria-hidden="true"></span>
      <span class="plan-app-icon">${icon}</span>
      <span class="plan-app-copy">
        <span class="plan-app-title-row">
          <strong>${escapeHtml(app.name)}</strong>
          <small class="${included ? "is-included" : ""}">${escapeHtml(statusLabel)}</small>
        </span>
        <span>${escapeHtml(app.description)}</span>
      </span>
      <span class="plan-app-price">
        <strong>${escapeHtml(formatCad(app.priceMonthly))}</strong>
        <small>${selectable ? "par mois" : "tarif indicatif"}</small>
      </span>
    </label>
  `;
}

function renderNotIncluded(slug) {
  const app = state.apps.find((item) => item.slug === slug);
  if (!app) {
    shell(`<section class="empty-state"><h1>Application introuvable</h1></section>`);
    return;
  }
  shell(
    renderAppDetailPage(app, {
      blocked: true,
      allowed: false,
      accessReason: "Cette application n'est pas incluse dans le forfait actuel.",
    }),
    { wide: true }
  );
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
