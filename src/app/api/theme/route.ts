import { NextResponse } from 'next/server';
import { THEME_COOKIE_NAME } from '@/constants/theme';

export async function POST(req: Request) {
  try {
    const { theme } = await req.json();
    if (theme === 'light' || theme === 'dark') {
      const res = NextResponse.json({ success: true, theme });
      res.cookies.set(THEME_COOKIE_NAME, theme, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });
      return res;
    }
    return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to set theme' }, { status: 500 });
  }
}
