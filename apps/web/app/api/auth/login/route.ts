import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function POST(req: NextRequest) {
  const body = await req.json() as unknown;

  const apiRes = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json() as { success: boolean; message?: string; data?: { token?: string } };

  if (!apiRes.ok || !data.success) {
    return NextResponse.json(data, { status: apiRes.status });
  }

  const token = data.data?.token;
  const res = NextResponse.json(data, { status: 200 });

  if (token) {
    // Set the cookie on the Vercel (frontend) domain so Next.js middleware can read it
    res.cookies.set('ems_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return res;
}
