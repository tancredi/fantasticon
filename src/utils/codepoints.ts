import { AssetsMap } from './assets';
import { DEFAULT_START_CODEPOINT } from '../constants';

export type CodepointsMap = { [key: string]: number };

export const getCodepoints = (
  assets: AssetsMap,
  start = DEFAULT_START_CODEPOINT,
  predefined: CodepointsMap = {}
): CodepointsMap => {
  2;
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
