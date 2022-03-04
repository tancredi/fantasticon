import { RunnerOptions } from '../types/runner';
import { DEFAULT_OPTIONS } from '../constants';
import {
  parseDir,
  parseString,
  parseBoolean,
  parseFunction,
  listMembersParser,
  parseNumeric,
  optional,
  nullable
} from '../utils/validation';
import { FontAssetType, OtherAssetType } from '../types/misc';

const CONFIG_VALIDATORS: {
  [key in keyof RunnerOptions]: Array<(val: any, cur: any) => any>;
} = {
  inputDir: [optional(parseString), optional(parseDir)],
  outputDir: [optional(parseString), optional(parseDir)],
  name: [optional(parseString)],
  fontTypes: [listMembersParser(Object.values(FontAssetType))],
  assetTypes: [listMembersParser(Object.values(OtherAssetType))],
  formatOptions: [],
  pathOptions: [],
  templates: [],
  codepoints: [],
  fontHeight: [optional(parseNumeric)],
  descent: [optional(parseNumeric)],
  normalize: [optional(parseBoolean)],
  round: [optional(parseNumeric)],
  selector: [nullable(parseString)],
  tag: [parseString],
  prefix: [parseString],
  fontsUrl: [optional(parseString)],
  getIconId: [optional(parseFunction)],
  addLigatures: [optional(parseBoolean)]
};

export const parseConfig = async (input: object = {}) => {
  const options = { ...DEFAULT_OPTIONS, ...input };
  const out = {};
  const allkeys = [
    ...new Set([...Object.keys(options), ...Object.keys(CONFIG_VALIDATORS)])
  ];

  for (const key of allkeys) {
    const validators = CONFIG_VALIDATORS[key];

    if (!validators) {
      throw new Error(`The option '${key}' is not recognised`);
    }

    let val = options[key];

    try {
      for (const fn of validators) {
        val = await fn(val, val);
      }
    } catch (err) {
      throw new Error(`Invalid option ${key}: ${err.message}`);
    }

    out[key] = val;
  }

  return out as any as RunnerOptions;
};
