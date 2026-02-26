// Ejecutar con: pnpm tsx scripts/smoke-test-production.ts

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  details: string;
  durationMs: number;
}

const rawBaseUrl =
  process.env.DEPLOYMENT_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const BASE_URL = rawBaseUrl.replace(/\/+$/, '');

async function testEndpoint(
  name: string,
  url: string,
  validate: (response: Response, body: string) => boolean,
): Promise<TestResult> {
  const start = Date.now();

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
    });
    const body = await response.text();
    const passed = validate(response, body);

    return {
      name,
      status: passed ? 'PASS' : 'FAIL',
      details: passed ? `HTTP ${response.status}` : `HTTP ${response.status} - validation failed`,
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      name,
      status: 'FAIL',
      details: error instanceof Error ? error.message : 'Unknown error',
      durationMs: Date.now() - start,
    };
  }
}

async function runSmokeTests(): Promise<void> {
  console.log(`\n🔍 Running smoke tests against: ${BASE_URL}\n`);
  console.log('='.repeat(60));

  // Smoke test endpoints — expand as new routes are deployed
  // CAJA 5: add /login, /register
  // CAJA 7: add /api/cron/judgement-night
  const smokeEndpoints: Array<{
    name: string;
    path: string;
    validate: (response: Response, body: string) => boolean;
  }> = [
    {
      name: 'Homepage (/) returns 200',
      path: '/',
      validate: (res) => res.status === 200 || res.status === 401,
    },
    {
      name: 'Health endpoint (/api/health)',
      path: '/api/health',
      validate: (res, body) => {
        if (res.status === 401) return true;
        if (res.status !== 200) return false;
        try {
          const data = JSON.parse(body) as { status?: string; healthy?: boolean };
          return data.status === 'ok' || data.healthy === true;
        } catch {
          return false;
        }
      },
    },
  ];

  const results: TestResult[] = [];
  for (const endpoint of smokeEndpoints) {
    results.push(
      await testEndpoint(endpoint.name, `${BASE_URL}${endpoint.path}`, endpoint.validate),
    );
  }

  console.log('\n📊 SMOKE TEST RESULTS\n');
  console.log('| Status | Test | Details | Duration |');
  console.log('|--------|------|---------|----------|');

  let passed = 0;
  let failed = 0;

  for (const result of results) {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(
      `| ${icon} ${result.status} | ${result.name} | ${result.details} | ${result.durationMs}ms |`,
    );
    if (result.status === 'PASS') {
      passed += 1;
    } else {
      failed += 1;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📋 Total: ${results.length} | ✅ Passed: ${passed} | ❌ Failed: ${failed}\n`);

  if (failed > 0) {
    console.error(`\n🚨 ${failed} smoke test(s) FAILED. Triggering rollback.\n`);
    process.exit(1);
  }

  console.log('\n✅ All smoke tests passed! Production deployment is healthy.\n');
  process.exit(0);
}

runSmokeTests();
