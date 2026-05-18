import 'server-only';

import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

type AuthPayload = {
  sub?: string;
  role?: string;
  email?: string;
};

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice(7).trim();
}

export function requireAdmin(request: NextRequest): { ok: true; payload: AuthPayload } | { ok: false; status: number; message: string } {
  const token = getBearerToken(request);
  const secret = process.env.JWT_SECRET;

  if (!token) {
    return { ok: false, status: 401, message: 'Missing bearer token' };
  }
  if (!secret) {
    return { ok: false, status: 500, message: 'Server auth is not configured' };
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthPayload;
    if (decoded.role !== 'super_admin' && decoded.role !== 'admin') {
      return { ok: false, status: 403, message: 'Insufficient role' };
    }
    return { ok: true, payload: decoded };
  } catch {
    return { ok: false, status: 401, message: 'Invalid or expired token' };
  }
}
