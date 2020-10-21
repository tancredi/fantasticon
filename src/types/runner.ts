import { CodepointsMap } from '../utils/codepoints';
import { FontAssetType, OtherAssetType, AssetType } from './misc';

export interface RunnerMandatoryOptions {
  inputDir: string;
  outputDir: string;
}

export type RunnerOptionalOptions = {
  name: string;
  fontTypes: FontAssetType[];
  assetTypes: OtherAssetType[];
  formatOptions: { [key in AssetType]?: any };
  codepoints: CodepointsMap;
  fontHeight: number;
  descent: number;
  normalize: boolean;
  round: boolean;
};

export type RunnerOptionsInput = RunnerMandatoryOptions &
  Partial<RunnerOptionalOptions>;

export type RunnerOptions = RunnerMandatoryOptions & RunnerOptionalOptions;
