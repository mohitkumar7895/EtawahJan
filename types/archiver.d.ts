declare module 'archiver' {
  import type { WriteStream } from 'fs';

  interface Archiver {
    pipe(destination: WriteStream): void;
    directory(dirpath: string, destpath: string | false): void;
    finalize(): void;
    on(event: 'error', listener: (err: Error) => void): this;
  }

  function archiver(format: string, options?: { zlib?: { level?: number } }): Archiver;
  export = archiver;
}
