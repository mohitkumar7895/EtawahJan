import { StandardFonts } from 'pdf-lib';

export function mapToStandardFont(fontFamily: string): StandardFonts {
  const f = fontFamily.toLowerCase();
  if (f.includes('times') || f.includes('serif')) return StandardFonts.TimesRoman;
  if (f.includes('courier') || f.includes('mono')) return StandardFonts.Courier;
  return StandardFonts.Helvetica;
}

export function hexToPdfRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '').padStart(6, '0');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}
