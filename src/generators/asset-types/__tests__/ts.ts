import tsGen from '../ts';

const mockAssets = { foo: {}, bar: {} };

const mockCodepoints = { foo: 'oof', bar: 'baz' };

const mockOptions = {
  name: 'my-icons-set',
  assets: mockAssets,
  codepoints: mockCodepoints
} as any;

const getCleanGen = async () =>
  ((await tsGen.generate(mockOptions, null)) as string)
    .replace(/\n+/, '')
    .replace(/\s+/g, ' ');

describe('`TS` asset generator', () => {
  test('renders expected TypeScript module content', async () => {
    expect(await tsGen.generate(mockOptions, null)).toMatchSnapshot();
  });

  test('correctly renders type declaration', async () => {
    expect(await getCleanGen()).toContain(
      'export type MyIconsSetId = | "foo" | "bar";'
    );
  });

  test('correctly enum declaration', async () => {
    expect(await getCleanGen()).toContain(
      'export enum MyIconsSet { Foo = "foo", Bar = "bar", }'
    );
  });

  test('correctly codepoints declaration', async () => {
    expect(await getCleanGen()).toContain(
      'export const MY_ICONS_SET_CODEPOINTS: { [key in MyIconsSet]: string }' +
        ' = { [MyIconsSet.Foo]: "oof", [MyIconsSet.Bar]: "baz", };'
    );
  });
});
