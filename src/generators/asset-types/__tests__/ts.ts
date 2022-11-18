import tsGen from '../ts';
import { join, dirname } from 'path';

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
  it('renders expected TypeScript module content', async () => {
    expect(await tsGen.generate(mockOptions, null)).toMatchSnapshot();
  });

  it.each([
    { formatOptions: { ts: { literalIdName: undefined } } },
    undefined,
    { formatOptions: { ts: { literalIdName: 'Foo' } } }
  ])('generates correct type declaration - config: %j', async options => {
    expect(await getCleanGen({ ...mockOptions, ...options })).toContain(
      `export type ${
        options?.formatOptions?.ts?.literalIdName || 'MyIconsSetId'
      } = | "foo" | "bar";`
    );
  });

  it.each([
    { formatOptions: { ts: { enumName: undefined } } },
    undefined,
    { formatOptions: { ts: { enumName: 'Foo' } } }
  ])('generates correct enum declaration - config: %j', async options => {
    expect(await getCleanGen({ ...mockOptions, ...options })).toContain(
      `export enum ${
        options?.formatOptions?.ts?.enumName || 'MyIconsSet'
      } { Foo = "foo", Bar = "bar", }`
    );
  });

  it.each([
    { formatOptions: { ts: { constantName: undefined } } },
    undefined,
    { formatOptions: { ts: { constantName: 'FOO' } } }
  ])(
    'generates correct codepoints declaration - options: %j',
    async options => {
      expect(await getCleanGen({ ...mockOptions, ...options })).toContain(
        `export const ${
          options?.formatOptions?.ts?.constantName || 'MY_ICONS_SET_CODEPOINTS'
        }: { [key in MyIconsSet]: string }` +
          ' = { [MyIconsSet.Foo]: "4265", [MyIconsSet.Bar]: "1231", };'
      );
    }
  );

  it('generates single quotes if format option passed', async () => {
    expect(
      await tsGen.generate(
        { ...mockOptions, formatOptions: { ts: { singleQuotes: true } } },
        null
      )
    ).toMatchSnapshot();
  });

  it('generates no key string literal type if option specifies it', async () => {
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

  it('generates constant with literalId if no enum generated', async () => {
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

  it('generates constant with literalKey if no enum generated', async () => {
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

  it('generates constant only', async () => {
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

  it('prevents enum keys that start with digits', async () => {
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

  it('prevents enum keys that start with digits when digits and chars', async () => {
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
