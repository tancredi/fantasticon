import { AssetsMap } from '../utils/assets';
import { AssetType } from './misc';
import { RunnerOptions, FormatOptions } from './runner';

export type FontGeneratorOptions = RunnerOptions & {
  assets: AssetsMap;
  formatOptions: FormatOptions;
  templates: { [key in AssetType]: string };
};

export type Result = Promise<string | Buffer>;

export type FontGeneratorFn<DependencyT> = (
  options: FontGeneratorOptions,
  dependencyContent: DependencyT extends {} ? DependencyT : null
) => Result;

export type FontGenerator<DependencyT = void> = {
  generate: FontGeneratorFn<DependencyT>;
} & (DependencyT extends {} ? { dependsOn: AssetType } : {});
