declare module 'sharp' {
  // Optional native dependency — loose types for Next.js build when sharp is externalized
  const sharp: (...args: unknown[]) => {
    metadata(): Promise<{ format?: string; width?: number; height?: number }>;
    resize(...args: unknown[]): unknown;
    jpeg(...args: unknown[]): unknown;
    png(...args: unknown[]): unknown;
    webp(...args: unknown[]): unknown;
    toFile(path: string): Promise<{ size: number }>;
    toBuffer(): Promise<Buffer>;
  };
  export default sharp;
}
