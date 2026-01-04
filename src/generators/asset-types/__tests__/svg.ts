import * as _SVGIcons2SVGFontStream from 'svgicons2svgfont';
import { FontAssetType } from '../../../types/misc';
import { FontGeneratorOptions } from '../../../types/generator';
import { vi, it, describe, beforeEach, expect, Mock } from 'vitest';
import svgGen from '../svg';

const mockConstuctor = (
  _SVGIcons2SVGFontStream as unknown as {
    mockConstuctor: Mock;
  }
).mockConstuctor;

vi.mock('fs', () => ({
  createReadStream: (filepath: string) => ({
    content: `content->${filepath}`
  })
}));

vi.mock('svgicons2svgfont', () => {
  const { EventEmitter } = require('events');

  const mockConstuctor = vi.fn();

  class MockStream {
    public events = new EventEmitter();
    public content = '';

    constructor(...args: any[]) {
      mockConstuctor(...args);
    }

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

  return { SVGIcons2SVGFontStream: MockStream, mockConstuctor };
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
    vi.clearAllMocks();
  });

  it('resolves with the result of the completed `SVGIcons2SVGFontStream`', async () => {
    const result = await svgGen.generate(mockOptions(), null);

    expect(mockConstuctor).toHaveBeenCalledTimes(1);
    expect(mockConstuctor).toHaveBeenCalledWith({
      descent: 2,
      fontHeight: 1,
      fontName: 'foo',
      // log: expect.any(Function),
      normalize: false,
      __mock: 'options__'
    });

    expect(result).toMatchSnapshot();
  });

  it('passes correctly format options to `SVGIcons2SVGFontStream`', async () => {
    const log = () => null;
    const formatOptions = { descent: 5, fontHeight: 6, log };
    const result = await svgGen.generate(mockOptions(formatOptions), null);

    expect(result).toMatchSnapshot();

    expect(mockConstuctor).toHaveBeenCalledTimes(1);
    expect(mockConstuctor).toHaveBeenCalledWith({
      descent: 5,
      fontHeight: 6,
      fontName: 'foo',
      log,
      normalize: false
    });
  });
});
