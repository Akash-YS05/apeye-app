import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ');

  try {
    const body = await request.json();
    
    console.log('Saving history to:', `${BACKEND_URL}/history`);
    console.log('Cookie header present:', !!cookieHeader);
    
    const response = await fetch(`${BACKEND_URL}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      console.error('Backend response:', text);
      return new NextResponse(text, { status: response.status });
    }
  } catch (error) {
    console.error('History save error:', error);
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}
