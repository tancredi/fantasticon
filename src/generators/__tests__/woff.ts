import ttf2woff from 'ttf2woff';
import { FontType } from '../../types/misc';
import { FontGeneratorOptions } from '../../types/generator';
import woffGen from '../woff';

jest.mock('ttf2woff', () => ({
  default: jest.fn(content => ({ buffer: `::woff(${content})::` }))
}));

const mockOptions = (woffOptions = { __mock: 'options__' } as any) =>
  (({
    formatOptions: { [FontType.WOFF]: woffOptions }
  } as unknown) as FontGeneratorOptions);

const ttf = ('::ttf::' as unknown) as Buffer;

describe('`WOFF` font generator', () => {
  beforeEach(() => {
    ttf2woff.mockClear();
  });

  test('calls done with the correctly obtained return value of `ttf2woff`', () => {
    const done = jest.fn();
    const result = woffGen.generate(mockOptions(), ttf, done);
    const ttfArr = new Uint8Array(('::ttf::' as unknown) as any[]);

    expect(ttf2woff).toHaveBeenCalledTimes(1);
    expect(ttf2woff).toHaveBeenCalledWith(ttfArr, { __mock: 'options__' });

    expect(done).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith(null, new Buffer(`::woff(${ttfArr})::`));
  });

  test('passes correctly format options to `ttf2woff`', () => {
    const formatOptions = { foo: 'bar' };
    const result = woffGen.generate(
      mockOptions(formatOptions),
      ttf,
      () => null
    );

    expect(ttf2woff).toHaveBeenCalledTimes(1);
    expect(ttf2woff.mock.calls[0][1]).toEqual(formatOptions);
  });
});
