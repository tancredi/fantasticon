import ttf2eot from 'ttf2eot';
import { FontType } from '../../types/misc';
import { FontGeneratorOptions } from '../../types/generator';
import eotGen from '../eot';

jest.mock('ttf2eot', () => ({
  default: jest.fn(content => ({ buffer: `::eot(${content})::` }))
}));

const mockOptions = (eotOptions = { __mock: 'options__' } as any) =>
  (({
    formatOptions: { [FontType.EOT]: eotOptions }
  } as unknown) as FontGeneratorOptions);

const ttf = ('::ttf::' as unknown) as Buffer;

describe('`EOT` font generator', () => {
  beforeEach(() => {
    ttf2eot.mockClear();
  });

  test('calls done with the correctly obtained return value of `ttf2eot`', () => {
    const done = jest.fn();
    const result = eotGen.generate(mockOptions(), ttf, done);
    const ttfArr = new Uint8Array(('::ttf::' as unknown) as any[]);

    expect(ttf2eot).toHaveBeenCalledTimes(1);
    expect(ttf2eot).toHaveBeenCalledWith(ttfArr, { __mock: 'options__' });

    expect(done).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith(null, new Buffer(`::eot(${ttfArr})::`));
  });

  test('passes correctly format options to `ttf2eot`', () => {
    const formatOptions = { foo: 'bar' };
    const result = eotGen.generate(mockOptions(formatOptions), ttf, () => null);

    expect(ttf2eot).toHaveBeenCalledTimes(1);
    expect(ttf2eot.mock.calls[0][1]).toEqual(formatOptions);
  });
});
