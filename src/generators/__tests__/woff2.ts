import ttf2woff2 from 'ttf2woff2';
import { FontType } from '../../types/misc';
import { FontGeneratorOptions } from '../../types/generator';
import woff2Gen from '../woff2';

jest.mock('ttf2woff2', () => ({
  default: jest.fn(content => ({ buffer: `::woff2(${content})::` }))
}));

const mockOptions = (woffOptions = { __mock: 'options__' } as any) =>
  (({
    formatOptions: { [FontType.WOFF2]: woffOptions }
  } as unknown) as FontGeneratorOptions);

const ttf = ('::ttf::' as unknown) as Buffer;

describe('`WOFF2` font generator', () => {
  beforeEach(() => {
    ttf2woff2.mockClear();
  });

  test('resolves with the correctly processed return value of `ttf2woff2`', async () => {
    const result = await woff2Gen.generate(mockOptions(), ttf);
    const ttfArr = new Uint8Array(('::ttf::' as unknown) as any[]);

    expect(ttf2woff2).toHaveBeenCalledTimes(1);
    expect(ttf2woff2).toHaveBeenCalledWith(ttfArr, { __mock: 'options__' });
    expect(result).toEqual(new Buffer(`::woff2(${ttfArr})::`));
  });

  test('passes correctly format options to `ttf2woff2`', async () => {
    const formatOptions = { foo: 'bar' };
    const result = await woff2Gen.generate(mockOptions(formatOptions), ttf);

    expect(ttf2woff2).toHaveBeenCalledTimes(1);
    expect(ttf2woff2.mock.calls[0][1]).toEqual(formatOptions);
  });
});
