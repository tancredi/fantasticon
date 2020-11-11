declare module 'svgicons2svgfont' {
  import { Transform } from 'stream';

  export interface SvgIcons2FontOptions {
    fontName?: string;
    fontId?: string;
    fontStyle?: string;
    fontWeight?: string;
    fixedWidth?: boolean;
    centerHorizontally?: boolean;
    normalize?: boolean;
    fontHeight?: number;
    round?: number;
    descent?: number;
    ascent?: number;
    metadata: string;
    log: (message: any) => undefined;
  }

  class svgicons2svgfont extends Transform {
    constructor(options: SvgIcons2FontOptions);
  }

  export default svgicons2svgfont;
}
