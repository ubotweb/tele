PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'tenant')) NOT NULL DEFAULT 'tenant',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenants (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    store_name TEXT NOT NULL,
    subscription_status TEXT CHECK(subscription_status IN ('active', 'expired', 'suspended')) NOT NULL DEFAULT 'expired',
    subscription_end_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE telegram_bots (
    id TEXT PRIMARY KEY,
    tenant_id TEXT UNIQUE NOT NULL,
    bot_token TEXT NOT NULL,
    bot_username TEXT,
    webhook_url TEXT,
    is_active INTEGER DEFAULT 0,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE cloudinary_configs (
    id TEXT PRIMARY KEY,
    tenant_id TEXT UNIQUE NOT NULL,
    cloud_name TEXT NOT NULL,
    api_key TEXT NOT NULL,
    api_secret TEXT NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE products (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    type TEXT CHECK(type IN ('regular', 'unique', 'h2h')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    h2h_api_url TEXT,
    h2h_api_key TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE digital_assets (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    file_url TEXT,
    license_code TEXT UNIQUE,
    is_used INTEGER DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    buyer_telegram_id TEXT NOT NULL,
    amount REAL NOT NULL,
    qris_payload TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'paid', 'failed', 'cancelled')) NOT NULL DEFAULT 'pending',
    digital_asset_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (digital_asset_id) REFERENCES digital_assets(id)
);
