export interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  category: string;
  photoUrl: string;
  videoUrl: string;
  liveUrl: string;
  isActive: boolean;
  createdAt: string;
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const res = await fetch('/api/portfolio', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch portfolio projects');
  return res.json();
}

export async function createPortfolioProject(data: Partial<PortfolioProject>): Promise<PortfolioProject> {
  const res = await fetch('/api/portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create portfolio project');
  return res.json();
}

export async function updatePortfolioProject(id: string, data: Partial<PortfolioProject>): Promise<PortfolioProject> {
  const res = await fetch(`/api/portfolio/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update portfolio project');
  return res.json();
}

export async function deletePortfolioProject(id: string): Promise<void> {
  const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete portfolio project');
}
