import { FontAssetType } from '../types/misc';

export const parseNumeric = (value: string) => {
  const out = Number(value);

  if (Number.isNaN(out)) {
    throw new Error(`${value} is not a valid number`);
  }

  return out;
};

export const parseFontType = (value: string) => {
  const typeValues = Object.values(FontAssetType);

  if (!typeValues.includes(value as any)) {
    throw new Error(
      [
        `${value} is not a valid font type`,
        `accepted values are: ${typeValues.join(', ')}`
      ].join(' - ')
    );
  }

  return value as FontAssetType;
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
