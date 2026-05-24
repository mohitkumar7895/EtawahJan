export async function generateSummary(input: {
  jobTitle?: string;
  experience?: string;
  skills?: string[];
}): Promise<string> {
  const title = input.jobTitle || 'Professional';
  const skills = (input.skills || []).slice(0, 8).join(', ');
  const exp = input.experience?.slice(0, 200) || '';

  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'Write a concise professional resume summary in 3-4 sentences. ATS-friendly, no buzzword stuffing.',
            },
            {
              role: 'user',
              content: `Job title: ${title}\nSkills: ${skills}\nExperience notes: ${exp}`,
            },
          ],
          max_tokens: 220,
        }),
      });
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch {
      /* fallback below */
    }
  }

  return `Results-driven ${title} with proven ability to deliver high-quality outcomes. Skilled in ${skills || 'communication, problem solving, and teamwork'}. ${exp ? `Background includes: ${exp}.` : ''} Seeking opportunities to contribute expertise and grow with a forward-thinking organization.`;
}

export function suggestSkills(jobTitle: string, summary?: string): string[] {
  const base = [
    'Communication',
    'Problem Solving',
    'Team Collaboration',
    'Time Management',
    'Microsoft Office',
  ];
  const lower = `${jobTitle} ${summary || ''}`.toLowerCase();
  if (lower.includes('developer') || lower.includes('software')) {
    return [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'MongoDB',
      'Git',
      'REST APIs',
      'Problem Solving',
      'Agile',
    ];
  }
  if (lower.includes('design')) {
    return ['Figma', 'UI/UX', 'Adobe Photoshop', 'Typography', 'Wireframing', ...base];
  }
  if (lower.includes('marketing')) {
    return ['SEO', 'Social Media', 'Content Writing', 'Google Analytics', 'Campaign Management', ...base];
  }
  return base;
}

export function analyzeAts(resumeText: string, jobDescription?: string): {
  score: number;
  suggestions: string[];
  keywords: string[];
} {
  const words = resumeText.toLowerCase().split(/\W+/).filter(Boolean);
  const unique = new Set(words);
  let score = 55;
  const suggestions: string[] = [];

  if (resumeText.length < 400) {
    suggestions.push('Add more detail to experience and summary sections.');
  } else score += 10;

  if (!resumeText.match(/@/)) suggestions.push('Include a professional email address.');
  else score += 5;

  if (!resumeText.match(/\d{10}/)) suggestions.push('Add a contact phone number.');
  else score += 5;

  if (words.filter((w) => w.length > 3).length < 80) {
    suggestions.push('Expand bullet points with measurable achievements.');
  } else score += 10;

  const keywords: string[] = [];
  if (jobDescription) {
    const jdWords = jobDescription
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 4);
    const freq = new Map<string, number>();
    for (const w of jdWords) freq.set(w, (freq.get(w) || 0) + 1);
    const top = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([w]) => w);
    for (const kw of top) {
      if (unique.has(kw)) keywords.push(kw);
      else suggestions.push(`Consider adding keyword: "${kw}"`);
    }
    score += Math.min(20, keywords.length * 2);
  }

  if (suggestions.length === 0) suggestions.push('Resume structure looks good. Fine-tune action verbs per role.');

  return { score: Math.min(98, score), suggestions, keywords };
}
