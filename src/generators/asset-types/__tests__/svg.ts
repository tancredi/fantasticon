import * as _SVGIcons2SVGFontStream from 'svgicons2svgfont';
import { FontAssetType } from '../../../types/misc';
import { FontGeneratorOptions } from '../../../types/generator';
import svgGen from '../svg';

const SVGIcons2SVGFontStream = _SVGIcons2SVGFontStream as unknown as jest.Mock<
  typeof _SVGIcons2SVGFontStream
>;

jest.mock('fs', () => ({
  createReadStream: (filepath: string) => ({
    content: `content->${filepath}`
  })
}));

jest.mock('svgicons2svgfont', () => {
  const { EventEmitter } = require('events');

  class MockStream {
    public events = new EventEmitter();
    public content = '';

    public write(chunk: any) {
      this.events.emit(
        'data',
        Buffer.from(
          `processed->${chunk.content}|${JSON.stringify(chunk.metadata)}$`
        )
      );
      return this;
    }

    public on(event: string, callback: () => void) {
      this.events.on(event, callback);
      return this;
    }

    public end() {
      this.events.emit('end');
      return this;
    }
  }

  return jest.fn(() => new MockStream());
});

const mockOptions = (svgOptions = { __mock: 'options__' } as any) =>
  ({
    name: 'foo',
    fontHeight: 1,
    descent: 2,
    normalize: false,
    formatOptions: { [FontAssetType.SVG]: svgOptions },
    codepoints: { foo: 1, bar: 1 },
    assets: {
      foo: { id: 'foo', absolutePath: '/root/foo.svg' },
      bar: { id: 'bar', absolutePath: '/root/bar.svg' }
    }
  }) as unknown as FontGeneratorOptions;

describe('`SVG` font generator', () => {
  beforeEach(() => {
    SVGIcons2SVGFontStream.mockClear();
  });

  test('resolves with the result of the completed `SVGIcons2SVGFontStream`', async () => {
    const result = await svgGen.generate(mockOptions(), null);

    expect(SVGIcons2SVGFontStream).toHaveBeenCalledTimes(1);
    expect(SVGIcons2SVGFontStream).toHaveBeenCalledWith({
      descent: 2,
      fontHeight: 1,
      fontName: 'foo',
      log: expect.any(Function),
      normalize: false,
      __mock: 'options__'
    });

    expect(result).toMatchSnapshot();
  });

  test('passes correctly format options to `SVGIcons2SVGFontStream`', async () => {
    const log = () => null;
    const formatOptions = { descent: 5, fontHeight: 6, log };
    const result = await svgGen.generate(mockOptions(formatOptions), null);

    expect(result).toMatchSnapshot();

    expect(SVGIcons2SVGFontStream).toHaveBeenCalledTimes(1);
    expect(SVGIcons2SVGFontStream).toHaveBeenCalledWith({
      descent: 5,
      fontHeight: 6,
      fontName: 'foo',
      log,
      normalize: false
    });
  });
});
