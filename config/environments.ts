import 'dotenv/config';

export type EnvName = 'dev' | 'staging' | 'prod';

interface EnvProfile {
  /** Retries in CI. Locally we always run with 0 so flakiness is visible. */
  ciRetries: number;
  /** Tests tagged @destructive create or change data. Never run them against prod. */
  allowDestructive: boolean;
}

// Behaviour per environment. URLs and credentials come from .env, not from here.
const profiles: Record<EnvName, EnvProfile> = {
  dev: { ciRetries: 1, allowDestructive: true },
  staging: { ciRetries: 2, allowDestructive: true },
  prod: { ciRetries: 2, allowDestructive: false },
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

function envName(): EnvName {
  const name = process.env.TEST_ENV ?? 'dev';
  if (!(name in profiles)) {
    throw new Error(`TEST_ENV must be one of ${Object.keys(profiles).join(', ')}; got "${name}".`);
  }
  return name as EnvName;
}

const name = envName();
const baseURL = required('BASE_URL');

export const env = {
  name,
  ...profiles[name],
  baseURL,
  apiBaseURL: process.env.API_BASE_URL || baseURL,
  browsers: (process.env.BROWSERS ?? 'chromium')
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean),
};

/** Credentials are read lazily so API-only runs don't need them. */
export function testUser(): { username: string; password: string } {
  return { username: required('TEST_USER'), password: required('TEST_PASSWORD') };
}

/** Where the setup project saves the logged-in session. Gitignored. */
export const AUTH_FILE = '.auth/user.json';
