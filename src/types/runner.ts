import { SvgIcons2FontOptions } from 'svgicons2svgfont';
import { CodepointsMap } from '../utils/codepoints';
import { FontAssetType, OtherAssetType, AssetType } from './misc';

export interface RunnerMandatoryOptions {
  inputDir: string;
  outputDir: string;
}

export interface FormatOptions {
  eot?: any;
  woff2?: any;
  woff?: any;
  ttf?: any;
  svg?: Pick<
    SvgIcons2FontOptions,
    | 'fontId'
    | 'fontStyle'
    | 'fontWeight'
    | 'fixedWidth'
    | 'centerHorizontally'
    | 'metadata'
  >;
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
  name: string;
  fontTypes: FontAssetType[];
  assetTypes: OtherAssetType[];
  formatOptions: FormatOptions;
  pathOptions: { [key in AssetType]?: string };
  codepoints: CodepointsMap;
  fontHeight: number;
  descent: number;
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
