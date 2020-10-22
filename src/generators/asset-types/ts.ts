import { FontGenerator } from '../../types/generator';
import { pascalCase, constantCase } from 'change-case';

const generator: FontGenerator = {
  generate: async ({ name, codepoints, assets }) => {
    const enumName = pascalCase(name);
    const codepointsName = `${constantCase(name)}_CODEPOINTS`;
    const typeName = `${pascalCase(name)}Id`;

    return [
      `export enum ${enumName} {`,
      Object.keys(assets)
        .map(key => `  ${pascalCase(key)} = '${key}'`)
        .join(',\n'),
      '}\n',

      `export const ${codepointsName}: { [key in ${enumName}]: string } = {`,
      Object.keys(assets)
        .map(key => `  [${enumName}.${pascalCase(key)}]: '${codepoints[key]}'`)
        .join(',\n'),
      '}\n',

      `export type ${typeName} =`,
      Object.keys(assets)
        .map(key => `  | '${key}'`)
        .join('\n') + ';'
    ].join('\n');
  }
};

export default generator;
