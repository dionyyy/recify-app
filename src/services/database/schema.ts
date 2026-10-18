export const DATABASE_NAME = "recify.db";

export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY NOT NULL,
  recipe_id TEXT NOT NULL,
  recipe_data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'api'
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_plans (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  plan_data TEXT NOT NULL,
  duration INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS shopping_items (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  quantity TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Other',
  checked INTEGER NOT NULL DEFAULT 0,
  meal_plan_id TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS downloaded_recipes (
  id TEXT PRIMARY KEY NOT NULL,
  recipe_data TEXT NOT NULL,
  image_path TEXT,
  downloaded_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS generated_recipes (
  id TEXT PRIMARY KEY NOT NULL,
  recipe_data TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'recipe_generator',
  created_at INTEGER NOT NULL
);
`;
