import { config } from 'dotenv';

import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

import { envSchema } from '@/infra/env/env';

config({ path: '.env', override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

const schemaId = randomUUID();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  env.DATABASE_URL = databaseURL;

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
