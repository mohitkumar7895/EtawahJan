export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function emailOk(email: unknown): email is string {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseRegister(body: unknown): ValidationResult<{
  name: string;
  email: string;
  password: string;
}> {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid request body' };
  }
  const b = body as Record<string, unknown>;
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  const password = typeof b.password === 'string' ? b.password : '';

  if (name.length < 2) return { success: false, error: 'Name is required' };
  if (!emailOk(email)) return { success: false, error: 'Valid email required' };
  if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

  return { success: true, data: { name, email, password } };
}

export function parseLogin(body: unknown): ValidationResult<{ email: string; password: string }> {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid credentials' };
  }
  const b = body as Record<string, unknown>;
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  const password = typeof b.password === 'string' ? b.password : '';

  if (!emailOk(email) || !password) {
    return { success: false, error: 'Invalid credentials' };
  }

  return { success: true, data: { email, password } };
}

export function parseAiSummary(body: unknown): ValidationResult<{
  jobTitle?: string;
  experience?: string;
  skills?: string[];
}> {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid input' };
  }
  const b = body as Record<string, unknown>;
  return {
    success: true,
    data: {
      jobTitle: typeof b.jobTitle === 'string' ? b.jobTitle : undefined,
      experience: typeof b.experience === 'string' ? b.experience : undefined,
      skills: Array.isArray(b.skills)
        ? b.skills.filter((s): s is string => typeof s === 'string')
        : undefined,
    },
  };
}

export function parseAiSkills(body: unknown): ValidationResult<{ jobTitle: string; summary?: string }> {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid input' };
  }
  const b = body as Record<string, unknown>;
  const jobTitle = typeof b.jobTitle === 'string' ? b.jobTitle.trim() : '';
  if (!jobTitle) return { success: false, error: 'Job title is required' };

  return {
    success: true,
    data: {
      jobTitle,
      summary: typeof b.summary === 'string' ? b.summary : undefined,
    },
  };
}

export function parseAiAts(body: unknown): ValidationResult<{
  resumeText: string;
  jobDescription?: string;
}> {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Invalid input' };
  }
  const b = body as Record<string, unknown>;
  const resumeText = typeof b.resumeText === 'string' ? b.resumeText : '';
  if (resumeText.length < 20) return { success: false, error: 'Resume text is too short' };

  return {
    success: true,
    data: {
      resumeText,
      jobDescription: typeof b.jobDescription === 'string' ? b.jobDescription : undefined,
    },
  };
}
