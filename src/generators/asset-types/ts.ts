import { pascal as pascalCase, constant as constantCase } from 'case';
import { FontGenerator } from '../../types/generator';

const generateEnumKeys = (assetKeys: string[]): Record<string, string> =>
  assetKeys
    .map(name => {
      const enumName = pascalCase(name);
      const prefix = enumName.match(/^\d/) ? 'i' : '';

      return {
        [name]: `${prefix}${enumName}`
      };
    })
    .reduce((prev, curr) => Object.assign(prev, curr), {});

const generateEnums = (
  enumName: string,
  enumKeys: { [eKey: string]: string },
  quote = '"'
): string =>
  [
    `export enum ${enumName} {`,
    ...Object.entries(enumKeys).map(
      ([enumValue, enumKey]) => `  ${enumKey} = ${quote}${enumValue}${quote},`
    ),
    '}\n'
  ].join('\n');

const generateConstant = ({
  constantName,
  enumName,
  literalIdName,
  literalKeyName,
  enumKeys,
  codepoints,
  quote = '"',
  kind = {}
}: {
  constantName: string;
  enumName: string;
  literalIdName: string;
  literalKeyName: string;
  enumKeys: { [eKey: string]: string };
  codepoints: Record<string, number>;
  quote?: '"' | "'";
  kind: Record<string, boolean>;
}): string => {
  let varType = ': Record<string, string>';

  if (kind.enum) {
    varType = `: { [key in ${enumName}]: string }`;
  } else if (kind.literalId) {
    varType = `: { [key in ${literalIdName}]: string }`;
  } else if (kind.literalKey) {
    varType = `: { [key in ${literalKeyName}]: string }`;
  }

  return [
    `export const ${constantName}${varType} = {`,
    Object.entries(enumKeys)
      .map(([enumValue, enumKey]) => {
        const key = kind.enum
          ? `[${enumName}.${enumKey}]`
          : `${quote}${enumValue}${quote}`;
        return `  ${key}: ${quote}${codepoints[enumValue]}${quote},`;
      })
      .join('\n'),
    '};\n'
  ].join('\n');
};

const generateStringLiterals = (
  typeName: string,
  literals: string[],
  quote = '"'
): string =>
  [
    `export type ${typeName} =`,
    `${literals.map(key => `  | ${quote}${key}${quote}`).join('\n')};\n`
  ].join('\n');

const generator: FontGenerator = {
  generate: async ({
    name,
    codepoints,
    assets,
    formatOptions: { ts } = {}
  }) => {
    const quote = Boolean(ts?.singleQuotes) ? "'" : '"';
    const generateKind: Record<string, boolean> = (
      Boolean(ts?.types?.length)
        ? ts.types
        : ['enum', 'constant', 'literalId', 'literalKey']
    )
      .map(kind => ({ [kind]: true }))
      .reduce((prev, curr) => Object.assign(prev, curr), {});

    const enumName = ts?.enumName || pascalCase(name);
    const constantName = ts?.constantName || `${constantCase(name)}_CODEPOINTS`;
    const literalIdName = ts?.literalIdName || `${pascalCase(name)}Id`;
    const literalKeyName = ts?.literalKeyName || `${pascalCase(name)}Key`;
    const names = { enumName, constantName, literalIdName, literalKeyName };

    const enumKeys = generateEnumKeys(Object.keys(assets));

    const stringLiteralId = generateKind.literalId
      ? generateStringLiterals(literalIdName, Object.keys(enumKeys), quote)
      : null;
    const stringLiteralKey = generateKind.literalKey
      ? generateStringLiterals(literalKeyName, Object.values(enumKeys), quote)
      : null;

    const enums = generateKind.enum
      ? generateEnums(enumName, enumKeys, quote)
      : null;
    const constant = generateKind.constant
      ? generateConstant({
          ...names,
          enumKeys,
          codepoints,
          quote,
          kind: generateKind
        })
      : null;

    return [stringLiteralId, stringLiteralKey, enums, constant]
      .filter(Boolean)
      .join('\n');
  }
};

export default generator;
