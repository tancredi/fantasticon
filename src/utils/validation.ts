import { checkPath } from './fs-async';

export const parseNumeric = (value: string) => {
  const out = Number(value);

  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    Number.isNaN(out)
  ) {
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

export const parseFunction = (value: Function) => {
  if (typeof value !== 'function') {
    throw new Error(`${value} is not a function`);
  }

  return value;
};

export const listMembersParser =
  <T extends string>(allowedValues: T[]) =>
  (values: string[]) => {
    for (const value of values) {
      if (!allowedValues.includes(value as any)) {
        throw new Error(
          [
            `${value} is not valid`,
            `accepted values are: ${allowedValues.join(', ')}`
          ].join(' - ')
        );
      }
    }

    return values as T[];
  };

export const removeUndefined = (object: Object) => {
  for (const key of Object.keys(object)) {
    if (typeof object[key] === 'undefined') {
      delete object[key];
    }
  }

  return object;
};

export const parseBoolean = (val: any) => {
  if (typeof val === 'string' && ['1', '0', 'true', 'false'].includes(val)) {
    return val === 'true' || val === '1';
  } else if (typeof val === 'number' && [0, 1].includes(val)) {
    return val === 1;
  } else if (typeof val === 'boolean') {
    return val;
  }

  throw new Error(`must be a boolean value`);
};

const skipIfMatching =
  (match: any) => (fn: (value: any, cur?: any) => any) => (val: any) =>
    val === match ? match : fn(val);

export const parseDir = async (dirname: string) => {
  if ((await checkPath(dirname, 'directory')) === false) {
    throw new Error(`${dirname} is not a directory`);
  }

  return dirname;
};

export const nullable = skipIfMatching(null);

export const optional = skipIfMatching(undefined);
