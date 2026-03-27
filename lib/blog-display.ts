export function formatBlogDate(
  publishedAt?: string | null,
  createdAt?: string | null
): string {
  const raw = publishedAt || createdAt
  if (!raw) return '—'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function blogImageUnoptimized(src: string): boolean {
  return /^https?:\/\//i.test(src) || src.startsWith('data:')
}
