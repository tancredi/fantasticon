import _svg2ttf from 'svg2ttf';
import { FontAssetType } from '../../../types/misc';
import { FontGeneratorOptions } from '../../../types/generator';
import ttfGen from '../ttf';

const svg2ttf = _svg2ttf as unknown as jest.Mock<typeof _svg2ttf>;

jest.mock('svg2ttf', () =>
  jest.fn(content => ({ buffer: `::ttf(${content})::` }))
);

const mockOptions = (ttfOptions = { __mock: 'options__' } as any) =>
  ({
    formatOptions: { [FontAssetType.TTF]: ttfOptions }
  }) as unknown as FontGeneratorOptions;

const svg = '::svg::';

describe('`TTF` font generator', () => {
  beforeEach(() => {
    svg2ttf.mockClear();
  });

  test('resolves with the correctly processed return value of `svg2ttf`', async () => {
    const result = await ttfGen.generate(mockOptions(), svg);

    expect(svg2ttf).toHaveBeenCalledTimes(1);
    expect(svg2ttf).toHaveBeenCalledWith(svg, {
      ts: 0,
      __mock: 'options__'
    });
    expect(result).toEqual(Buffer.from(`::ttf(${svg})::`));
  });

  test('passes correctly format options to `svg2ttf` and sets `ts` (timestamp) to `0` by default to avoid generating unnecessary diffs', async () => {
    const formatOptions = { foo: 'bar' };
    await ttfGen.generate(mockOptions(formatOptions), svg);

    expect(svg2ttf).toHaveBeenCalledTimes(1);
    expect(svg2ttf.mock.calls[0][1]).toEqual({ ts: 0, ...formatOptions });
  });
});
