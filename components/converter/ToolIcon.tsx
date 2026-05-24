import {
  FileImage,
  FileText,
  FileType,
  Sheet,
  Presentation,
  Code,
  AlignLeft,
  Minimize2,
  Shrink,
  Combine,
  Split,
  RotateCw,
  Droplets,
  Unlock,
  Lock,
  ScanText,
  Image,
  Smartphone,
  PenTool,
  Layers,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  FileImage,
  FileText,
  FileType,
  Sheet,
  Presentation,
  Code,
  AlignLeft,
  Minimize2,
  Shrink,
  Combine,
  Split,
  RotateCw,
  Droplets,
  Unlock,
  Lock,
  ScanText,
  Image,
  Smartphone,
  PenTool,
  Layers,
};

export default function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] || FileText;
  return <Icon className={className} />;
}
