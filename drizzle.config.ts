import type { Config } from 'drizzle-kit';

export default {
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/db/models/index.ts',
  out: './src/db/migrations',
} satisfies Config;
