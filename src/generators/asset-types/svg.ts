import { createReadStream, ReadStream } from 'fs';
import SVGIcons2SVGFontStream from 'svgicons2svgfont';
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
    formatOptions: { svg } = {},
    addLigatures
  }) =>
    new Promise(resolve => {
      let font = Buffer.alloc(0);

      const fontStream = new SVGIcons2SVGFontStream({
        fontName,
        fontHeight,
        descent,
        normalize,
        log: () => null,
        ...svg
      })
        .on('data', data => (font = Buffer.concat([font, data])))
        .on('end', () => resolve(font.toString()));

      for (const { id, absolutePath } of Object.values(assets)) {
        const glyph: GglyphStream = createReadStream(absolutePath);
        const unicode = String.fromCharCode(codepoints[id]);
        if (addLigatures) {
          let ligature = '';
          for (var i = 0; i < id.length; i++) {
            ligature += String.fromCharCode(id.charCodeAt(i));
          }
          glyph.metadata = { name: id, unicode: [unicode, ligature] };
        } else {
          glyph.metadata = { name: id, unicode: [unicode] };
        }

        fontStream.write(glyph);
      }

      fontStream.end();
    })
};

export default generator;
