import svg2ttf from 'svg2ttf';
import ttf2woff from 'ttf2woff';
import { SvgIcons2FontOptions } from '@ramirezcgn/svgicons2svgfont';
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

interface TsOptions {
  types?: ('enum' | 'constant' | 'literalId' | 'literalKey')[];
  singleQuotes?: boolean;
}

export interface FormatOptions {
  woff?: WoffOptions;
  ttf?: TtfOptions;
  svg?: SvgOptions;
  json?: JsonOptions;
  ts?: TsOptions;
}
