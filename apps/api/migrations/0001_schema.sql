-- Migration number: 0001 	 gomisearch initial schema
CREATE TABLE municipalities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  bulky_waste_apply_url TEXT,
  source_url TEXT NOT NULL
);

CREATE TABLE waste_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  municipality_id INTEGER NOT NULL REFERENCES municipalities(id),
  name TEXT NOT NULL,
  name_normalized TEXT NOT NULL,
  category TEXT NOT NULL,
  fee INTEGER,
  instructions TEXT NOT NULL,
  apply_url TEXT
);

CREATE UNIQUE INDEX idx_waste_items_municipality_name
  ON waste_items(municipality_id, name);
CREATE INDEX idx_waste_items_name_normalized
  ON waste_items(name_normalized);

CREATE TABLE waste_item_aliases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  waste_item_id INTEGER NOT NULL REFERENCES waste_items(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  alias_normalized TEXT NOT NULL
);

CREATE INDEX idx_waste_item_aliases_alias
  ON waste_item_aliases(alias);
CREATE INDEX idx_waste_item_aliases_alias_normalized
  ON waste_item_aliases(alias_normalized);

CREATE TABLE municipality_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  municipality_name TEXT NOT NULL,
  created_at TEXT NOT NULL
);
