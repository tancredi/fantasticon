import _ttf2woff from 'ttf2woff';
import { FontAssetType } from '../../../types/misc';
import { FontGeneratorOptions } from '../../../types/generator';
import woffGen from '../woff';
import { vi, describe, it, beforeEach, expect, Mock } from 'vitest';

const ttf2woff = _ttf2woff as unknown as Mock<typeof _ttf2woff>;

vi.mock('ttf2woff', () => ({
  default: vi.fn(content => ({ buffer: `::woff(${content})::` }))
}));

const mockOptions = (woffOptions = { __mock: 'options__' } as any) =>
  ({
    formatOptions: { [FontAssetType.WOFF]: woffOptions }
  }) as unknown as FontGeneratorOptions;

const ttf = '::ttf::' as unknown as Buffer;

describe('`WOFF` font generator', () => {
  beforeEach(() => {
    ttf2woff.mockClear();
  });

  it('resolves with the correctly processed return value of `ttf2woff`', async () => {
    const result = await woffGen.generate(mockOptions(), ttf);
    const ttfArr = new Uint8Array('::ttf::' as unknown as any[]);

    expect(ttf2woff).toHaveBeenCalledTimes(1);
    expect(ttf2woff).toHaveBeenCalledWith(ttfArr, { __mock: 'options__' });
    expect(result).toEqual(Buffer.from(`::woff(${ttfArr})::`));
  });

  it('passes correctly format options to `ttf2woff`', async () => {
    const formatOptions = { foo: 'bar' };

    await woffGen.generate(mockOptions(formatOptions), ttf);

    expect(ttf2woff).toHaveBeenCalledTimes(1);
    expect(ttf2woff.mock.calls[0][1]).toEqual(formatOptions);
  });
});
