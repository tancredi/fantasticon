import tsGen from '../ts';
import { join, dirname } from 'path';
import { FontGeneratorOptions } from '../../../types/generator';
import { DEFAULT_OPTIONS } from '../../../constants';
import { FormatOptions } from '../../../types/format';

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

const getCleanGen = async ({
  formatOptions = DEFAULT_OPTIONS.formatOptions as FormatOptions,
  rmWhiteSpace = false
}: {
  formatOptions?: FormatOptions;
  rmWhiteSpace?: boolean;
} = {}) => {
  const result = await tsGen.generate({ ...mockOptions, formatOptions }, null);
  if (rmWhiteSpace) {
    return cleanWhiteSpace(String(result));
  }
  return String(result);
};

describe('`TS` asset generator', () => {
  test('renders expected TypeScript module content', async () => {
    expect(await getCleanGen({ rmWhiteSpace: true })).toMatchSnapshot();
  });

  test('extracts string literal type from enum when given', async () => {
    expect(await getCleanGen()).toContain(
      'export type MyIconsSetId = `${MyIconsSet}`;'
    );
  });

  test('defines string literal as typeof extraction of the constant', async () => {
    const result = await getCleanGen({
      formatOptions: { ts: { types: ['stringLiteral'], asConst: true } }
    });
    expect(result).toContain(
      'export type MyIconsSetKey = typeof MY_ICONS_SET_CODEPOINTS[number];'
    );
    expect(result).toContain('export const MY_ICONS_SET_CODEPOINTS = {');
  });

  test('defines constant with "as const;" when asConst given and string literal not extracted from constant', async () => {
    expect(
      await getCleanGen({
        formatOptions: {
          ts: { types: ['enum', 'stringLiteral'], asConst: true }
        }
      })
    ).toContain(
      'export const MY_ICONS_SET_CODEPOINTS: readonly { [key in MyIconsSetId]: string } = {'
    );
  });

  test('defines plain string literal type when asConst is false', async () => {
    expect(
      await getCleanGen({
        rmWhiteSpace: true,
        formatOptions: { ts: { types: ['stringLiteral'], asConst: false } }
      })
    ).toContain('export type MyIconsSetId = | "foo" | "bar";');
  });

  test('sets readonly and const when only enum and asConst', async () => {
    const result = await getCleanGen({
      rmWhiteSpace: false,
      formatOptions: { ts: { types: ['enum'], asConst: true } }
    });
    expect(result).toContain(
      'export const MY_ICONS_SET_CODEPOINTS: readonly { [key in MyIconsSet]: string } = {'
    );
    expect(result).toContain('} as const;');
  });

  test('uses single quotes when singleQuotes on string literal and const', async () => {
    const result = await getCleanGen({
      rmWhiteSpace: false,
      formatOptions: {
        ts: { types: ['stringLiteral'], asConst: true, singleQuotes: true }
      }
    });
    expect(result).toContain("'");
    expect(result).not.toContain('"');
  });

  test('uses single quotes when singleQuotes on enum and const', async () => {
    const result = await getCleanGen({
      rmWhiteSpace: false,
      formatOptions: {
        ts: { types: ['enum'], asConst: true, singleQuotes: true }
      }
    });
    expect(result).toContain("'");
    expect(result).not.toContain('"');
  });

  test('uses single quotes when singleQuotes on enum and stringLiteral and const', async () => {
    const result = await getCleanGen({
      rmWhiteSpace: false,
      formatOptions: {
        ts: {
          types: ['enum', 'stringLiteral'],
          asConst: true,
          singleQuotes: true
        }
      }
    });
    expect(result).toContain("'");
    expect(result).not.toContain('"');
  });

  test('no string and no enum when no as const', async () => {
    const result = await getCleanGen({
      rmWhiteSpace: false,
      formatOptions: {
        ts: { types: [], asConst: false }
      }
    });
    expect(result).toContain('export const MY_ICONS_SET_CODEPOINTS = {');
    expect(result).not.toContain('} as const;');
    expect(result).not.toContain('export type MyIconsSetId =');
    expect(result).not.toContain('export enum MyIconsSet {');
  });

  test('no string and no enum when with as const', async () => {
    const result = await getCleanGen({
      rmWhiteSpace: false,
      formatOptions: {
        ts: { types: [], asConst: true }
      }
    });
    expect(result).toContain('export const MY_ICONS_SET_CODEPOINTS = {');
    expect(result).toContain('} as const;');
    expect(result).not.toContain('export type MyIconsSetId =');
    expect(result).not.toContain('export enum MyIconsSet {');
  });
});
