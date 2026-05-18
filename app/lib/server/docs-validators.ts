import 'server-only';

import { Doc } from '@/app/lib/docs-types';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

export function validateCreateDoc(input: any): { ok: true; value: Omit<Doc, 'createdAt' | 'updatedAt'> } | { ok: false; message: string } {
  const requiredStrings = ['id', 'slug', 'title', 'description', 'content', 'category', 'status'];
  for (const key of requiredStrings) {
    if (typeof input?.[key] !== 'string' || !input[key].trim()) {
      return { ok: false, message: `Invalid ${key}` };
    }
  }
  if (!isStringArray(input.keywords)) {
    return { ok: false, message: 'Invalid keywords' };
  }
  if (typeof input.order !== 'number') {
    return { ok: false, message: 'Invalid order' };
  }
  if (input.status !== 'draft' && input.status !== 'published') {
    return { ok: false, message: 'Invalid status' };
  }

  return { ok: true, value: input };
}

export function validateUpdateDoc(input: any): { ok: true; value: Partial<Doc> } | { ok: false; message: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, message: 'Invalid payload' };
  }
  if (input.keywords !== undefined && !isStringArray(input.keywords)) {
    return { ok: false, message: 'Invalid keywords' };
  }
  if (input.order !== undefined && typeof input.order !== 'number') {
    return { ok: false, message: 'Invalid order' };
  }
  if (input.status !== undefined && input.status !== 'draft' && input.status !== 'published') {
    return { ok: false, message: 'Invalid status' };
  }
  return { ok: true, value: input };
}
