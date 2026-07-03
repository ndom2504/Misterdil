import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[db] DATABASE_URL non défini — API en mode dégradé');
}

export const sql = connectionString ? neon(connectionString) : null;

export function requireDb() {
  if (!sql) {
    throw new Error('DATABASE_URL manquant. Configurez Neon PostgreSQL.');
  }
  return sql;
}
