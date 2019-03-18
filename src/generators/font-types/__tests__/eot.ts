import _ttf2eot from 'ttf2eot';
import { FontType } from '../../../types/misc';
import { FontGeneratorOptions } from '../../../types/generator';
import eotGen from '../eot';

const ttf2eot = (_ttf2eot as unknown) as jest.Mock<typeof _ttf2eot>;

jest.mock('ttf2eot', () =>
  jest.fn(content => ({ buffer: `::eot(${content})::` }))
);

const mockOptions = (eotOptions = { __mock: 'options__' } as any) =>
  (({
    formatOptions: { [FontType.EOT]: eotOptions }
  } as unknown) as FontGeneratorOptions);

const ttf = ('::ttf::' as unknown) as Buffer;

describe('`EOT` font generator', () => {
  beforeEach(() => ttf2eot.mockClear());

  test('resolves with the correctly processed return value of `ttf2eot`', async () => {
    const result = await eotGen.generate(mockOptions(), ttf);
    const ttfArr = new Uint8Array(('::ttf::' as unknown) as any[]);

    expect(ttf2eot).toHaveBeenCalledTimes(1);
    expect(ttf2eot).toHaveBeenCalledWith(ttfArr, { __mock: 'options__' });
    expect(result).toEqual(new Buffer(`::eot(${ttfArr})::`));
  });

  test('passes correctly format options to `ttf2eot`', async () => {
    const formatOptions = { foo: 'bar' };
    const result = await eotGen.generate(mockOptions(formatOptions), ttf);

    expect(ttf2eot).toHaveBeenCalledTimes(1);
    expect(ttf2eot.mock.calls[0][1]).toEqual(formatOptions);
  });
});
