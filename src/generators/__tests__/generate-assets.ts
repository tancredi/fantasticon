import { AssetType, FontAssetType, OtherAssetType } from '../../types/misc';
import { FontGeneratorOptions } from '../../types/generator';
import { AssetsMap } from '../../utils/assets';
import { generateAssets } from '../generate-assets';
import generators from '../asset-types';

jest.mock('../asset-types', () => {
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

describe('Generate assets', () => {
  beforeEach(() => {
    for (const gen of Object.values(generators)) {
      ((gen.generate as unknown) as jest.Mock).mockClear();
    }
  });

  test('`generateAssets` correctly generates and returns assets specified by the merged `fontTypes` and `assetTypes` option', async () => {
    const fontTypes = cast<FontAssetType[]>(['a']);
    const assetTypes = cast<OtherAssetType[]>(['c']);
    const result = await generateAssets(
      cast<FontGeneratorOptions>({ fontTypes, assetTypes })
    );

    expect(result).toEqual({ a: '::a::', c: '::c::' });
  });

  test('`generateAssets` calls necessary generator functions with correct argugments and only once, and with correctly generated codepoints', async () => {
    const fontTypes = cast<AssetType[]>(['b', 'd']);
    const assets = cast<AssetsMap>({ __mock: 'assetsMap__' });
    const codepoints = { __mock: '::codepoint::' };
    const options = cast<FontGeneratorOptions>({
      assetTypes: [],
      codepoints,
      fontTypes,
      assets
    });

    await generateAssets(options);

    expect(getGeneratorFn('a')).toHaveBeenCalledTimes(1);
    expect(getGeneratorFn('a')).toHaveBeenCalledWith(options, null);

    expect(getGeneratorFn('b')).toHaveBeenCalledTimes(1);
    expect(getGeneratorFn('b')).toHaveBeenCalledWith(options, '::a::');

    expect(getGeneratorFn('c')).not.toHaveBeenCalled();

    expect(getGeneratorFn('d')).toHaveBeenCalledTimes(1);
    expect(getGeneratorFn('d')).toHaveBeenCalledWith(options, null);
  });
});
