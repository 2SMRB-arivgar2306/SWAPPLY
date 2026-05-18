import { NextResponse } from 'next/server';
import { verifySMTP } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await verifySMTP();
    if (result.ok) {
      return NextResponse.json({ ok: true, info: result.info }, { status: 200 });
    }
    return NextResponse.json({ ok: false, error: String(result.error) }, { status: 500 });
  } catch (error) {
    console.error('SMTP debug error:', error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
