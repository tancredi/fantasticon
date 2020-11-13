declare module 'svgicons2svgfont' {
  import { Transform } from 'stream';

  export interface SvgIcons2FontOptions {
    // The font family name you want
    fontName?: string;
    // The font id you want (Default value: the options.fontName)
    fontId?: string;
    fontStyle?: string;
    fontWeight?: string;
    // Creates a monospace font of the width of the largest input icon
    fixedWidth?: boolean;
    // Calculate the bounds of a glyph and center it horizontally
    centerHorizontally?: boolean;
    // Normalize icons by scaling them to the height of the highest icon
    normalize?: boolean;
    // The outputted font height (defaults to the height of the highest input icon)
    fontHeight?: number;
    // Setup SVG path rounding (Default value: 10e12)
    round?: number;
    // The font descent - usefull to fix the font baseline yourself
    descent?: number;
    // The font ascent - use this options only if you know what you're doing. A suitable value for this is computed for you
    ascent?: number;
    // The font [metadata](http://www.w3.org/TR/SVG/metadata.html). You can set any character data in but it is the be suited place for a copyright mention
    metadata: string;
    // Allows you to provide your own logging function - set to function(){} to disable logging
    log: (message: any) => undefined;
  }

  class svgicons2svgfont extends Transform {
    constructor(options: SvgIcons2FontOptions);
  }

  export default svgicons2svgfont;
}
