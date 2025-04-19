declare module 'heic-convert' {
  interface HeicOptions {
    buffer: Buffer;
    format: 'JPEG' | 'PNG';
    quality?: number;
  }

  function convert(options: HeicOptions): Promise<Buffer>;
  
  export = convert;
}