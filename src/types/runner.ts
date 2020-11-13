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
  pathOptions: { [key in AssetType]?: string };
  codepoints: CodepointsMap;
  fontHeight: number;
  descent: number;
  normalize: boolean;
  round: boolean;
  selector: string;
  tag: string;
  templates?: { [key in AssetType]?: string };
  prefix: string;
  fontsUrl: string;
};

export type RunnerOptionsInput = RunnerMandatoryOptions &
  Partial<RunnerOptionalOptions>;

export type RunnerOptions = RunnerMandatoryOptions & RunnerOptionalOptions;
