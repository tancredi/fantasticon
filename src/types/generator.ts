import { AssetsMap } from '../utils/assets';
import { AssetType, OtherAssetType } from './misc';
import { RunnerOptions } from './runner';
import { FormatOptions } from './format';

export type FontGeneratorOptions = RunnerOptions & {
  assets: AssetsMap;
  formatOptions: FormatOptions;
  templates: { [key: string]: string };
};

export type Result = Promise<string | Buffer>;

export type FontGeneratorFn<DependencyT> = (
  options: FontGeneratorOptions,
  dependencyContent: DependencyT extends {} ? DependencyT : null,
  ext?: string
) => Result;

export type FontGenerator<DependencyT = void> = {
  generate: FontGeneratorFn<DependencyT>;
} & (DependencyT extends {} ? { dependsOn: AssetType } : {});
