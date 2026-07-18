INSERT OR IGNORE INTO organizations (id, name)
VALUES ('org_forge2m', 'Forge2M');

INSERT OR IGNORE INTO users (id, name, email, auth_provider)
VALUES ('usr_forge2m_admin', 'Forge2M', 'forgedeuxmontagnes@gmail.com', 'local');

INSERT OR IGNORE INTO user_organizations (user_id, organization_id, role)
VALUES ('usr_forge2m_admin', 'org_forge2m', 'owner');

INSERT OR IGNORE INTO apps (id, name, slug, description, icon, status, url, is_active)
VALUES (
  'app_redkerf',
  'RedKerf',
  'redkerf',
  'Preparation DXF, optimisation, simulation et generation G-code plasma.',
  'RK',
  'active',
  'https://redkerf.forge2m.com',
  1
);

INSERT OR IGNORE INTO apps (id, name, slug, description, icon, status, url, is_active)
VALUES (
  'app_pilotage_cnc',
  'DriveKerf',
  'pilotage-cnc',
  'Pilotage live CNC : jog, manette, G-code, USB et Wi-Fi.',
  'DK',
  'active',
  'https://redkerf.forge2m.com/pilotage-cnc/',
  1
);

INSERT OR IGNORE INTO plans (id, name, slug, description, price_monthly, price_yearly, is_active)
VALUES (
  'plan_redkerf_pro',
  'RedKerf Pro',
  'redkerf-pro',
  'Acces complet a RedKerf pour la production plasma.',
  79,
  790,
  1
);

INSERT OR IGNORE INTO plan_apps (plan_id, app_id)
VALUES ('plan_redkerf_pro', 'app_redkerf');

INSERT OR IGNORE INTO plan_apps (plan_id, app_id)
VALUES ('plan_redkerf_pro', 'app_pilotage_cnc');

INSERT OR IGNORE INTO subscriptions (
  id,
  organization_id,
  plan_id,
  status,
  start_date
)
VALUES (
  'sub_forge2m_redkerf_demo',
  'org_forge2m',
  'plan_redkerf_pro',
  'active',
  CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO promotions (
  id,
  title,
  description,
  app_id,
  plan_id,
  badge_text,
  is_active
)
VALUES (
  'promo_redkerf_launch',
  'Lancement RedKerf',
  'Premiere application disponible dans Forge2M Apps.',
  'app_redkerf',
  'plan_redkerf_pro',
  'Nouveau',
  1
);
