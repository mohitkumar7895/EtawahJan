export type ToolCategory = 'pdf' | 'image' | 'office' | 'utility';

export type OutputKind = 'pdf' | 'image' | 'zip' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'same';

export interface ConverterTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  accept: string[];
  acceptLabel: string;
  output: OutputKind;
  multiple: boolean;
  maxFiles: number;
  icon: string;
  color: string;
  popular?: boolean;
}

export type JobStatus = 'queued' | 'active' | 'completed' | 'failed';

export interface ConversionJob {
  id: string;
  toolId: string;
  status: JobStatus;
  progress: number;
  message?: string;
  createdAt: string;
  completedAt?: string;
  outputs?: { name: string; url: string; size: number }[];
  error?: string;
  zipUrl?: string;
}

export interface JobOptions {
  quality?: number;
  password?: string;
  unlockPassword?: string;
  watermarkText?: string;
  rotation?: number;
  pages?: string;
  ocrLang?: string;
}
