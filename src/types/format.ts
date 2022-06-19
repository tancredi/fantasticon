import svg2ttf from 'svg2ttf';
import ttf2woff from 'ttf2woff';
import { SvgIcons2FontOptions } from 'svgicons2svgfont';
import { Arguments } from '../types/utils';

type WoffOptions = Arguments<typeof ttf2woff>[1];
type TtfOptions = svg2ttf.FontOptions;
type SvgOptions = Omit<
  SvgIcons2FontOptions,
  'fontName' | 'fontHeight' | 'descent' | 'normalize'
>;

interface JsonOptions {
  indent?: number;
}

type TsType = 'enum' | 'stringLiteral';

interface TsOptions {
  /**
   * Choose if the codepoints constant should be typed
   * with an enum and/or a string literal type.
   * @defaultValue `['stringLiteral', 'enum']`
   */
  types?: TsType[];
  /**
   * .ts file has `"` by default - `true` will produce `'`.
   * @defaultValue `false`
   */
  singleQuotes?: boolean;
  /**
   * the codepoints constant is exported as readonly
   * ```ts
   * export const ICONS_CODEPOINTS = {
   *   example: '1234',
   * } as const;
   * ```
   * @defaultValue `true`
   */
  asConst?: boolean;
}

export interface FormatOptions {
  woff?: WoffOptions;
  ttf?: TtfOptions;
  svg?: SvgOptions;
  json?: JsonOptions;
  ts?: TsOptions;
}
