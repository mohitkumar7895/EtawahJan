import fs from 'fs';
import path from 'path';

export async function zipDirectory(sourceDir: string, zipPath: string): Promise<void> {
  let archiver: typeof import('archiver');
  try {
    archiver = (await import('archiver')).default;
  } catch {
    throw new Error('ZIP download requires the "archiver" package. Run: npm install archiver');
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
