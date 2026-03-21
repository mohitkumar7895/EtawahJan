import { NextResponse } from 'next/server';

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function jsonDoc(doc: { toObject?: () => Record<string, unknown>; _id?: unknown }) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    ...o,
    id: String((o as { _id?: unknown })._id ?? ''),
  };
}

export function handleApiError(error: unknown, fallback: string) {
  console.error(fallback, error);
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 500 });
}
