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

export type FontGeneratorFn = (
  options: FontGeneratorOptions,
  generated: { [key in FontType]?: string | Buffer },
  done: (error: Error | null, fontContents: string | Buffer) => void
) => void;

export interface FontGenerator {
  dependencies: FontType[];
  generate: FontGeneratorFn;
}
