export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { ensureJobPortalCron } = await import('@/lib/jobPortalCron');
    ensureJobPortalCron();
  }
}
