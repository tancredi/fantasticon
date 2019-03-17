import { FontType } from './misc';
import { AssetsMap } from '../utils/assets';
import { CodepointsMap } from '../utils/codepoints';

export interface FontGeneratorOptions {
  assets: AssetsMap;
  codepoints: CodepointsMap;
  fontName: string;
  fontHeight: number;
  descent: number;
  normalize: boolean;
  round: boolean;
  formatOptions: { [key in FontType]: any };
}

export type Callback = (
  error: Error | null,
  fontContents: string | Buffer
) => void;

export type FontGeneratorFn<DependencyT> = DependencyT extends {}
  ? (
      options: FontGeneratorOptions,
      dependencyContent: DependencyT,
      done: Callback
    ) => void
  : (options: FontGeneratorOptions, done: Callback) => void;

export type FontGenerator<DependencyT = void> = {
  generate: FontGeneratorFn<DependencyT>;
} & (DependencyT extends {}
  ? {
      dependsOn: FontType;
    }
  : {});
