// Execute with:
// pnpm tsx scripts/smoke-test-production.ts
// pnpm tsx scripts/smoke-test-production.ts https://your-deployment.vercel.app

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

type ServiceName = 'supabase' | 'stripe' | 'gemini' | 'upstash' | 'inngest' | 'sentry' | 'posthog';

type ServiceStatus = 'ok' | 'error';

interface ServiceHealth {
  status: ServiceStatus;
  latency_ms?: number;
}

interface HealthPayload {
  status: string;
  services: Record<ServiceName, ServiceHealth>;
}

interface HttpTextResponse {
  status: number;
  body: string;
  latencyMs: number;
}

interface HttpJsonResponse {
  status: number;
  body: unknown;
  latencyMs: number;
}

interface CheckResult {
  label: string;
  passed: boolean;
  display: string;
  error?: string | undefined;
}

const REQUEST_TIMEOUT_MS = 15_000;
const REQUIRED_SERVICES: readonly ServiceName[] = [
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function resolveBaseUrl(): Result<string> {
  const fromArgv = process.argv[2];
  const fromEnv =
    process.env.PRODUCTION_URL ??
    process.env.DEPLOYMENT_URL ??
    process.env.VERCEL_URL ??
    process.env.NEXT_PUBLIC_APP_URL;
  const rawUrl = fromArgv ?? fromEnv;

  if (typeof rawUrl !== 'string' || rawUrl.trim().length === 0) {
    return {
      ok: false,
      error:
        'Missing deployment URL. Set PRODUCTION_URL/DEPLOYMENT_URL/VERCEL_URL/NEXT_PUBLIC_APP_URL or pass it as first argument.',
    };
  }

  const normalized = rawUrl.trim();
  const withProtocol = /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;

  return {
    ok: true,
    value: withProtocol.replace(/\/+$/, ''),
  };
}

async function fetchText(url: string): Promise<Result<HttpTextResponse>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/json',
      },
    });
    const body = await response.text();

    return {
      ok: true,
      value: {
        status: response.status,
        body,
        latencyMs: Date.now() - startedAt,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: `GET ${url} failed: ${getErrorMessage(error)}`,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchJson(url: string): Promise<Result<HttpJsonResponse>> {
  const textResult = await fetchText(url);
  if (!textResult.ok) {
    return textResult;
  }

  try {
    const body = JSON.parse(textResult.value.body) as unknown;
    return {
      ok: true,
      value: {
        status: textResult.value.status,
        body,
        latencyMs: textResult.value.latencyMs,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: `Invalid JSON from ${url}: ${getErrorMessage(error)}`,
    };
  }
}

function parseHealthPayload(payload: unknown): Result<HealthPayload> {
  if (!isRecord(payload)) {
    return { ok: false, error: 'Health payload is not an object.' };
  }

  const status = payload.status;
  const services = payload.services;

  if (typeof status !== 'string') {
    return { ok: false, error: 'Health payload "status" must be a string.' };
  }

  if (!isRecord(services)) {
    return { ok: false, error: 'Health payload "services" must be an object.' };
  }

  const parsedServices: Partial<Record<ServiceName, ServiceHealth>> = {};

  for (const service of REQUIRED_SERVICES) {
    const rawService = services[service];
    if (!isRecord(rawService)) {
      return { ok: false, error: `Service "${service}" is missing or invalid.` };
    }

    const rawStatus = rawService.status;
    const rawLatency = rawService.latency_ms;

    if (rawStatus !== 'ok' && rawStatus !== 'error') {
      return { ok: false, error: `Service "${service}" has invalid status.` };
    }

    if (
      rawLatency !== undefined &&
      (typeof rawLatency !== 'number' || !Number.isFinite(rawLatency))
    ) {
      return { ok: false, error: `Service "${service}" has invalid latency_ms.` };
    }

    parsedServices[service] = {
      status: rawStatus,
      ...(typeof rawLatency === 'number' ? { latency_ms: rawLatency } : {}),
    };
  }

  return {
    ok: true,
    value: {
      status,
      services: parsedServices as Record<ServiceName, ServiceHealth>,
    },
  };
}

function formatReportLine(label: string, value: string): string {
  const content = `║ ${label.padEnd(22)} ${value.padEnd(16)} ║`;
  return content;
}

function printReport(results: readonly CheckResult[]): void {
  const passedCount = results.filter((result) => result.passed).length;
  const total = results.length;

  console.log('╔══════════════════════════════════════════╗');
  console.log('║     METAMEN100 — SMOKE TEST REPORT      ║');
  console.log('╠══════════════════════════════════════════╣');
  for (const result of results) {
    console.log(formatReportLine(result.label, result.display));
  }
  console.log('╠══════════════════════════════════════════╣');
  console.log(formatReportLine('RESULT:', `${passedCount}/${total} PASSED`));
  console.log('╚══════════════════════════════════════════╝');
}

function printFailureDetails(results: readonly CheckResult[]): void {
  const failures = results.filter((result) => !result.passed && typeof result.error === 'string');
  if (failures.length === 0) {
    return;
  }

  console.error('\nFailure details:');
  for (const failure of failures) {
    console.error(`- ${failure.label}: ${failure.error}`);
  }
}

async function runSmokeTests(): Promise<number> {
  const baseUrlResult = resolveBaseUrl();
  if (!baseUrlResult.ok) {
    const results: CheckResult[] = [
      {
        label: 'Homepage (/)',
        passed: false,
        display: '❌ unresolved',
        error: baseUrlResult.error,
      },
      {
        label: 'Health (/api/health)',
        passed: false,
        display: '❌ unresolved',
      },
      {
        label: 'Judgement endpoint',
        passed: false,
        display: '❌ unresolved',
      },
      {
        label: 'Metadata',
        passed: false,
        display: '❌ unresolved',
      },
    ];
    printReport(results);
    printFailureDetails(results);
    return 1;
  }

  const baseUrl = baseUrlResult.value;
  const results: CheckResult[] = [];
  let homepageHtml = '';

  const homepageResult = await fetchText(`${baseUrl}/`);
  if (!homepageResult.ok) {
    results.push({
      label: 'Homepage (/)',
      passed: false,
      display: '❌ request failed',
      error: homepageResult.error,
    });
  } else {
    homepageHtml = homepageResult.value.body;
    const is200 = homepageResult.value.status === 200;
    const hasHtml = /<html/i.test(homepageResult.value.body);
    const hasBrand = /metamen/i.test(homepageResult.value.body);
    const passed = is200 && hasHtml && hasBrand;

    results.push({
      label: 'Homepage (/)',
      passed,
      display: passed
        ? `✅ 200 (${homepageResult.value.latencyMs}ms)`
        : `❌ ${homepageResult.value.status} (${homepageResult.value.latencyMs}ms)`,
      error: passed
        ? undefined
        : `Expected status 200 with <html and METAMEN content. Received status=${homepageResult.value.status}, hasHtml=${hasHtml}, hasBrand=${hasBrand}.`,
    });
  }

  const healthResult = await fetchJson(`${baseUrl}/api/health`);
  if (!healthResult.ok) {
    results.push({
      label: 'Health (/api/health)',
      passed: false,
      display: '❌ request failed',
      error: healthResult.error,
    });
  } else {
    const parsedHealth = parseHealthPayload(healthResult.value.body);
    if (!parsedHealth.ok) {
      results.push({
        label: 'Health (/api/health)',
        passed: false,
        display: '❌ invalid payload',
        error: parsedHealth.error,
      });
    } else {
      const healthyCount = REQUIRED_SERVICES.filter((service) => {
        return parsedHealth.value.services[service].status === 'ok';
      }).length;
      const passed =
        healthResult.value.status === 200 &&
        parsedHealth.value.status === 'ok' &&
        healthyCount === REQUIRED_SERVICES.length;

      results.push({
        label: 'Health (/api/health)',
        passed,
        display: passed
          ? `✅ ${healthyCount}/${REQUIRED_SERVICES.length} services`
          : `❌ ${healthyCount}/${REQUIRED_SERVICES.length} services`,
        error: passed
          ? undefined
          : `Expected HTTP 200, top-level status "ok", and 7/7 services healthy. Received status=${healthResult.value.status}, payloadStatus=${parsedHealth.value.status}.`,
      });
    }
  }

  const judgementResult = await fetchText(`${baseUrl}/api/cron/judgement`);
  if (!judgementResult.ok) {
    results.push({
      label: 'Judgement endpoint',
      passed: false,
      display: '❌ request failed',
      error: judgementResult.error,
    });
  } else {
    const exists = judgementResult.value.status !== 404;
    results.push({
      label: 'Judgement endpoint',
      passed: exists,
      display: exists ? `✅ exists (${judgementResult.value.status})` : `❌ missing (404)`,
      error: exists ? undefined : 'Endpoint returned 404; expected any non-404 status.',
    });
  }

  const titleMatch = homepageHtml.match(/<title[^>]*>(.*?)<\/title>/is);
  const titleText = titleMatch?.[1]?.trim() ?? '';
  const titleValid = /metamen/i.test(titleText);
  const hasOgTitle = /<meta[^>]+property=["']og:title["'][^>]*>/i.test(homepageHtml);
  const metadataPassed = homepageHtml.length > 0 && titleValid && hasOgTitle;

  results.push({
    label: 'Metadata',
    passed: metadataPassed,
    display: metadataPassed ? '✅ valid' : '❌ invalid',
    error: metadataPassed
      ? undefined
      : `Expected <title> with METAMEN and og:title meta tag. title="${titleText}", hasOgTitle=${hasOgTitle}.`,
  });

  printReport(results);
  printFailureDetails(results);

  return results.every((result) => result.passed) ? 0 : 1;
}

runSmokeTests()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    console.error(`Smoke test execution error: ${getErrorMessage(error)}`);
    process.exit(1);
  });
