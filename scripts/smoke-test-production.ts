// Execute with:
// pnpm tsx scripts/smoke-test-production.ts
// pnpm tsx scripts/smoke-test-production.ts https://your-deployment.vercel.app

interface SmokeTestResult {
  passed: boolean;
  checks: {
    homepage: {
      status: number;
      hasMetadata: boolean;
      hasRuntimeErrors: boolean;
    };
  };
  timestamp: string;
  details: string[];
}

const REQUEST_TIMEOUT_MS = 30_000;
const RUNTIME_ERROR_MARKERS: readonly string[] = [
  'application error: a server-side exception has occurred',
  'application error: a client-side exception has occurred',
  'unhandled runtime error',
  'internal server error',
];

function resolveBaseUrl(): string {
  const fromArgv = process.argv[2];
  const fromEnv =
    process.env.PRODUCTION_URL ?? process.env.DEPLOYMENT_URL ?? process.env.VERCEL_URL;
  const rawUrl = fromArgv ?? fromEnv;

  if (typeof rawUrl !== 'string' || rawUrl.trim().length === 0) {
    throw new Error(
      'Missing deployment URL. Set PRODUCTION_URL/DEPLOYMENT_URL/VERCEL_URL or pass the URL as first argument.',
    );
  }

  const normalized = rawUrl.trim();
  const withProtocol = /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;
  return withProtocol.replace(/\/+$/, '');
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function hasExpectedMetadata(html: string): boolean {
  const hasTitle = /<title[^>]*>\s*[^<]*metamen100[^<]*<\/title>/i.test(html);
  const hasDescriptionMeta =
    /<meta[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html);
  const hasOgTitle = /<meta[^>]*property=["']og:title["'][^>]*content=["'][^"']+["'][^>]*>/i.test(
    html,
  );
  const hasOgDescription =
    /<meta[^>]*property=["']og:description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html);
  const hasOgImage = /<meta[^>]*property=["']og:image["'][^>]*content=["'][^"']+["'][^>]*>/i.test(
    html,
  );

  return hasTitle && hasDescriptionMeta && hasOgTitle && hasOgDescription && hasOgImage;
}

function hasRuntimeErrorMarkers(html: string): boolean {
  const loweredHtml = html.toLowerCase();
  return RUNTIME_ERROR_MARKERS.some((marker) => loweredHtml.includes(marker));
}

async function runSmokeTests(): Promise<void> {
  const baseUrl = resolveBaseUrl();
  const homepageUrl = `${baseUrl}/`;
  console.log(`Running production smoke test against: ${baseUrl}`);

  const response = await fetchWithTimeout(homepageUrl);
  const html = await response.text();

  const metadataPresent = hasExpectedMetadata(html);
  const runtimeErrorsPresent = hasRuntimeErrorMarkers(html);

  // TODO(02.5/02.6): Expand smoke checks when /api/health and external integrations exist.
  const result: SmokeTestResult = {
    passed: response.status === 200 && metadataPresent && !runtimeErrorsPresent,
    checks: {
      homepage: {
        status: response.status,
        hasMetadata: metadataPresent,
        hasRuntimeErrors: runtimeErrorsPresent,
      },
    },
    timestamp: new Date().toISOString(),
    details: [],
  };

  if (response.status !== 200) {
    result.details.push(`Expected homepage HTTP 200, received ${response.status}.`);
  }

  if (!metadataPresent) {
    result.details.push('Homepage is missing required metadata tags (title, description, og:*).');
  }

  if (runtimeErrorsPresent) {
    result.details.push('Homepage response contains runtime error markers.');
  }

  console.log(JSON.stringify(result, null, 2));

  if (!result.passed) {
    process.exit(1);
  }

  process.exit(0);
}

runSmokeTests().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Smoke test failed to execute: ${message}`);
  process.exit(1);
});
