declare module 'sharp' {
  interface Metadata {
    format?: string;
    width?: number;
    height?: number;
  }

  interface Sharp {
    metadata(): Promise<Metadata>;
    resize(width?: number, height?: number, options?: object): Sharp;
    jpeg(options?: object): Sharp;
    png(options?: object): Sharp;
    webp(options?: object): Sharp;
    toFile(path: string): Promise<{ size: number }>;
    toBuffer(): Promise<Buffer>;
  }

  function sharp(input?: string | Buffer): Sharp;
  export default sharp;
}
