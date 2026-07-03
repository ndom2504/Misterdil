import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Pool } from '@neondatabase/serverless';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
dotenv.config({ path: join(root, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL manquant dans .env');
  process.exit(1);
}

const schemaPath = join(root, 'database/schema.sql');
const schema = readFileSync(schemaPath, 'utf8');

async function migrate() {
  console.log('Application du schéma Neon...');
  const pool = new Pool({ connectionString: DATABASE_URL });
  await pool.query(schema);
  await pool.end();
  console.log('Migration terminée.');
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
