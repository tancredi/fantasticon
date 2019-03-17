import { FontType } from './misc';
import { Omit } from './utils';

export interface RunnerOptions {
  types: FontType[];
  name: string;
  outDir: string;
}

export type RunnerOptionsDefaults = Pick<RunnerOptions, 'types'>;

export type RunnerOptionsInput = Omit<
  RunnerOptions,
  keyof RunnerOptionsDefaults
> &
  Partial<RunnerOptionsDefaults>;
