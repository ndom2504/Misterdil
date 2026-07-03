-- Misterdil – Schéma Neon PostgreSQL
-- Exécuter dans la console SQL Neon : https://console.neon.tech

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Clients ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid    VARCHAR(128) UNIQUE NOT NULL,
  client_id       VARCHAR(20) UNIQUE NOT NULL,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) DEFAULT '',
  email           VARCHAR(255) UNIQUE NOT NULL,
  phone           VARCHAR(30),
  country         VARCHAR(100) DEFAULT 'Cameroun',
  balance         DECIMAL(10, 2) DEFAULT 0 CHECK (balance >= 0),
  loyalty_points  INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
  phone_verified  BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users (firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_client_id ON users (client_id);

-- ─── Adresses de livraison ─────────────────────────────────
CREATE TABLE IF NOT EXISTS delivery_addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  label       VARCHAR(100),
  country     VARCHAR(100) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  address     TEXT NOT NULL,
  phone       VARCHAR(30),
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_addresses_user ON delivery_addresses (user_id);

-- ─── Colis ─────────────────────────────────────────────────
CREATE TYPE package_status AS ENUM (
  'declared',
  'received',
  'preparing',
  'shipped',
  'in_country',
  'out_for_delivery',
  'delivered'
);

CREATE TYPE delivery_option AS ENUM ('pickup_point', 'home');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');

CREATE TABLE IF NOT EXISTS packages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  tracking_number   VARCHAR(100) NOT NULL,
  store_name        VARCHAR(200) NOT NULL,
  description       TEXT,
  declared_value    DECIMAL(10, 2) DEFAULT 0,
  estimated_weight  DECIMAL(8, 3),
  actual_weight     DECIMAL(8, 3),
  dimensions        VARCHAR(50),
  condition         VARCHAR(50),
  status            package_status DEFAULT 'declared',
  delivery_option   delivery_option,
  delivery_address  JSONB,
  payment_status    payment_status DEFAULT 'pending',
  received_at       TIMESTAMPTZ,
  declared_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_user ON packages (user_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages (status);
CREATE INDEX IF NOT EXISTS idx_packages_tracking ON packages (tracking_number);

-- ─── Photos de colis ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS package_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  UUID NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  type        VARCHAR(20) NOT NULL CHECK (type IN ('box', 'label', 'content', 'invoice')),
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_package_photos_package ON package_photos (package_id);

-- ─── Frais d'expédition ────────────────────────────────────
CREATE TABLE IF NOT EXISTS shipping_fees (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  UUID UNIQUE NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  transport   DECIMAL(10, 2) DEFAULT 0,
  storage     DECIMAL(10, 2) DEFAULT 0,
  insurance   DECIMAL(10, 2) DEFAULT 0,
  taxes       DECIMAL(10, 2) DEFAULT 0,
  total       DECIMAL(10, 2) DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Paiements ─────────────────────────────────────────────
CREATE TYPE payment_method AS ENUM (
  'card', 'apple_pay', 'google_pay', 'interac', 'paypal', 'mobile_money'
);

CREATE TABLE IF NOT EXISTS payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  package_id  UUID NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  amount      DECIMAL(10, 2) NOT NULL,
  method      payment_method NOT NULL,
  status      payment_status DEFAULT 'pending',
  external_id VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_package ON payments (package_id);

-- ─── Suivi / tracking ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS tracking_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  UUID NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  status      package_status NOT NULL,
  location    VARCHAR(200),
  latitude    DECIMAL(10, 7),
  longitude   DECIMAL(10, 7),
  note        TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_package ON tracking_events (package_id);
CREATE INDEX IF NOT EXISTS idx_tracking_occurred ON tracking_events (occurred_at DESC);

-- ─── Notifications ─────────────────────────────────────────
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'payment');

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  type        notification_type DEFAULT 'info',
  read        BOOLEAN DEFAULT FALSE,
  package_id  UUID REFERENCES packages (id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id, read) WHERE read = FALSE;

-- ─── Trigger updated_at ────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
