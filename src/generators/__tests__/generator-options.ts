import { prefillOptions, getGeneratorOptions } from '../generator-options';
import { AssetsMap } from '../../utils/assets';
import { ASSET_TYPES, ASSET_TYPES_WITH_TEMPLATE } from '../../types/misc';
import { getCodepoints } from '../../utils/codepoints';

const getCodepointsMock = getCodepoints as any as jest.Mock;

jest.mock('path');

jest.mock('../../constants', () => {
  const constants = jest.requireActual('../../constants');

  return { ...constants, TEMPLATES_DIR: '/foo/templates-dir' };
});

jest.mock('../../types/misc', () => ({
  FontAssetType: { TTF: 'TTF', EOT: 'eot' },
  OtherAssetType: { CSS: 'css', HTML: 'html' },
  ASSET_TYPES: { ttf: 'ttf', eot: 'eot', css: 'css', html: 'html' },
  ASSET_TYPES_WITH_TEMPLATE: ['html', 'css']
}));

jest.mock('../../utils/codepoints', () => ({
  getCodepoints: jest.fn(() => ({ __mock: 'processed-codepoint__' }))
}));

describe('Font generator options', () => {
  beforeEach(() => {
    getCodepointsMock.mockClear();
  });

  test('`prefillOptions` correctly extends default values for each type and prefills missing ones', () => {
    expect(
      prefillOptions<any, any>(
        ['html', 'ttf', 'eot', 'css', 'foo'],
        { html: { a: 'a', c: 'c', baseVal: 'custom' }, ttf: { foo: 'bar' } },
        key => ({ baseVal: key })
      )
    ).toEqual({
      ttf: { baseVal: 'ttf', foo: 'bar' },
      eot: { baseVal: 'eot' },
      css: { baseVal: 'css' },
      html: { baseVal: 'custom', a: 'a', c: 'c' },
      foo: { baseVal: 'foo' }
    });
  });

  test('`prefillOptions` correctly replaces default values when handling primitives', () => {
    expect(
      prefillOptions<any, any>(
        ['html', 'ttf', 'foo', 'eot'],
        { html: 'custom-html-val', ttf: 'custom-ttf-val' },
        key => `default-${key}-val`
      )
    ).toEqual({
      html: 'custom-html-val',
      ttf: 'custom-ttf-val',
      eot: 'default-eot-val',
      foo: 'default-foo-val'
    });
  });

  test('`getGeneratorOptions` produces usable font generator options including given `assets` and sanitised `formatOptions`', () => {
    const outputDir = '/dev/null';
    const formatOptions = { eot: { foo: 'bar' } } as any;
    const pathOptions = { eot: 'test' } as any;
    const options = {
      __mock: 'assetsMap__',
      outputDir,
      formatOptions,
      pathOptions
    } as any;
    const assets = { __mock: 'runnerOptions__' } as unknown as AssetsMap;
    const generatorOptions = getGeneratorOptions(options, assets);
    expect(generatorOptions).toEqual(
      expect.objectContaining({
        ...options,
        assets,
        codepoints: { __mock: 'processed-codepoint__' },
        formatOptions: {
          ttf: {},
          eot: { foo: 'bar' },
          css: {},
          html: {}
        }
      })
    );
    expect(generatorOptions.templates.css).toBe('/foo/templates-dir/css.hbs');
    expect(generatorOptions.templates.html).toBe('/foo/templates-dir/html.hbs');

    expect(Object.keys(generatorOptions.formatOptions)).toHaveLength(
      Object.keys(ASSET_TYPES).length
    );

    expect(Object.keys(generatorOptions.templates)).toHaveLength(
      ASSET_TYPES_WITH_TEMPLATE.length
    );
  });

  test('`getGeneratorOptions` calls `getCodepoints` with input assets and codepoints', () => {
    const codepointsIn = { foo: 'bar' };
    const options = { codepoints: codepointsIn } as any;
    const assets = {} as unknown as AssetsMap;

    getGeneratorOptions(options, assets);

    expect(getCodepointsMock).toHaveBeenCalledTimes(1);
    expect(getCodepointsMock).toHaveBeenCalledWith(assets, codepointsIn);
  });

  test('`getGeneratorOptions` correctly processes templates option', () => {
    const options = { templates: { html: 'user-template.hbs' } } as any;
    const assets = {} as unknown as AssetsMap;

    expect(getGeneratorOptions(options, assets).templates.css).toMatch(
      '/foo/templates-dir/css.hbs'
    );
    expect(getGeneratorOptions(options, assets).templates.html).toEqual(
      'user-template.hbs'
    );
  });
});
