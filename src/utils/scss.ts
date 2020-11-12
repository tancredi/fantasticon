import { kebabCase, snakeCase } from 'lodash';
import { DEFAULT_OPTIONS } from '../constants';

export const buildMainSelector = ({
  name = DEFAULT_OPTIONS.name,
  selector = DEFAULT_OPTIONS.selector,
  tag = DEFAULT_OPTIONS.tag,
  prefix = DEFAULT_OPTIONS.prefix,
  scss = false
}: {
  name?: string;
  selector?: string;
  tag?: string;
  prefix?: string;
  scss?: boolean;
} = {}): {
  mainSelector: string;
  tag?: string;
  selector: string;
  prefix: string;
  name: string;
  nameSnake: string;
  nameKebab: string;
  startSelector: string;
} => {
  const before = `${scss ? '::' : ':'}before`;

  return {
    name,
    selector,
    tag,
    startSelector: selector || tag,
    prefix,
    nameSnake: snakeCase(name),
    nameKebab: kebabCase(name),
    mainSelector: selector
      ? `${selector}${before}`
      : `${tag}[class^="${prefix}-"]${before}, ${tag}[class*=" ${prefix}-"]${before}`
  };
};

export const buildHelpers = ({
  selector = DEFAULT_OPTIONS.selector,
  tag = DEFAULT_OPTIONS.tag,
  prefix = DEFAULT_OPTIONS.prefix,
  scss = false
}: {
  selector?: string;
  tag?: string;
  prefix?: string;
  scss?: boolean;
} = {}): {
  codepoint: (str: number) => string;
  contentSelector: (str: string) => string;
} => {
  const before = `${scss ? '::' : ':'}before`;
  const mainTag = selector || tag;
  return {
    contentSelector: (key: string): string =>
      `${mainTag}.${prefix}-${key}${before}`,
    codepoint: (codeValue: number): string => `\\${codeValue.toString(16)}`
  };
};

console.log({
  buildMainSelector,
  buildHelpers
});

export default {
  buildMainSelector,
  buildHelpers
};
