import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = body?.path;

    if (path) {
      revalidatePath(path);
    } else {
      // Revalidate all public ISR routes
      revalidatePath('/');
      revalidatePath('/works');
      revalidatePath('/experience');
      revalidatePath('/cv');
      revalidatePath('/contact');
    }

    return NextResponse.json({
      revalidated: true,
      path: path || 'all',
      timestamp: Date.now(),
    });
  } catch (err: any) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ message: err.message || 'Revalidation failed' }, { status: 500 });
  }
}
