import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.log('No DATABASE_URL found in environment variables. Skipping migration sync check.');
  process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Starting database migration sync check...');
  const pool = new Pool({
    connectionString: DATABASE_URL,
    connectionTimeoutMillis: 5000,
  });

  try {
    // Check if the users_sessions table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users_sessions'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Table "users_sessions" does not exist. Skipping migration seeding.');
      await pool.end();
      return;
    }

    console.log('Table "users_sessions" exists. Database is already populated. Seeding migrations...');

    // Create payload_migrations table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "payload_migrations" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar,
        "batch" numeric,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );
    `);

    // Read migrations from src/migrations directory
    const migrationsDir = path.resolve(__dirname, 'src/migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      console.warn(`Migrations directory not found at: ${migrationsDir}`);
      await pool.end();
      return;
    }

    const files = fs.readdirSync(migrationsDir);
    const migrationsToSync = files
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => file.replace('.ts', ''))
      .sort();

    if (migrationsToSync.length === 0) {
      console.log('No migration files found to sync.');
      await pool.end();
      return;
    }

    console.log(`Checking status of ${migrationsToSync.length} migrations...`);

    // Get currently registered migrations
    const existingResult = await pool.query('SELECT name FROM "payload_migrations";');
    const existing = new Set(existingResult.rows.map(row => row.name));

    let count = 0;
    for (const name of migrationsToSync) {
      if (!existing.has(name)) {
        console.log(`Marking migration "${name}" as ran (batch 1)...`);
        await pool.query(
          'INSERT INTO "payload_migrations" (name, batch) VALUES ($1, $2);',
          [name, 1]
        );
        count++;
      }
    }

    console.log(`Database migration sync complete. Synced ${count} migrations.`);
  } catch (error) {
    console.error('Error during database migration sync check:', error);
  } finally {
    await pool.end();
  }
}

main();
