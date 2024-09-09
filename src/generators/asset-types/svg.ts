import { createReadStream, ReadStream } from 'fs';
import { FontGenerator } from '../../types/generator';

type GglyphStream = ReadStream & { metadata?: any };

const generator: FontGenerator<void> = {
  generate: ({
    name: fontName,
    fontHeight,
    descent,
    normalize,
    assets,
    codepoints,
    formatOptions: { svg } = {}
  }) =>
    new Promise(resolve => {
      let font = Buffer.alloc(0);

      const SVGIcons2SVGFontStream = require('svgicons2svgfont');
      const fontStream = new SVGIcons2SVGFontStream({
        fontName,
        fontHeight,
        descent,
        normalize,
        ...svg
      })
        .on('data', data => (font = Buffer.concat([font, data])))
        .on('end', () => resolve(font.toString()));

      for (const { id, absolutePath } of Object.values(assets)) {
        const glyph: GglyphStream = createReadStream(absolutePath);
        const unicode = String.fromCharCode(codepoints[id]);

        glyph.metadata = { name: id, unicode: [unicode] };

        fontStream.write(glyph);
      }

      fontStream.end();
    })
};

export default generator;
