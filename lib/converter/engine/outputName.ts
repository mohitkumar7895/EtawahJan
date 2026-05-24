import path from 'path';

export function outputName(base: string, ext: string) {
  return path.basename(base, path.extname(base)) + ext;
}
