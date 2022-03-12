import { join, dirname } from 'path';
import tsGen from '../ts';

const mockAssets = {
  foo: {
    id: 'foo',
    absolutePath: '/path/there/foo.svg',
    relativePath: '../there/foo.svg'
  },
  bar: {
    id: 'bar',
    absolutePath: '/path/there/bar.svg',
    relativePath: '../there/bar.svg'
  }
};

const mockCodepoints = { foo: 4265, bar: 1231 };

const mockOptions = {
  name: 'my-icons-set',
  assets: mockAssets,
  codepoints: mockCodepoints,
  inputDir: join(dirname(__filename), 'fixtures'),
  outputDir: '/dev/null'
} as any;

const cleanWhiteSpace = (subject: string): string =>
  subject.replace(/\n+/, '').replace(/\s+/g, ' ');

const getCleanGen = async (options = {}) =>
  cleanWhiteSpace(
    (await tsGen.generate({ ...mockOptions, ...options }, null)) as string
  );

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
        ' = { [MyIconsSet.Foo]: "4265", [MyIconsSet.Bar]: "1231", };'
    );
  });

  test('generates single quotes if format option passed', async () => {
    expect(
      await tsGen.generate(
        {
          ...mockOptions,
          formatOptions: { ts: { singleQuotes: true } }
        },
        null
      )
    ).toMatchSnapshot();
  });

  test('generates no key string literal type if option passed like that', async () => {
    const result = await tsGen.generate(
      {
        ...mockOptions,
        formatOptions: { ts: { types: ['constant', 'enum'] } }
      },
      null
    );
    const cleanResult = cleanWhiteSpace(result as string);
    expect(result).toMatchSnapshot();

    expect(cleanResult).not.toContain(
      'export type MyIconsSetKey = | "Foo" | "Bar";'
    );
    expect(cleanResult).not.toContain(
      'export type MyIconsSetId = | "foo" | "bar";'
    );
  });

  test('generates constant with literalId if no enum generated', async () => {
    const result = await tsGen.generate(
      {
        ...mockOptions,
        formatOptions: { ts: { types: ['constant', 'literalId'] } }
      },
      null
    );
    const cleanResult = cleanWhiteSpace(result as string);

    expect(result).toMatchSnapshot();
    expect(cleanResult).toContain(
      'export const MY_ICONS_SET_CODEPOINTS: { [key in MyIconsSetId]: string }'
    );

    expect(cleanResult).not.toContain(
      'export type MyIconsSetKey = | "Foo" | "Bar";'
    );
    expect(cleanResult).not.toContain('export enum MyIconsSet');
  });

  test('generates constant with literalKey if no enum generated', async () => {
    const result = await tsGen.generate(
      {
        ...mockOptions,
        formatOptions: { ts: { types: ['constant', 'literalKey'] } }
      },
      null
    );
    const cleanResult = cleanWhiteSpace(result as string);

    expect(result).toMatchSnapshot();
    expect(cleanResult).toContain(
      'export const MY_ICONS_SET_CODEPOINTS: { [key in MyIconsSetKey]: string }'
    );

    expect(cleanResult).not.toContain(
      'export type MyIconsSetId = | "foo" | "bar";'
    );
    expect(cleanResult).not.toContain('export enum MyIconsSet');
  });

  test('generates constant only', async () => {
    const result = await tsGen.generate(
      {
        ...mockOptions,
        formatOptions: { ts: { types: ['constant'] } }
      },
      null
    );
    const cleanResult = cleanWhiteSpace(result as string);

    expect(result).toMatchSnapshot();
    expect(cleanResult).toContain(
      'export const MY_ICONS_SET_CODEPOINTS: Record<string, string>'
    );

    expect(cleanResult).not.toContain(
      'export type MyIconsSetId = | "foo" | "bar";'
    );
    expect(cleanResult).not.toContain('export enum MyIconsSet');
  });

  test('prevents enum keys that start with digits', async () => {
    const result = await tsGen.generate(
      {
        ...mockOptions,
        assets: { 1234: mockAssets.foo, 5678: mockAssets.bar }
      },
      null
    );
    const cleanResult = cleanWhiteSpace(result as string);

    expect(result).toMatchSnapshot();
    expect(cleanResult).toContain(
      'export type MyIconsSetId = | "1234" | "5678";'
    );
    expect(cleanResult).toContain(
      'export type MyIconsSetKey = | "i1234" | "i5678";'
    );
    expect(cleanResult).toContain(
      'export enum MyIconsSet { i1234 = "1234", i5678 = "5678", }'
    );
  });

  test('prevents enum keys that start with digits when digits and chars', async () => {
    const result = await tsGen.generate(
      {
        ...mockOptions,
        assets: {
          '1234asdf': mockAssets.foo,
          '5678ab': mockAssets.bar,
          foo: mockAssets.foo
        }
      },
      null
    );
    const cleanResult = cleanWhiteSpace(result as string);

    expect(result).toMatchSnapshot();
    expect(cleanResult).toContain(
      'export type MyIconsSetId = | "1234asdf" | "5678ab" | "foo";'
    );
    expect(cleanResult).toContain(
      'export type MyIconsSetKey = | "i1234asdf" | "i5678ab" | "Foo";'
    );
    expect(cleanResult).toContain(
      'export enum MyIconsSet { i1234asdf = "1234asdf", i5678ab = "5678ab", Foo = "foo", }'
    );
  });
});
