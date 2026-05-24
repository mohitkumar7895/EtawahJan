import type { ResumeThemeSettings } from './types';
import { getTemplateById } from './templates';

const PRESETS: Record<string, Partial<ResumeThemeSettings>> = {
  modern: { primaryColor: '#2563eb', accentColor: '#4f46e5', textColor: '#0f172a', backgroundColor: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 18 },
  corporate: { primaryColor: '#1e293b', accentColor: '#475569', textColor: '#0f172a', backgroundColor: '#ffffff', fontFamily: 'Georgia, serif', fontSize: 14, spacing: 16 },
  minimal: { primaryColor: '#18181b', accentColor: '#52525b', textColor: '#27272a', backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 13, spacing: 14 },
  ats: { primaryColor: '#000000', accentColor: '#333333', textColor: '#000000', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: 12, spacing: 14 },
  executive: { primaryColor: '#92400e', accentColor: '#b45309', textColor: '#1c1917', backgroundColor: '#fffbeb', fontFamily: 'Georgia, serif', fontSize: 14, spacing: 18 },
  fresher: { primaryColor: '#0284c7', accentColor: '#0ea5e9', textColor: '#0f172a', backgroundColor: '#f0f9ff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 16 },
  developer: { primaryColor: '#7c3aed', accentColor: '#6366f1', textColor: '#f8fafc', backgroundColor: '#0f172a', fontFamily: 'Consolas, monospace', fontSize: 13, spacing: 16 },
  sidebar: { primaryColor: '#0891b2', accentColor: '#06b6d4', textColor: '#0f172a', backgroundColor: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 16 },
  elegant: { primaryColor: '#be185d', accentColor: '#ec4899', textColor: '#4a044e', backgroundColor: '#fdf2f8', fontFamily: 'Georgia, serif', fontSize: 14, spacing: 18 },
  creative: { primaryColor: '#c026d3', accentColor: '#f97316', textColor: '#1e1b4b', backgroundColor: '#faf5ff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 16 },
  startup: { primaryColor: '#16a34a', accentColor: '#22c55e', textColor: '#14532d', backgroundColor: '#f0fdf4', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 16 },
  timeline: { primaryColor: '#4338ca', accentColor: '#6366f1', textColor: '#1e1b4b', backgroundColor: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 16 },
  compact: { primaryColor: '#374151', accentColor: '#6b7280', textColor: '#111827', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: 11, spacing: 12 },
  dark: { primaryColor: '#38bdf8', accentColor: '#818cf8', textColor: '#f1f5f9', backgroundColor: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 16 },
  luxury: { primaryColor: '#ca8a04', accentColor: '#eab308', textColor: '#292524', backgroundColor: '#fffef7', fontFamily: 'Georgia, serif', fontSize: 14, spacing: 20 },
  international: { primaryColor: '#1d4ed8', accentColor: '#dc2626', textColor: '#0f172a', backgroundColor: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 16 },
  gradient: { primaryColor: '#9333ea', accentColor: '#ec4899', textColor: '#0f172a', backgroundColor: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 18 },
  'white-pro': { primaryColor: '#0f172a', accentColor: '#64748b', textColor: '#334155', backgroundColor: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 18 },
  designer: { primaryColor: '#14b8a6', accentColor: '#6366f1', textColor: '#134e4a', backgroundColor: '#f0fdfa', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, spacing: 16 },
  'one-page': { primaryColor: '#2563eb', accentColor: '#0891b2', textColor: '#0f172a', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: 11, spacing: 12 },
};

export function getTemplateThemePreset(templateId: string): Partial<ResumeThemeSettings> {
  return PRESETS[templateId] ?? PRESETS.modern;
}

export function applyTemplatePreset(
  templateId: string,
  current: ResumeThemeSettings
): ResumeThemeSettings {
  const preset = getTemplateThemePreset(templateId);
  getTemplateById(templateId);
  return { ...current, ...preset };
}
