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

export const listMembersParser = <T extends string>(
  allowedValues: T[],
  itemName: string
) => (value: string, prev = []) => {
  if (!allowedValues.includes(value as any)) {
    throw new Error(
      [
        `${value} is not a valid ${itemName}`,
        `accepted values are: ${allowedValues.join(', ')}`
      ].join(' - ')
    );
  }

  return [...prev, value as T];
};

export const removeUndefined = (object: Object) => {
  for (const key of Object.keys(object)) {
    if (typeof object[key] === 'undefined') {
      delete object[key];
    }
  }

  return object;
};
