import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function proxyRequest(request: NextRequest, path: string) {
  const url = `${BACKEND_URL}/${path}`;
  
  // Get all cookies and forward them
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ');

  // Build headers, forwarding relevant ones
  const headers: HeadersInit = {};
  
  const contentType = request.headers.get('Content-Type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  // Forward Authorization header if present
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  // Add body for non-GET requests
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const reqContentType = request.headers.get('Content-Type') || '';
    if (reqContentType.includes('application/json')) {
      try {
        fetchOptions.body = JSON.stringify(await request.json());
      } catch {
        // Empty body or invalid JSON
      }
    } else if (reqContentType.includes('form-data')) {
      fetchOptions.body = await request.formData();
    } else if (reqContentType) {
      fetchOptions.body = await request.text();
    }
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    // Get response data
    const resContentType = response.headers.get('Content-Type') || '';
    
    if (resContentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const data = await response.text();
      return new NextResponse(data, { 
        status: response.status,
        headers: {
          'Content-Type': resContentType,
        }
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join('/'));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join('/'));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join('/'));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join('/'));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join('/'));
}
