export type ResumeSectionId =
  | 'personal'
  | 'summary'
  | 'skills'
  | 'experience'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'achievements'
  | 'internships'
  | 'interests'
  | 'references'
  | 'social'
  | 'custom';

export interface ResumeSectionConfig {
  id: ResumeSectionId | string;
  type: ResumeSectionId;
  label: string;
  visible: boolean;
  order: number;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photoUrl?: string;
  /** Indian biodata / CSC resume fields */
  fatherName?: string;
  dateOfBirth?: string;
  gender?: string;
  religion?: string;
  nationality?: string;
  maritalStatus?: string;
  declarationDate?: string;
  declarationPlace?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  description: string;
  technologies: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeThemeSettings {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  spacing: number;
  borderRadius: number;
}

export interface ResumeContent {
  personal: PersonalInfo;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  achievements: string[];
  internships: ExperienceItem[];
  interests: string[];
  references: ReferenceItem[];
  social: SocialLink[];
  customSections: CustomSection[];
}

export interface ResumeDocument {
  title: string;
  templateId: string;
  theme: ResumeThemeSettings;
  sections: ResumeSectionConfig[];
  content: ResumeContent;
  completionPercent: number;
  atsScore: number;
  version: number;
}

export interface ResumeTemplateMeta {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'corporate' | 'creative' | 'ats' | 'sidebar';
  previewGradient: string;
  layout: 'single' | 'sidebar' | 'timeline' | 'compact' | 'indian';
  isPremium: boolean;
}

export const DEFAULT_SECTIONS: ResumeSectionConfig[] = [
  { id: 'personal', type: 'personal', label: 'Personal Info', visible: true, order: 0 },
  { id: 'summary', type: 'summary', label: 'Summary', visible: true, order: 1 },
  { id: 'skills', type: 'skills', label: 'Skills', visible: true, order: 2 },
  { id: 'experience', type: 'experience', label: 'Experience', visible: true, order: 3 },
  { id: 'education', type: 'education', label: 'Education', visible: true, order: 4 },
  { id: 'projects', type: 'projects', label: 'Projects', visible: true, order: 5 },
  { id: 'certifications', type: 'certifications', label: 'Certifications', visible: false, order: 6 },
  { id: 'languages', type: 'languages', label: 'Languages', visible: false, order: 7 },
  { id: 'achievements', type: 'achievements', label: 'Achievements', visible: false, order: 8 },
  { id: 'internships', type: 'internships', label: 'Internships', visible: false, order: 9 },
  { id: 'interests', type: 'interests', label: 'Interests', visible: false, order: 10 },
  { id: 'references', type: 'references', label: 'References', visible: false, order: 11 },
  { id: 'social', type: 'social', label: 'Social Links', visible: true, order: 12 },
];

export const DEFAULT_THEME: ResumeThemeSettings = {
  primaryColor: '#2563eb',
  accentColor: '#7c3aed',
  textColor: '#0f172a',
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 14,
  lineHeight: 1.5,
  spacing: 16,
  borderRadius: 8,
};

export function createEmptyResumeContent(): ResumeContent {
  return {
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    internships: [],
    interests: [],
    references: [],
    social: [],
    customSections: [],
  };
}

export function createDefaultResumeDocument(title = 'My Resume'): ResumeDocument {
  return {
    title,
    templateId: 'modern',
    theme: { ...DEFAULT_THEME },
    sections: DEFAULT_SECTIONS.map((s) => ({ ...s })),
    content: createEmptyResumeContent(),
    completionPercent: 0,
    atsScore: 0,
    version: 1,
  };
}

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
