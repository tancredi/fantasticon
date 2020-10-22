import { RunnerOptionalOptions } from './types/runner';
import { FontAssetType, OtherAssetType } from './types/misc';

export const DEFAULT_OPTIONS: RunnerOptionalOptions = {
  name: 'icons',
  fontTypes: [FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF],
  assetTypes: [OtherAssetType.CSS, OtherAssetType.HTML, OtherAssetType.JSON],
  formatOptions: {},
  pathOptions: {},
  codepoints: {},
  round: undefined,
  fontHeight: 300,
  descent: undefined,
  normalize: undefined,
  selector: null,
  tag: 'i',
  prefix: 'icon',
  fontsUrl: null
};

export const DEFAULT_START_CODEPOINT = 0xf101;
