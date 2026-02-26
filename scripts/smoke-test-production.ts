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

  const results: TestResult[] = [];

  const homeResult = await testEndpoint(
    'Homepage (/) returns 200',
    `${BASE_URL}/`,
    (res) => res.status === 200,
  );
  results.push(homeResult);

  const healthResult = await testEndpoint(
    'Health endpoint (/api/health)',
    `${BASE_URL}/api/health`,
    (res, body) => {
      if (res.status !== 200) return false;
      try {
        const data = JSON.parse(body) as { status?: string; healthy?: boolean };
        return data.status === 'ok' || data.healthy === true;
      } catch {
        return false;
      }
    },
  );
  results.push(healthResult);

  const cronResult = await testEndpoint(
    'Cron endpoint (/api/cron/judgement-night)',
    `${BASE_URL}/api/cron/judgement-night`,
    (res) => res.status !== 404,
  );
  results.push(cronResult);

  const loginResult = await testEndpoint(
    'Login page (/login)',
    `${BASE_URL}/login`,
    (res) => res.status === 200,
  );
  results.push(loginResult);

  let inferredAssetPath = '';
  try {
    const htmlResponse = await fetch(`${BASE_URL}/`, {
      signal: AbortSignal.timeout(10_000),
    });
    const html = await htmlResponse.text();
    const match = html.match(/\/_next\/static\/[^"']+\.js/);
    inferredAssetPath = match?.[0] ?? '';
  } catch {
    inferredAssetPath = '';
  }

  const staticAssetResult = await testEndpoint(
    'Static assets available',
    inferredAssetPath ? `${BASE_URL}${inferredAssetPath}` : `${BASE_URL}/_next/static/`,
    (res) => res.status !== 404,
  );
  results.push(staticAssetResult);

  const headersResult = await testEndpoint('Security headers present', `${BASE_URL}/`, (res) => {
    const hasXFrame = res.headers.has('x-frame-options');
    const hasContentType = res.headers.has('x-content-type-options');
    return hasXFrame || hasContentType;
  });
  results.push(headersResult);

  const responseTimeResult = await testEndpoint(
    'Response time < 5s',
    `${BASE_URL}/`,
    (res) => res.status === 200,
  );
  if (responseTimeResult.durationMs > 5000) {
    responseTimeResult.status = 'FAIL';
    responseTimeResult.details = `Response took ${responseTimeResult.durationMs}ms (> 5000ms)`;
  }
  results.push(responseTimeResult);

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
