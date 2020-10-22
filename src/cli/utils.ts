import { FontAssetType, OtherAssetType } from '../types/misc';

export const parseNumeric = (value: string) => {
  const out = Number(value);

  if (Number.isNaN(out)) {
    throw new Error(`${value} is not a valid number`);
  }

  return out;
};

export const parseString = (value: string) => {
  if (typeof value !== 'string') {
    throw new Error(`${value} is not a string`);
  }

  return value;
};

export const validatePositionals = (args: string[]) => {
  if (!args.length) {
    throw new Error('Please specify an input directory');
  } else if (args.length > 1) {
    throw new Error(
      'Only specify one input directory as a positional argument'
    );
  }
};

export const removeUndefined = (object: Object) => {
  for (const key of Object.keys(object)) {
    if (typeof object[key] === 'undefined') {
      delete object[key];
    }
  }

  return object;
};

const validateBelonging = (value: any, accepted: any[], typeStr: string) => {
  if (!accepted.includes(value as any)) {
    throw new Error(
      [
        `${value} is not a valid ${typeStr}`,
        `accepted values are: ${accepted.join(', ')}`
      ].join(' - ')
    );
  }
};

export const parseFontType = (value: string, prev = []) => {
  validateBelonging(value, Object.values(FontAssetType), 'font type');
  return [...prev, value as FontAssetType];
};

export const parseOtherAssetType = (value: string, prev = []) => {
  validateBelonging(value, Object.values(OtherAssetType), 'font type');
  return [...prev, value as OtherAssetType];
};
