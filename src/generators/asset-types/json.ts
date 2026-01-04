import { FontGenerator } from '../../types/generator.js';

const generator: FontGenerator = {
  generate: async ({ formatOptions: { json } = {}, codepoints }) =>
    JSON.stringify(codepoints, null, json?.indent)
};

export default generator;
