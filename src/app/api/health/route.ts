import { NextResponse } from 'next/server';

export async function GET() {
  const payload = {
    status: 'ok',
    healthy: true,
    checks: {
      app: 'ok',
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
