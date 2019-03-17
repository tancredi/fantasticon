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

  test('resolves with the correctly processed return value of `svg2ttf`', async () => {
    const done = jest.fn();
    const result = await ttfGen.generate(mockOptions(), ttf);
    const svg = '::svg::';

    expect(svg2ttf).toHaveBeenCalledTimes(1);
    expect(svg2ttf).toHaveBeenCalledWith(svg, { __mock: 'options__' });
    expect(result).toEqual(new Buffer(`::ttf(${svg})::`));
  });

  test('passes correctly format options to `svg2ttf`', async () => {
    const formatOptions = { foo: 'bar' };
    const result = await ttfGen.generate(mockOptions(formatOptions), ttf);

    expect(svg2ttf).toHaveBeenCalledTimes(1);
    expect(svg2ttf.mock.calls[0][1]).toEqual(formatOptions);
  });
});
