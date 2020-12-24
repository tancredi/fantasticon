import { DEFAULT_START_CODEPOINT } from '../constants';
import { AssetsMap } from './assets';

export type CodepointsMap = { [key: string]: number };

export const getCodepoints = (
  assets: AssetsMap,
  predefined: CodepointsMap = {},
  start = DEFAULT_START_CODEPOINT
): CodepointsMap => {
  const out: CodepointsMap = {};
  const used = Object.values(predefined);
  let current: number = start;

  const getNextCodepoint = () => {
    while (used.includes(current)) {
      current++;
    }

    const res = current;
    current++;
    return res;
  };

  for (const id of Object.keys(assets)) {
    if (!predefined[id]) {
      out[id] = getNextCodepoint();
    }
  }

  return { ...predefined, ...out };
};

export const getHexCodepoint = (decimalCodepoint: number): string =>
  decimalCodepoint.toString(16);
