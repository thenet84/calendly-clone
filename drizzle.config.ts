import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
})