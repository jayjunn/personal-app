import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/constants/language';

export async function POST(req: Request) {
  try {
    const { language } = await req.json();
    if (language === 'ENGLISH' || language === 'KOREAN') {
      const res = NextResponse.json({ success: true, language });
      res.cookies.set(COOKIE_NAME, language, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });
      return res;
    }
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  } catch (err) {
    console.error('API language error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
