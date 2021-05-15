import { DEFAULT_START_CODEPOINT } from '../../constants';
import { AssetsMap } from '../assets';
import { getCodepoints, getHexCodepoint } from '../codepoints';

const mockAssetsMap = (ids: string[] = ['foo', 'bar', 'test']): AssetsMap =>
  ids.reduce(
    (cur = {}, id) => ({
      ...cur,
      [id]: { id, relativePath: '...', absolutePath: '...' }
    }),
    {}
  );

describe('CodePoints utilities', () => {
  it('exports a valid `DEFAULT_START_CODEPOINT`', () => {
    expect(DEFAULT_START_CODEPOINT).toBeTruthy();
    expect(typeof DEFAULT_START_CODEPOINT).toBe('number');
  });

  describe('getCodepoints', () => {
    it('produces expectetd output with default arguments', () => {
      expect(getCodepoints(mockAssetsMap())).toEqual({
        foo: DEFAULT_START_CODEPOINT,
        bar: DEFAULT_START_CODEPOINT + 1,
        test: DEFAULT_START_CODEPOINT + 2
      });
    });

    it('uses given start codepoint', () => {
      expect(getCodepoints(mockAssetsMap(), {}, 10)).toEqual({
        foo: 10,
        bar: 11,
        test: 12
      });
    });

    it('correctly merges predefined codepoints with generated ones', () => {
      const predefined = { buzz: 20, bazz: 21 };

      expect(getCodepoints(mockAssetsMap(), predefined, 10)).toEqual({
        foo: 10,
        bar: 11,
        test: 12,
        buzz: 20,
        bazz: 21
      });
    });

    it('skips codepoints already used in the predefined map', () => {
      const predefined = { buzz: 10, bazz: 12 };

      expect(getCodepoints(mockAssetsMap(), predefined, 10)).toEqual({
        foo: 11,
        bar: 13,
        test: 14,
        buzz: 10,
        bazz: 12
      });
    });
  });

  describe('getHexCodepoint', () => {
    it.each([
      [62087, 'f287'],
      [61940, 'f1f4'],
      [61941, 'f1f5'],
      [61942, 'f1f6'],
      [61943, 'f1f7']
    ])('converts codepoint %s to hex string %s', (input, output) => {
      expect(getHexCodepoint(input)).toEqual(output);
    });
  });
});
