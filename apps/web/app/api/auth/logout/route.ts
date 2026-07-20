import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function POST(req: NextRequest) {
  // Tell the Express API to clear its own cookie too
  await fetch(`${API}/api/auth/logout`, {
    method: 'POST',
    headers: { cookie: req.headers.get('cookie') ?? '' },
  }).catch(() => undefined);

  const res = NextResponse.json({ success: true, message: 'Logged out' });
  // Clear the cookie on the Vercel domain
  res.cookies.set('ems_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 0,
  });
  return res;
}
