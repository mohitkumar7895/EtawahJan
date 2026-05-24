import fs from 'fs';
import path from 'path';

export async function zipDirectory(sourceDir: string, zipPath: string): Promise<void> {
  const archiverModule = await import(/* webpackIgnore: true */ 'archiver').catch(() => null);
  const archiver = archiverModule?.default;
  if (!archiver) {
    throw new Error('ZIP download requires: npm install archiver');
  }

  await fs.promises.mkdir(path.dirname(zipPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 6 } });
    output.on('close', () => resolve());
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
