import { resolve, join } from 'path';
import { RunnerOptionalOptions } from './types/runner';
import { FontAssetType, OtherAssetType } from './types/misc';

export const DEFAULT_OPTIONS: RunnerOptionalOptions = {
  name: 'icons',
  fontTypes: [FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF],
  assetTypes: [
    OtherAssetType.CSS,
    OtherAssetType.HTML,
    OtherAssetType.JSON,
    OtherAssetType.TS
  ],
  formatOptions: { json: { indent: 4 } },
  pathOptions: {},
  codepoints: {},
  round: undefined,
  fontHeight: 300,
  descent: undefined,
  normalize: undefined,
  selector: null,
  tag: 'i',
  prefix: 'icon',
  fontsUrl: undefined
};

export const DEFAULT_START_CODEPOINT = 0xf101;

export const TEMPLATES_PATH = resolve(__dirname, '../templates');

export const TEMPLATE_PATHS = {
  css: join(TEMPLATES_PATH, 'css.hbs'),
  scss: join(TEMPLATES_PATH, 'scss.hbs'),
  html: join(TEMPLATES_PATH, 'html.hbs')
};
