import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

type ServiceName = 'supabase' | 'stripe' | 'gemini' | 'upstash' | 'inngest' | 'sentry' | 'posthog';

type ServiceStatus = 'ok' | 'error';

interface ServiceHealth {
  status: ServiceStatus;
  latency_ms?: number;
  error?: string;
}

type ServiceMap = Record<ServiceName, ServiceHealth>;

const CHECK_TIMEOUT_MS = 5_000;
const GEMINI_MODEL = 'gemini-2.5-flash';
const SERVICE_NAMES: readonly ServiceName[] = [
  'supabase',
  'stripe',
  'gemini',
  'upstash',
  'inngest',
  'sentry',
  'posthog',
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${name} is not configured`);
  }

  return value.trim();
}

async function withTimeout(operation: Promise<void>, service: ServiceName): Promise<void> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${service} health check timed out after ${CHECK_TIMEOUT_MS}ms`));
    }, CHECK_TIMEOUT_MS);
  });

  try {
    await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

async function runCheck(service: ServiceName, check: () => Promise<void>): Promise<ServiceHealth> {
  const startedAt = Date.now();

  try {
    await withTimeout(check(), service);
    return {
      status: 'ok',
      latency_ms: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      status: 'error',
      latency_ms: Date.now() - startedAt,
      error: getErrorMessage(error),
    };
  }
}

async function checkSupabase(): Promise<void> {
  const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseServiceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
  if (error !== null) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }
}

async function checkStripe(): Promise<void> {
  const stripeSecretKey = requireEnv('STRIPE_SECRET_KEY');
  const stripe = new Stripe(stripeSecretKey);
  await stripe.balance.retrieve();
}

async function checkGemini(): Promise<void> {
  const geminiApiKey = requireEnv('GEMINI_API_KEY');
  const geminiClient = new GoogleGenerativeAI(geminiApiKey);
  const model = geminiClient.getGenerativeModel({ model: GEMINI_MODEL });
  await model.countTokens('health check');
}

async function checkUpstash(): Promise<void> {
  const upstashUrl = requireEnv('UPSTASH_REDIS_REST_URL');
  const upstashToken = requireEnv('UPSTASH_REDIS_REST_TOKEN');
  const redis = new Redis({
    url: upstashUrl,
    token: upstashToken,
  });

  const pingResponse = await redis.ping();
  if (typeof pingResponse !== 'string' || pingResponse.toUpperCase() !== 'PONG') {
    throw new Error(`Unexpected Upstash ping response: ${String(pingResponse)}`);
  }
}

async function checkInngest(): Promise<void> {
  const inngestEventKey = requireEnv('INNGEST_EVENT_KEY');
  if (inngestEventKey.length < 10) {
    throw new Error('INNGEST_EVENT_KEY has an invalid format');
  }
}

async function checkSentry(): Promise<void> {
  const sentryDsn = requireEnv('SENTRY_DSN');
  const parsedDsn = new URL(sentryDsn);

  if (parsedDsn.protocol !== 'https:' && parsedDsn.protocol !== 'http:') {
    throw new Error('SENTRY_DSN must use http or https protocol');
  }
}

async function checkPosthog(): Promise<void> {
  const posthogKey = requireEnv('NEXT_PUBLIC_POSTHOG_KEY');
  if (posthogKey.length < 8) {
    throw new Error('NEXT_PUBLIC_POSTHOG_KEY has an invalid format');
  }
}

export async function GET() {
  const services: ServiceMap = {
    supabase: await runCheck('supabase', checkSupabase),
    stripe: await runCheck('stripe', checkStripe),
    gemini: await runCheck('gemini', checkGemini),
    upstash: await runCheck('upstash', checkUpstash),
    inngest: await runCheck('inngest', checkInngest),
    sentry: await runCheck('sentry', checkSentry),
    posthog: await runCheck('posthog', checkPosthog),
  };

  const healthyCount = SERVICE_NAMES.reduce((count, serviceName) => {
    return services[serviceName].status === 'ok' ? count + 1 : count;
  }, 0);

  const payload = {
    status: healthyCount === SERVICE_NAMES.length ? 'ok' : 'error',
    services,
    summary: {
      healthy: healthyCount,
      total: SERVICE_NAMES.length,
      checked_at: new Date().toISOString(),
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
