import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      endpoint: 'judgement-night',
      status: 'stub',
      message: 'Judgement Night cron is pending implementation in a future task.',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
