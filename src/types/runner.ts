import { CodepointsMap } from '../utils/codepoints';
import { FontType } from './misc';
import { Omit } from './utils';

export interface RunnerMandatoryOptions {
  inDir: string;
  outDir: string;
}

export type RunnerOptionalOptions = {
  name: string;
  types: FontType[];
  formatOptions: { [key in FontType]?: any };
  codepoints: CodepointsMap;
  fontHeight: number;
  descent: number;
  normalize: boolean;
  round: boolean;
};

export type RunnerOptionsInput = RunnerMandatoryOptions &
  Partial<RunnerOptionalOptions>;

export type RunnerOptions = RunnerMandatoryOptions & RunnerOptionalOptions;
