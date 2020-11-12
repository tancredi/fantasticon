import { SvgIcons2FontOptions } from 'svgicons2svgfont';
import { CodepointsMap } from '../utils/codepoints';
import { FontAssetType, OtherAssetType, AssetType } from './misc';

export interface RunnerMandatoryOptions {
  inputDir: string;
  outputDir: string;
}

export type SvgFormatOptions = Pick<
  SvgIcons2FontOptions,
  | 'fontId'
  | 'fontStyle'
  | 'fontWeight'
  | 'fixedWidth'
  | 'centerHorizontally'
  | 'metadata'
  | 'log'
>;

export interface FormatOptions {
  eot?: any;
  woff2?: any;
  woff?: any;
  ttf?: any;
  svg?: Partial<SvgFormatOptions>;
  css?: any;
  html?: any;
  json?: {
    indent?: number;
  };
  ts?: {
    types?: ('enum' | 'constant' | 'literalId' | 'literalKey')[];
    singleQuotes?: boolean;
  };
}

export type RunnerOptionalOptions = {
  /**
   * The font family name you want.
   */
  name: string;
  fontTypes: FontAssetType[];
  assetTypes: OtherAssetType[];
  formatOptions: FormatOptions;
  customTemplate?: {
    css?: string;
    scss?: string;
    html?: string;
  };
  pathOptions: { [key in AssetType]?: string };
  codepoints: CodepointsMap;
  /**
   * The outputted font height (defaults to the height of the highest input icon).
   */
  fontHeight: number;
  /**
   * The font descent.
   *
   * It is usefull to fix the font baseline yourself.
   */
  descent: number;
  /**
   * Normalize icons by scaling them to the height of the highest icon.
   */
  normalize: boolean;
  round: boolean; // FIXME: SVGIcons2SVGFontStream wants a number here
  selector: string;
  tag: string;
  prefix: string;
  fontsUrl: string;
};

export type RunnerOptionsInput = RunnerMandatoryOptions &
  Partial<RunnerOptionalOptions>;

export type RunnerOptions = RunnerMandatoryOptions &
  Partial<RunnerOptionalOptions>;
