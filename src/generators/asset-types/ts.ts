import { pascalCase, constantCase } from 'change-case';
import { FormatOptions } from '../../types/format';
import { FontGenerator, FontGeneratorOptions } from '../../types/generator';

class TsGenerator {
  isStringLiteral = false;
  isEnum = false;
  isAsConst = false;
  isEnumExtractStringLiteral = false;
  isConstExtractStringLiteral = false;

  name: string;
  get enumName(): string {
    return pascalCase(this.name);
  }
  get codepointsName(): string {
    return `${constantCase(this.name)}_CODEPOINTS`;
  }
  get literalIdName(): string {
    return `${pascalCase(this.name)}Id`;
  }
  get literalKeyName(): string {
    return `${pascalCase(this.name)}Key`;
  }
  get keyTypeSig(): string {
    const readonlyStr = this.isAsConst ? 'readonly ' : '';
    if (!this.isStringLiteral && this.isEnum) {
      return `: ${readonlyStr}{ [key in ${this.enumName}]: string }`;
    }
    if (this.isStringLiteral && !this.isConstExtractStringLiteral) {
      return `: ${readonlyStr}{ [key in ${this.literalIdName}]: string }`;
    }
    return '';
  }

  quote = '"';
  codePointDict: Record<string, string>;
  codepoints: FontGeneratorOptions['codepoints'];

  constructor({
    name,
    codepoints,
    assets,
    formatOptions: { ts } = {}
  }: FontGeneratorOptions) {
    this.name = name;
    this.codepoints = codepoints;
    this.createCodePointDict(Object.keys(assets));
    this.isAsConst = Boolean(ts?.asConst);
    this.isEnum = ts?.types?.includes('enum');
    this.isStringLiteral = ts?.types?.includes('stringLiteral');
    this.isEnumExtractStringLiteral = this.isEnum && this.isStringLiteral;
    this.isConstExtractStringLiteral =
      !this.isEnumExtractStringLiteral &&
      this.isAsConst &&
      this.isStringLiteral;
    if (ts?.singleQuotes) {
      this.quote = "'";
    }
  }

  generate(): string {
    return [
      this.generateEnum(),
      this.generateBeforeConstLiteral(),
      this.generateConst(),
      this.generateAfterConstLiteral()
    ]
      .filter(Boolean)
      .join('\n');
  }

  private generateConst(): string {
    const keyDef = this.getConstRecKeyFn();
    const records = Object.entries(this.codePointDict).map(
      ([eVal, eKey]) =>
        `${keyDef([eVal, eKey])}${this.inQuote(this.codepoints[eVal])},`
    );
    return [
      `export const ${this.codepointsName}${this.keyTypeSig} = {`,
      ...records,
      `}${this.isAsConst ? ' as const' : ''};\n`
    ].join('\n');
  }

  private getConstRecKeyFn(): (kv: [string, string]) => string {
    if (this.isEnum && !this.isStringLiteral) {
      return ([, eKey]) => `  [${this.enumName}.${eKey}]: `;
    }
    return ([eVal]) => `  ${this.inQuote(eVal)}: `;
  }

  private generateBeforeConstLiteral(): string {
    if (!this.isStringLiteral || this.isConstExtractStringLiteral) {
      return;
    }
    const exportStatement = `export type ${this.literalIdName} =`;
    if (this.isEnumExtractStringLiteral) {
      return `${exportStatement} \`\${${this.enumName}}\`;\n\n`;
    }
    return (
      [
        exportStatement,
        ...Object.keys(this.codePointDict).map(
          eVal => `  | ${this.inQuote(eVal)}`
        )
      ].join('\n') + ';\n'
    );
  }

  private generateAfterConstLiteral(): string {
    if (!this.isConstExtractStringLiteral) {
      return;
    }
    return `export type ${this.literalKeyName} = typeof ${this.codepointsName}[number];\n`;
  }

  private generateEnum(): string {
    if (!this.isEnum) {
      return;
    }
    return [
      `export enum ${this.enumName} {`,
      ...Object.entries(this.codePointDict).map(
        ([eVal, eKey]) => `  ${eKey} = ${this.inQuote(eVal)},`
      ),
      '}\n\n'
    ].join('\n');
  }

  private inQuote = (val: string | number): string =>
    `${this.quote}${val}${this.quote}`;

  private createCodePointDict(assetKeys: string[]): void {
    this.codePointDict = Object.fromEntries(
      assetKeys.map(name => {
        const enumName = pascalCase(name);
        return [name, `${enumName.match(/^\d/) ? 'i' : ''}${enumName}`];
      })
    );
  }
}

const generator: FontGenerator = {
  generate: async options => {
    const tsGenerator = new TsGenerator(options);
    return tsGenerator.generate();
  }
};

export default generator;
