import { RunnerOptionalOptions } from './types/runner';
import { FontType } from './types/misc';

export const DEFAULT_OPTIONS: RunnerOptionalOptions = {
  name: 'icons',
  types: [FontType.EOT, FontType.WOFF2, FontType.WOFF],
  formatOptions: {},
  codepoints: {},
  round: undefined,
  fontHeight: undefined,
  descent: undefined,
  normalize: undefined
};

export const DEFAULT_START_CODEPOINT = 0xf101;
