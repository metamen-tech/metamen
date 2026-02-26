import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, string> = {};

  checks['app'] = 'ok';
  checks['timestamp'] = new Date().toISOString();

  return NextResponse.json({
    status: 'ok',
    healthy: true,
    checks,
  });
}
