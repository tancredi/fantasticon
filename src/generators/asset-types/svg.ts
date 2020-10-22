import { createReadStream, ReadStream } from 'fs';
import SVGIcons2SVGFontStream from 'svgicons2svgfont';
import { FontGenerator } from '../../types/generator';
import { FontAssetType } from '../../types/misc';

type GglyphStream = ReadStream & { metadata?: any };

const generator: FontGenerator<void> = {
  generate: options =>
    new Promise(resolve => {
      let font = Buffer.alloc(0);
      let svgOptions = {
        fontName: options.name,
        fontHeight: options.fontHeight,
        descent: options.descent,
        normalize: options.normalize,
        round: options.round,
        log: () => null,
        ...options.formatOptions[FontAssetType.SVG]
      };

      const fontStream = new SVGIcons2SVGFontStream(svgOptions)
        .on('data', data => (font = Buffer.concat([font, data])))
        .on('end', () => resolve(font.toString()));

      for (const { id, absolutePath } of Object.values(options.assets)) {
        const glyph: GglyphStream = createReadStream(absolutePath);
        const unicode = String.fromCharCode(options.codepoints[id]);
        let ligature = '';

        for (let i = 0; i < id.length; i++) {
          ligature += String.fromCharCode(id.charCodeAt(i));
        }

        glyph.metadata = { name: id, unicode: [unicode, ligature] };

        fontStream.write(glyph);
      }

      fontStream.end();
    })
};

export default generator;
