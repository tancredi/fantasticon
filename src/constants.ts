import { RunnerOptionsDefaults } from './types/runner';
import { FontType } from './types/misc';

export const DEFAULT_OPTIONS: RunnerOptionsDefaults = {
  types: [FontType.EOT, FontType.WOFF2, FontType.WOFF]
};

export const DEFAULT_START_CODEPOINT = 0xf101;
