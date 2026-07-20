import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function GET(req: NextRequest) {
  // Forward the ems_token cookie (set on Vercel domain) to the Express API as Bearer token
  const token = req.cookies.get('ems_token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated', code: 'NO_TOKEN' },
      { status: 401 },
    );
  }

  const apiRes = await fetch(`${API}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await apiRes.json() as unknown;
  return NextResponse.json(data, { status: apiRes.status });
}
