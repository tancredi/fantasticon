import { DEFAULT_START_CODEPOINT } from '../../constants';
import { AssetsMap } from '../assets';
import { getCodepoints } from '../codepoints';

const mockAssetsMap = (ids: string[] = ['foo', 'bar', 'test']): AssetsMap =>
  ids.reduce(
    (cur = {}, id) => ({
      ...cur,
      [id]: { id, relativePath: '...', absolutePath: '...' }
    }),
    {}
  );

describe('CodePoints utilities', () => {
  test('`DEFAULT_START_CODEPOINT` is defined and valid', () => {
    expect(DEFAULT_START_CODEPOINT).toBeTruthy();
    expect(typeof DEFAULT_START_CODEPOINT).toBe('number');
  });

  test('`getCodepoints` produces expectetd output with default arguments', () => {
    expect(getCodepoints(mockAssetsMap())).toEqual({
      foo: DEFAULT_START_CODEPOINT,
      bar: DEFAULT_START_CODEPOINT + 1,
      test: DEFAULT_START_CODEPOINT + 2
    });
  });

  test('`getCodepoints` uses given start codepoint', () => {
    expect(getCodepoints(mockAssetsMap(), 10)).toEqual({
      foo: 10,
      bar: 11,
      test: 12
    });
  });

  test('`getCodepoints` correctly merges predefined codepoints with generated ones', () => {
    const predefined = { buzz: 20, bazz: 21 };

    expect(getCodepoints(mockAssetsMap(), 10, predefined)).toEqual({
      foo: 10,
      bar: 11,
      test: 12,
      buzz: 20,
      bazz: 21
    });
  });

  test('`getCodepoints` skips codepoints already used in the predefined map', () => {
    const predefined = { buzz: 10, bazz: 12 };

    expect(getCodepoints(mockAssetsMap(), 10, predefined)).toEqual({
      foo: 11,
      bar: 13,
      test: 14,
      buzz: 10,
      bazz: 12
    });
  });
});
