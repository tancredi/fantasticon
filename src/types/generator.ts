import { AssetsMap } from '../utils/assets';
import { CodepointsMap } from '../utils/codepoints';
import { FontType } from './misc';
import { RunnerOptions } from './runner';

export type FontGeneratorOptions = RunnerOptions & {
  assets: AssetsMap;
  fontHeight: number;
  formatOptions: { [key in FontType]: any };
};

export type Result = Promise<string | Buffer>;

export type FontGeneratorFn<DependencyT> = (
  options: FontGeneratorOptions,
  dependencyContent: DependencyT extends {} ? DependencyT : null
) => Result;

export type FontGenerator<DependencyT = void> = {
  generate: FontGeneratorFn<DependencyT>;
} & (DependencyT extends {}
  ? {
      dependsOn: FontType;
    }
  : {});
