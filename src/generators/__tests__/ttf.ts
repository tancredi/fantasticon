import svg2ttf from 'svg2ttf';
import { FontType } from '../../types/misc';
import { FontGeneratorOptions } from '../../types/generator';
import ttfGen from '../ttf';

jest.mock('svg2ttf', () => ({
  default: jest.fn(content => ({ buffer: `::ttf(${content})::` }))
}));

const mockOptions = (ttfOptions = { __mock: 'options__' } as any) =>
  (({
    formatOptions: { [FontType.TTF]: ttfOptions }
  } as unknown) as FontGeneratorOptions);

const ttf = '::svg::';

describe('`TTF` font generator', () => {
  beforeEach(() => {
    svg2ttf.mockClear();
  });

  test('calls done with the correctly obtained return value of `svg2ttf`', () => {
    const done = jest.fn();
    const result = ttfGen.generate(mockOptions(), ttf, done);
    const svg = '::svg::';

    expect(svg2ttf).toHaveBeenCalledTimes(1);
    expect(svg2ttf).toHaveBeenCalledWith(svg, { __mock: 'options__' });

    expect(done).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith(null, new Buffer(`::ttf(${svg})::`));
  });

  test('passes correctly format options to `svg2ttf`', () => {
    const formatOptions = { foo: 'bar' };
    const result = ttfGen.generate(mockOptions(formatOptions), ttf, () => null);

    expect(svg2ttf).toHaveBeenCalledTimes(1);
    expect(svg2ttf.mock.calls[0][1]).toEqual(formatOptions);
  });
});
