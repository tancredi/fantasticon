import { DEFAULT_OPTIONS } from '../../constants';
import { FontType } from '../../types/misc';
import { RunnerOptions } from '../../types/runner';
import { AssetsMap } from '../../utils/assets';
import { generateFonts } from '../generate-fonts';
import { getGeneratorOptions } from '../generator-options';
import generators from '../font-types';

jest.mock('../font-types', () => {
  const mockResult = (type: string) => `::${type}::`;
  const mockGenerator = (name: string, dependsOn: string | null = null) => ({
    dependsOn,
    generate: jest.fn(async (_, dependant) => {
      if (dependsOn && dependant !== mockResult(dependsOn)) {
        throw new Error(
          `'${name}' generator called without '${dependsOn}' result`
        );
      }

      return mockResult(name);
    })
  });

  return {
    a: mockGenerator('a'),
    b: mockGenerator('b', 'a'),
    c: mockGenerator('c', 'd'),
    d: mockGenerator('d')
  };
});

const cast = <T>(val: any) => (val as unknown) as T;

const getGeneratorFn = (key: string) =>
  generators[key as keyof typeof generators].generate;

describe('Generate fonts', () => {
  beforeEach(() => {
    for (const gen of Object.values(generators)) {
      ((gen.generate as unknown) as jest.Mock).mockClear();
    }
  });

  test('`generateFonts` correctly generates and returns fonts specified by the `types` option', async () => {
    const types = cast<FontType[]>(['a', 'c']);
    const assets = cast<AssetsMap>({ __mock: 'assetsMap__' });
    const result = await generateFonts(assets, cast<RunnerOptions>({ types }));

    expect(result).toEqual({ a: '::a::', c: '::c::' });
  });

  test('`generateFonts` calls necessary generator functions with correct argugments and only once', async () => {
    const types = cast<FontType[]>(['b', 'd']);
    const assets = cast<AssetsMap>({ __mock: 'assetsMap__' });
    const options = cast<RunnerOptions>({ types });
    const result = await generateFonts(assets, options);
    const genOptions = getGeneratorOptions(options, assets);

    expect(getGeneratorFn('a')).toHaveBeenCalledTimes(1);
    expect(getGeneratorFn('a')).toHaveBeenCalledWith(genOptions, null);

    expect(getGeneratorFn('b')).toHaveBeenCalledTimes(1);
    expect(getGeneratorFn('b')).toHaveBeenCalledWith(genOptions, '::a::');

    expect(getGeneratorFn('c')).not.toHaveBeenCalled();

    expect(getGeneratorFn('d')).toHaveBeenCalledTimes(1);
    expect(getGeneratorFn('d')).toHaveBeenCalledWith(genOptions, null);
  });
});
